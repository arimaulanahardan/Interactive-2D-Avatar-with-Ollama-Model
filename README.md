# Interactive 2D Avatar with Ollama AI

A Next.js application featuring a fully interactive 2D avatar with advanced lip-sync, real-time AI responses powered by Ollama, and natural facial expressions.

![Avatar Demo](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Ollama](https://img.shields.io/badge/Ollama-llama3.2-green?style=for-the-badge)

---

## ✨ Features

### 🎭 Advanced Lip-Sync System

- **5 Vowel Mouth Shapes**: A, E, I, O, U phoneme detection
- **Real-Time Synchronization**: Mouth movements sync perfectly with streaming text
- **Natural Speech Flow**: Smooth transitions between phonemes
- **18 Unique Assets**: All image combinations actively utilized

### 🤖 Ollama AI Integration

- **Real Chatbot Responses**: Powered by llama3.2:1b model
- **Streaming Text**: Word-by-word display for natural conversation flow
- **Low Latency**: Fast response times with local AI processing

### 😊 Dynamic Expressions

- **Happy Expression** (Default): Friendly and welcoming
- **Angry Expression**: Triggered by offensive language detection
- **Context-Aware**: Expression based on user input sentiment
- **Multi-Language Support**: Detects offensive words in English and Japanese

### 👁️ Natural Eye Animations

- **Quick Blinking**: 80ms blink duration during speech
- **Random Timing**: Natural blink patterns (15% chance every 50ms)
- **No Idle Blinking**: Eyes only blink during conversation
- **Instant Rendering**: Preloaded assets for zero delays

---

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v18 or higher)
2. **Ollama** installed and running locally

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Interactive-2D-Avatar-with-Ollama-Model

# Install dependencies
npm install

# Start Ollama (if not already running)
ollama serve

# Verify Ollama model is available
ollama list
# Should show: llama3.2:1b

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
avatar-prototype/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # Ollama API endpoint
│   ├── page.tsx                  # Main page component
│   └── layout.tsx                # Root layout
├── components/
│   ├── Avatar.tsx                # Avatar rendering component
│   └── ChatInterface.tsx         # Chat UI and logic
├── lib/
│   ├── lipSyncEngine.ts          # Lip-sync algorithm
│   ├── expressionDetector.ts     # Expression & sentiment detection
│   └── assetConfig.ts            # Asset path management
└── public/
    └── assets/                   # 18 PNG avatar images
        ├── happy_open_eyes_*.png
        ├── angry_open_eyes_*.png
        └── close_eyes_*.png
```

---

## 🎨 Asset Naming Convention

All 18 assets follow this pattern:

```
{expression}_{eyeState}_{mouthShape}.png
```

### Examples:

- `happy_open_eyes_A.png` - Happy expression, eyes open, mouth shape A
- `angry_open_eyes_close_mouth.png` - Angry expression, eyes open, mouth closed
- `close_eyes_E.png` - Neutral (blinking), eyes closed, mouth shape E

### Available Combinations:

| Expression | Eye State | Mouth Shapes         | Count  |
| ---------- | --------- | -------------------- | ------ |
| Happy      | Open      | close, A, E, I, O, U | 6      |
| Angry      | Open      | close, A, E, I, O, U | 6      |
| Blink      | Close     | close, A, E, I, O, U | 6      |
| **Total**  |           |                      | **18** |

---

## 🔧 How It Works

### 1. User Input Processing

```typescript
// User sends message
const userInput = "Tell me a joke";

// Detect expression from user input (not bot response)
const expression = detectExpression(userInput);
// Returns: 'happy' (default) or 'angry' (if offensive words detected)
```

### 2. Ollama Streaming Response

```typescript
// API calls Ollama with streaming enabled
const response = await fetch("/api/chat", {
  method: "POST",
  body: JSON.stringify({ message: userInput }),
});

// Text streams word-by-word
let fullText = "";
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  fullText += decoder.decode(value);
  setStreamingText(fullText); // Update UI in real-time
}
```

### 3. Real-Time Lip-Sync

```typescript
// Generate phoneme sequence from text
const lipSyncSequence = generateLipSyncSequence(text, duration);

// Update mouth shape every 50ms
setInterval(() => {
  const mouthShape = getMouthShapeAtTime(sequence, currentTime);
  onMouthShapeChange(mouthShape); // A, E, I, O, U, or close
}, 50);
```

### 4. Natural Blinking

```typescript
// Random blinks during speech only
if (Math.random() > 0.85) {
  onEyeStateChange("close");
  setTimeout(() => onEyeStateChange("open"), 80); // Quick 80ms blink
}
```

---

## 🎯 Expression Detection

### Default: Happy 😊

Avatar uses happy expression unless offensive language is detected.

### Trigger: Angry 😠

Offensive words in **English** or **Japanese** trigger angry expression:

**English**: stupid, annoying, dumb, idiot, fuck, shit, damn, hell, ass, bitch, bastard, angry, mad, pissed, furious, rage

**Japanese**: ばか, あほ, くそ, しね, うざい, むかつく, ふざけるな, やろう, てめえ, きさま, くず, かす, だまれ, まぬけ, へたくそ, ちくしょう

---

## 🧪 Testing

### Test Buttons

1. **Test Happy** - Sends: "Tell me a short joke"
   - Triggers happy expression
   - Demonstrates vowel-rich lip-sync

2. **Test Angry** - Sends: "You are stupid and annoying"
   - Triggers angry expression
   - Shows offensive word detection

3. **Test Lip-Sync** - Sends: "Say something with lots of vowels..."
   - Tests advanced phoneme detection
   - Demonstrates A, E, I, O, U mouth shapes

### Manual Testing

```bash
# Test Ollama directly
ollama run llama3.2:1b "Hello, how are you?"

