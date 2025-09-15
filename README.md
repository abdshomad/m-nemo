
# M Nemo - Master Your Memory

M Nemo is an interactive web application designed to help users learn and master popular mnemonic systems for remembering numbers. Through engaging, game-like tutorials and customizable practice drills, users can unlock the power of their memory.

## ✨ Features

- **Interactive Onboarding**: A gentle, step-by-step introduction to the concepts of mnemonic memory systems using the Number Shape system as an example.
- **Learning Hub**: A central place to discover and choose between different mnemonic techniques.
  - The Major System
  - The Dominic System
  - Number Rhyme System
  - Number Shape System
- **Visual Progress Tracking**: Completed systems are visually marked with a checkmark and a distinct style, giving users a clear sense of accomplishment.
- **Dual Practice Modes**:
  - **Conversion Drill**: A race against the clock to convert randomly generated numbers into memorable words or phrases based on the chosen system.
  - **Timed Challenge**: A two-phase memory test where users first memorize a long sequence of digits and then recall it from memory.
- **Customizable Sessions**: Users can tailor their practice by adjusting the **time limit** and the **number of digits** to match their skill level.
- **AI-Powered Hints**: Powered by the Google Gemini API, users can request context-aware hints during practice drills to help them when they're stuck.
- **Comprehensive Stats Dashboard**:
  - View key metrics like Daily Streak, overall Accuracy, and Speed (Digits Per Minute).
  - Track performance over time with an interactive chart.
- **Achievement System**: Unlock badges for reaching milestones related to accuracy, streaks, speed, and lesson completion.
- **Sleek, Responsive UI**: A modern, mobile-first design built with Tailwind CSS, ensuring a great user experience on any device.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: Google Gemini API (`@google/genai`) for generating mnemonic hints.
- **Charting**: Recharts for visualizing user progress.

## 📁 Project Structure

```
/
├── public/
├── src/
│   ├── components/      # Reusable React components (BottomNav, Modals, Icons)
│   ├── screens/         # Top-level screen components (HomeScreen, LearnScreen, etc.)
│   ├── services/        # Logic for external API calls (geminiService.ts)
│   ├── App.tsx          # Main application component, handles state and routing
│   ├── types.ts         # TypeScript type definitions and enums
│   ├── constants.ts     # App-wide constants (initial stats, system definitions)
│   ├── achievements.ts  # Definitions for the achievement system
│   └── index.tsx        # Entry point for the React application
├── index.html           # The main HTML file
└── metadata.json      # Application metadata
```

## 🚀 Running the Application

To run M Nemo, simply open the `index.html` file in a modern web browser. The application is self-contained and uses an `importmap` to load dependencies from a CDN, requiring no local build step.
