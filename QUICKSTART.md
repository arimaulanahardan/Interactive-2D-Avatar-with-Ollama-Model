# Quick Start Guide

## 30-Second Setup

1. **Install dependencies**:
   ```bash
   cd avatar-prototype
   npm install
   ```

2. **Start server**:
   ```bash
   npm run dev
   ```

3. **Open browser**:
   ```
   http://localhost:3000
   ```

## Test the Avatar

### Option 1: Quick Test Buttons
Click the colored buttons below the chat:
- **Green** = Happy response
- **Red** = Angry response  
- **Gray** = Neutral response

### Option 2: Type Custom Messages
Try these:
- "Hello!" → Happy
- "I found an error" → Angry
- "Can you help?" → Neutral

## What to Watch

1. **Mouth** opens/closes while speaking
2. **Expression** changes (eyes/eyebrows/mouth shape)
3. **Speaking indicator** (blue dots below avatar)
4. **Status display** shows current expression and state

## Recording Demo Video

**What to capture**:
1. Avatar at rest (neutral)
2. Type "Hello!" and watch happy expression + mouth animation
3. Type "I found an error" and watch angry expression + mouth animation
4. Show expression persists after speaking ends

**Duration**: 30-60 seconds is sufficient

## Troubleshooting

**Nothing happens when I click Send?**
- Check browser console (F12) for errors
- Make sure input field has text

**Avatar looks wrong?**
- Refresh the page
- Check that assets loaded (Network tab in DevTools)

**Want to modify expressions?**
Edit keywords in `lib/expressionDetector.ts`
