import { Expression } from "./expressionDetector";
import { MouthShape } from "./lipSyncEngine";

export type EyeState = "open" | "close";

export interface AssetKey {
  expression: Expression;
  eyeState: EyeState;
  mouthShape: MouthShape;
}

function getMouthShapeSuffix(mouthShape: MouthShape): string {
  return mouthShape === "close" ? "close_mouth" : mouthShape;
}

export function getAssetPath(
  expression: Expression,
  eyeState: EyeState,
  mouthShape: MouthShape,
): string {
  const mouthShapeSuffix = getMouthShapeSuffix(mouthShape);

  if (eyeState === "close") {
    return `/assets/close_eyes_${mouthShapeSuffix}.png`;
  }

  return `/assets/${expression}_open_eyes_${mouthShapeSuffix}.png`;
}

export function isValidAssetCombination(
  expression: Expression,
  eyeState: EyeState,
  mouthShape: MouthShape,
): boolean {
  const validCombinations = [
    {
      expression: "angry",
      eyeState: "open",
      mouthShapes: ["close", "A", "E", "I", "O", "U"],
    },
    {
      expression: "happy",
      eyeState: "open",
      mouthShapes: ["close", "A", "E", "I", "O", "U"],
    },
    {
      expression: "angry",
      eyeState: "close",
      mouthShapes: ["close", "A", "E", "I", "O", "U"],
    },
    {
      expression: "happy",
      eyeState: "close",
      mouthShapes: ["close", "A", "E", "I", "O", "U"],
    },
  ];

  for (const combo of validCombinations) {
    if (
      combo.expression === expression &&
      combo.eyeState === eyeState &&
      combo.mouthShapes.includes(mouthShape)
    ) {
      return true;
    }
  }

  return false;
}

export function getFallbackAssetPath(
  expression: Expression,
  eyeState: EyeState,
  mouthShape: MouthShape,
): string {
  if (!isValidAssetCombination(expression, eyeState, mouthShape)) {
    if (eyeState === "close") {
      const openEyesPath = getAssetPath(expression, "open", mouthShape);
      if (isValidAssetCombination(expression, "open", mouthShape)) {
        return openEyesPath;
      }
    }

    return getAssetPath("happy", "open", "close");
  }

  return getAssetPath(expression, eyeState, mouthShape);
}

export const AVAILABLE_ASSETS = [
  "angry_open_eyes_close_mouth.png",
  "angry_open_eyes_A.png",
  "angry_open_eyes_E.png",
  "angry_open_eyes_I.png",
  "angry_open_eyes_O.png",
  "angry_open_eyes_U.png",
  "close_eyes_close_mouth.png",
  "close_eyes_A.png",
  "close_eyes_E.png",
  "close_eyes_I.png",
  "close_eyes_O.png",
  "close_eyes_U.png",
  "happy_open_eyes_close_mouth.png",
  "happy_open_eyes_A.png",
  "happy_open_eyes_E.png",
  "happy_open_eyes_I.png",
  "happy_open_eyes_O.png",
  "happy_open_eyes_U.png",
];
