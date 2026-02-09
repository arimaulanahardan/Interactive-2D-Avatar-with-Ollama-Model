"use client";

import { useState, useRef, useEffect } from "react";
import {
  Expression,
  detectExpression,
  estimateSpeakingDuration,
} from "@/lib/expressionDetector";
import {
  MouthShape,
  generateLipSyncSequence,
  getMouthShapeAtTime,
} from "@/lib/lipSyncEngine";
import { EyeState } from "@/lib/assetConfig";

interface Message {
  role: "user" | "bot";
  content: string;
  expression?: Expression;
}

interface ChatInterfaceProps {
  onExpressionChange: (expression: Expression) => void;
  onSpeakingChange: (speaking: boolean) => void;
  onEyeStateChange: (eyeState: EyeState) => void;
  onMouthShapeChange: (mouthShape: MouthShape) => void;
}

export default function ChatInterface({
  onExpressionChange,
  onSpeakingChange,
  onEyeStateChange,
  onMouthShapeChange,
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content:
        "Hi! I'm your interactive avatar with advanced lip-sync! Send me a message and watch my realistic expressions!",
      expression: "happy",
    },
  ]);
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const lipSyncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isStreamingRef = useRef(false);

  const stopLipSync = () => {
    if (lipSyncIntervalRef.current) {
      clearInterval(lipSyncIntervalRef.current);
      lipSyncIntervalRef.current = null;
    }
    onMouthShapeChange("close");
    onEyeStateChange("open");
    onSpeakingChange(false);
  };

  const startLipSync = (text: string, expression: Expression) => {
    if (lipSyncIntervalRef.current) {
      clearInterval(lipSyncIntervalRef.current);
    }

    if (!text.trim()) return;

    const totalDuration = estimateSpeakingDuration(text);
    const lipSyncSequence = generateLipSyncSequence(text, totalDuration);
    const startTime = Date.now();

    onExpressionChange(expression);
    onSpeakingChange(true);
    onEyeStateChange("open");

    lipSyncIntervalRef.current = setInterval(() => {
      const currentTime = Date.now() - startTime;

      if (currentTime >= totalDuration || !isStreamingRef.current) {
        stopLipSync();
        return;
      }

      const mouthShape = getMouthShapeAtTime(lipSyncSequence, currentTime);
      onMouthShapeChange(mouthShape);

      if (Math.random() > 0.85) {
        onEyeStateChange("close");
        setTimeout(() => onEyeStateChange("open"), 80);
      }
    }, 50);
  };

  useEffect(() => {
    return () => {
      if (lipSyncIntervalRef.current) {
        clearInterval(lipSyncIntervalRef.current);
      }
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput("");
    setIsProcessing(true);
    setStreamingText("");
    isStreamingRef.current = true;

    const userExpression = detectExpression(userInput);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      if (!response.ok) throw new Error("API error");

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader");

      let fullText = "";
      const decoder = new TextDecoder();
      let lastLipSyncUpdate = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        fullText += chunk;
        setStreamingText(fullText);

        const now = Date.now();
        if (now - lastLipSyncUpdate > 200 || fullText.length < 10) {
          startLipSync(fullText, userExpression);
          lastLipSyncUpdate = now;
        }
      }

      isStreamingRef.current = false;

      const botMessage: Message = {
        role: "bot",
        content: fullText,
        expression: userExpression,
      };
      setMessages((prev) => [...prev, botMessage]);
      setStreamingText("");

      stopLipSync();
    } catch (error) {
      console.error("Chat error:", error);
      isStreamingRef.current = false;
      const errorMsg = "Sorry, I encountered an error. Please try again.";
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: errorMsg, expression: "happy" },
      ]);
      setStreamingText("");
      stopLipSync();
    }

    setIsProcessing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickTest = async (testInput: string) => {
    setInput(testInput);
    setTimeout(handleSend, 100);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Chat Interface</h2>

      <div className="h-96 overflow-y-auto mb-4 border border-gray-200 rounded-lg p-4 space-y-3">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              {message.expression && (
                <span className="text-xs opacity-70 mt-1 block">
                  [{message.expression}]
                </span>
              )}
            </div>
          </div>
        ))}
        {streamingText && (
          <div className="flex justify-start">
            <div className="max-w-xs px-4 py-2 rounded-lg bg-gray-200 text-gray-800">
              <p className="text-sm">{streamingText}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isProcessing}
        />
        <button
          onClick={handleSend}
          disabled={isProcessing || !input.trim()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => quickTest("Tell me a short joke")}
          className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200"
          disabled={isProcessing}
        >
          Test Happy
        </button>
        <button
          onClick={() => quickTest("You are stupid and annoying")}
          className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
          disabled={isProcessing}
        >
          Test Angry
        </button>
        <button
          onClick={() =>
            quickTest(
              'Say something with lots of vowels like "amazing wonderful beautiful"',
            )
          }
          className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm hover:bg-yellow-200"
          disabled={isProcessing}
        >
          Test Lip-Sync
        </button>
      </div>
    </div>
  );
}
