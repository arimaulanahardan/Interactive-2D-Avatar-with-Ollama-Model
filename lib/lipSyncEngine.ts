export type MouthShape = "A" | "E" | "I" | "O" | "U" | "close";

export interface Phoneme {
  char: string;
  mouthShape: MouthShape;
}

export interface TimedPhoneme extends Phoneme {
  startTime: number;
  duration: number;
}

export function getMouthShape(char: string): MouthShape {
  const upperChar = char.toUpperCase();

  switch (upperChar) {
    case "A":
      return "A";
    case "E":
      return "E";
    case "I":
    case "Y":
      return "I";
    case "O":
      return "O";
    case "U":
    case "W":
      return "U";
    default:
      return "close";
  }
}

export function extractPhonemeSequence(text: string): Phoneme[] {
  const phonemes: Phoneme[] = [];
  const cleanText = text.replace(/[^\w\s]/g, "");

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];

    if (char === " ") {
      phonemes.push({ char: " ", mouthShape: "close" });
      continue;
    }

    const mouthShape = getMouthShape(char);

    if (mouthShape !== "close" || char === " ") {
      phonemes.push({ char, mouthShape });
    }
  }

  if (phonemes.length === 0) {
    phonemes.push({ char: "", mouthShape: "close" });
  }

  return phonemes;
}

export function calculatePhonemeTimings(
  phonemes: Phoneme[],
  totalDuration: number,
): TimedPhoneme[] {
  if (phonemes.length === 0) return [];

  const durationPerPhoneme = totalDuration / phonemes.length;

  return phonemes.map((phoneme, index) => ({
    ...phoneme,
    startTime: index * durationPerPhoneme,
    duration: durationPerPhoneme,
  }));
}

export function generateLipSyncSequence(
  text: string,
  totalDuration: number,
): TimedPhoneme[] {
  const phonemes = extractPhonemeSequence(text);
  return calculatePhonemeTimings(phonemes, totalDuration);
}

export function getMouthShapeAtTime(
  sequence: TimedPhoneme[],
  currentTime: number,
): MouthShape {
  for (const phoneme of sequence) {
    if (
      currentTime >= phoneme.startTime &&
      currentTime < phoneme.startTime + phoneme.duration
    ) {
      return phoneme.mouthShape;
    }
  }

  return "close";
}
