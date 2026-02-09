export type Expression = "happy" | "angry";
export type EyeState = "open" | "close";

export function detectExpression(text: string): Expression {
  const lowerText = text.toLowerCase();

  const angryWords = [
    "stupid",
    "annoying",
    "dumb",
    "idiot",
    "fuck",
    "shit",
    "damn",
    "hell",
    "ass",
    "bitch",
    "bastard",
    "angry",
    "mad",
    "pissed",
    "furious",
    "rage",
    "ばか",
    "あほ",
    "くそ",
    "しね",
    "うざい",
    "むかつく",
    "ふざけるな",
    "やろう",
    "てめえ",
    "きさま",
    "くず",
    "かす",
    "だまれ",
    "まぬけ",
    "へたくそ",
    "ちくしょう",
  ];

  for (const word of angryWords) {
    if (lowerText.includes(word)) return "angry";
  }

  return "happy";
}

export function detectEyeState(text: string): EyeState {
  return "open";
}

export function estimateSpeakingDuration(text: string): number {
  const words = text.trim().split(/\s+/).length;
  const duration = (words / 2.5) * 1000;
  return Math.max(1000, Math.min(duration, 10000));
}