# Check API endpoint
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'
```

---

## ⚙️ Configuration

### Ollama Model

Default model: `llama3.2:1b` (1.3 GB)

To use a different model, edit `app/api/chat/route.ts`:

```typescript
body: JSON.stringify({
  model: 'llama3.2:1b', // Change this
  prompt: message,
  stream: true,
}),
```

### Lip-Sync Timing

Adjust speaking speed in `lib/expressionDetector.ts`:

```typescript
export function estimateSpeakingDuration(text: string): number {
  const words = text.trim().split(/\s+/).length;
  const duration = (words / 2.5) * 1000; // 2.5 words per second
  return Math.max(1000, Math.min(duration, 10000));
}
```

### Blink Frequency

Modify blink rate in `components/ChatInterface.tsx`:

```typescript
if (Math.random() > 0.85) {
  // 15% chance = ~3 blinks/sec
  onEyeStateChange("close");
  setTimeout(() => onEyeStateChange("open"), 80); // Blink duration
}
```

---

## 🐛 Troubleshooting

### Ollama Connection Error

**Problem**: `Failed to get response from Ollama`

**Solution**:

```bash
# Check if Ollama is running
ollama list

# Start Ollama service
ollama serve

# Verify model is downloaded
ollama pull llama3.2:1b
```

### Eyes Closed on Initial Load

**Problem**: Avatar shows closed eyes when page first loads

**Solution**: Check initial state in `app/page.tsx`:

```typescript
const [expression, setExpression] = useState<Expression>("happy"); // Not 'neutral'
const [eyeState, setEyeState] = useState<EyeState>("open");
```

### Mouth Continues After Response

**Problem**: Mouth animation doesn't stop when text finishes

**Solution**: Ensure `isStreamingRef` is properly set to `false` in `ChatInterface.tsx`

### Missing Assets

**Problem**: 404 errors for image files

**Solution**: Verify all 18 PNG files exist in `public/assets/` directory

---

## 🚀 Performance Optimizations

### Image Preloading

All 18 assets are preloaded on component mount:

```typescript
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
    await Promise.all(imagePromises);
    setImagesLoaded(true);
  };
  preloadImages();
}, []);
```

### Instant Rendering

No fade transitions for mouth changes:

```typescript
style={{
  opacity: imagesLoaded ? 1 : 0,
  transition: 'none', // Instant switching
}}
```

### Efficient Lip-Sync

Updates every 50ms (20 FPS) for smooth animation without excessive CPU usage.

---

## 📊 Technical Specifications

| Feature          | Implementation            |
| ---------------- | ------------------------- |
| Framework        | Next.js 15 (App Router)   |
| Language         | TypeScript 5              |
| Animation        | Framer Motion             |
| AI Model         | Ollama llama3.2:1b        |
| Assets           | 18 PNG images (preloaded) |
| Lip-Sync Rate    | 50ms intervals (20 FPS)   |
| Blink Duration   | 80ms                      |
| Speaking Speed   | 2.5 words/second          |
| Expression Types | 2 (Happy, Angry)          |
| Mouth Shapes     | 6 (A, E, I, O, U, close)  |

---

## 🎓 Key Concepts

### Phoneme-Based Lip-Sync

Instead of random mouth movements, the system:

1. Extracts vowels from text (A, E, I, O, U)
2. Calculates timing for each phoneme
3. Displays corresponding mouth shape at precise moments

### Expression from User Input

Expression is determined by **what the user says**, not the bot's response:

- User: "You're stupid" → Angry expression
- Bot: "I'm sorry you feel that way" → Still angry (based on user input)

### Streaming Synchronization

Lip-sync updates in real-time as text streams:

- Text arrives: "Hello..."
- Mouth animates: H(close) → e(E) → l(close) → l(close) → o(O)
- More text arrives: "...world"
- Mouth continues: w(U) → o(O) → r(close) → l(close) → d(close)

---

## 📝 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- **Ollama** - Local AI inference
- **Next.js** - React framework
- **Framer Motion** - Animation library
- **TypeScript** - Type safety

---

## 📧 Support

For issues or questions, please open an issue on the repository.

---

**Built with ❤️ using Next.js and Ollama**
