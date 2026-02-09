"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Expression } from "@/lib/expressionDetector";
import { MouthShape } from "@/lib/lipSyncEngine";
import { EyeState, getAssetPath, AVAILABLE_ASSETS } from "@/lib/assetConfig";

interface AvatarProps {
  expression: Expression;
  eyeState: EyeState;
  mouthShape: MouthShape;
  isSpeaking: boolean;
}

export default function Avatar({
  expression,
  eyeState,
  mouthShape,
  isSpeaking,
}: AvatarProps) {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = AVAILABLE_ASSETS.map((asset) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = `/assets/${asset}`;
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error("Error preloading images:", error);
        setImagesLoaded(true);
      }
    };

    preloadImages();
  }, []);

  const currentAssetPath = getAssetPath(expression, eyeState, mouthShape);

  return (
    <div className="relative w-80 h-80 flex items-center justify-center">
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={currentAssetPath}
          alt={`Avatar - ${expression} ${eyeState} ${mouthShape}`}
          className="w-full h-full object-contain"
          style={{
            opacity: imagesLoaded ? 1 : 0,
            transition: "none",
          }}
          onError={(e) => {
            console.error(`Failed to load: ${currentAssetPath}`);
            if (currentAssetPath !== "/assets/close_eyes_close_mouth.png") {
              e.currentTarget.src = "/assets/close_eyes_close_mouth.png";
            }
          }}
        />
      </div>

      {isSpeaking && (
        <motion.div
          className="absolute -bottom-4 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-blue-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {isSpeaking && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: [
              "0 0 20px rgba(59, 130, 246, 0.3)",
              "0 0 40px rgba(59, 130, 246, 0.5)",
              "0 0 20px rgba(59, 130, 246, 0.3)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      )}
    </div>
  );
}
