# Cohere AI Chatbot Setup Instructions

## 1. Install Cohere AI Package

Run this command in the backend directory:

```bash
cd backend
npm install cohere-ai
```

## 2. Get Your Cohere API Key

1. Go to https://cohere.ai/
2. Sign up for a trial account
3. Navigate to your dashboard
4. Copy your API key

## 3. Update Environment Variables

In your `backend/.env` file, replace the placeholder with your actual Cohere API key:

```env
# Cohere AI API Configuration
COHERE_API_KEY=your_actual_cohere_api_key_here
```

## 4. Start the Servers

Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend
npm run dev
```

## Features

- ✅ AI-powered responses using Cohere's command-r-plus model
- ✅ Fallback responses when API is unavailable
- ✅ Visual indicators for AI vs offline responses
- ✅ Pet care specialized knowledge
- ✅ Professional veterinary advice reminders
- ✅ Clean, modern chat interface

## Usage

The chatbot will automatically use Cohere AI for responses when available. If the API is down or there's an error, it will fall back to predefined responses and show an "Offline" indicator.

The AI is specifically trained to provide helpful pet care advice while always reminding users to consult veterinarians for serious health concerns.