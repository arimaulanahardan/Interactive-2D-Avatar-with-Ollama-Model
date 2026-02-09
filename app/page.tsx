"use client";

import { useState } from "react";
import Avatar from "@/components/Avatar";
import ChatInterface from "@/components/ChatInterface";
import { Expression } from "@/lib/expressionDetector";
import { EyeState } from "@/lib/assetConfig";
import { MouthShape } from "@/lib/lipSyncEngine";

export default function Home() {
  const [expression, setExpression] = useState<Expression>("happy");
  const [eyeState, setEyeState] = useState<EyeState>("open");
  const [mouthShape, setMouthShape] = useState<MouthShape>("close");
  const [isSpeaking, setIsSpeaking] = useState(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          Interactive 2D Avatar with Ollama AI
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Real-time AI responses with synchronized lip-sync and natural
          expressions
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col items-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <Avatar
                expression={expression}
                eyeState={eyeState}
                mouthShape={mouthShape}
                isSpeaking={isSpeaking}
              />

              <div className="mt-6 text-center space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <span className="font-semibold text-gray-700">
                    Expression:
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      expression === "happy"
                        ? "bg-green-100 text-green-700"
                        : expression === "angry"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {expression}
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="font-semibold text-gray-700">Eyes:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      eyeState === "open"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                    }`}
                  >
                    {eyeState}
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="font-semibold text-gray-700">Mouth:</span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-700">
                    {mouthShape === "close" ? "closed" : mouthShape}
                  </span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="font-semibold text-gray-700">Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isSpeaking
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {isSpeaking ? "Speaking" : "Idle"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-lg shadow p-4 max-w-md">
              <h3 className="font-semibold text-gray-800 mb-2">✨ Features:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>
                  • <strong>Ollama AI:</strong> Real chatbot responses
                </li>
                <li>
                  • <strong>Streaming Text:</strong> Word-by-word display
                </li>
                <li>
                  • <strong>Lip-Sync:</strong> Vowel shapes (A, E, I, O, U)
                </li>
                <li>
                  • <strong>Eye Blinks:</strong> Natural blinking during speech
                </li>
                <li>
                  • <strong>18 Assets:</strong> All images utilized
                </li>
              </ul>
            </div>
          </div>

          <div className="flex items-start">
            <ChatInterface
              onExpressionChange={setExpression}
              onSpeakingChange={setIsSpeaking}
              onEyeStateChange={setEyeState}
              onMouthShapeChange={setMouthShape}
            />
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-800 mb-3">🚀 Tech Stack:</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Framework:</span> Next.js
            </div>
            <div>
              <span className="font-medium">Animation:</span> Framer Motion
            </div>
            <div>
              <span className="font-medium">Assets:</span> 18 PNGs
            </div>
            <div>
              <span className="font-medium">AI:</span> Ollama (llama3.2:1b)
            </div>
            <div>
              <span className="font-medium">Lip-Sync:</span> Vowel Detection
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
