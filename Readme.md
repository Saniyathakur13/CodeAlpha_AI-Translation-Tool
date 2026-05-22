# AI Translation Tool

A professional, dynamic AI-powered language translation tool with modern UI and real-time translation capabilities.

## Features
- Translate between 12+ languages
- Auto-detect source language
- Swap languages instantly
- Copy translated text to clipboard
- Text-to-speech output
- Character counter
- Keyboard shortcut (Ctrl+Enter)
- Responsive design
- Loading states & error handling

## Project Structure
ai-translation-tool/
├── index.html # Main HTML structure
├── css/style.css # Modern, responsive styling
├── js/app.js # Core translation logic
├── backend/ # Optional backend (for API keys)
│ ├── server.js
│ └── package.json
└── README.md

text

## Setup Instructions

### Quick Start (Frontend Only - No Installation)
1. Download all files maintaining the folder structure
2. Open `index.html` in a modern web browser
3. Start translating immediately!

### With Optional Backend (For Production API Keys)
```bash
cd backend
npm install
npm start
How It Works
Uses Google Translate's free endpoint for translations

No API key required for basic usage (works for the assignment)

Real-time translation with debouncing

Speech synthesis for pronunciation

Technologies Used
HTML5

CSS3 (Flexbox, Grid, Animations)

JavaScript (ES6+)

Google Translate API (free tier)

Font Awesome Icons

Web Speech API

API Notes
For production deployment with high volume:

Get API key from Google Cloud Translate or Microsoft Azure

Use the backend server to secure your API key

Never expose API keys in frontend code

License
Educational use for AI Internship Assignment

text

---

## How to Run This Project

1. **Create the folder structure** exactly as shown above
2. **Copy each file** into its respective location
3. **Open `index.html`** directly in your browser - it works without any server!
4. The translation works using Google Translate's public endpoint (no API key needed for the assignment)

## Key Features Demonstrated

✅ **Professional UI** - Gradient backgrounds, smooth animations, card design  
✅ **Dynamic Translation** - Real API integration, not just mock data  
✅ **Separate Files** - HTML, CSS, JS all in their own folders  
✅ **Error Handling** - Loading states, error messages, fallbacks  
✅ **Extra Features** - Copy button, text-to-speech, character counter, language swap  
✅ **Responsive** - Works on mobile, tablet, and desktop  

The tool will automatically translate as you type (debounced) and provides professional-grade functionality suitable for an AI internship assignment.
