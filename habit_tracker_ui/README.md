# Habit Tracker Frontend

A modern, intuitive habit tracking application built with React Native and Expo.

## Features

- 🎨 Beautiful, modern UI with smooth animations
- 🌙 Dark/Light theme support with customizable themes
- 📱 Cross-platform (iOS & Android) support
- 🔐 Secure authentication system
- 📊 Progress tracking and analytics
- 🔄 Habit streak monitoring
- 🎯 Daily goal setting and tracking

## Tech Stack

- React Native with Expo
- Expo Router for file-based routing
- React Native Reanimated for smooth animations
- AsyncStorage for local data persistence
- React Context for state management
- Custom theming system

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd habit_tracker_frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

4. Run on your preferred platform:
   - Press 'i' for iOS simulator
   - Press 'a' for Android emulator
   - Scan QR code with Expo Go app for physical device

### Environment Setup

Create a `.env` file in the root directory:

```env
API_URL=your_backend_api_url
```

## Project Structure

```
habit_tracker_frontend/
├── app/                   # Main application screens
│   ├── (tabs)/           # Tab-based navigation screens
│   ├── index.tsx         # Landing page
│   ├── login.tsx         # Login screen
│   └── signup.tsx        # Signup screen
├── components/           # Reusable components
├── constants/           # Constants and configuration
├── contexts/           # React Context providers
├── hooks/             # Custom React hooks
└── types/            # TypeScript type definitions
```

## Development

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Start Android development build
- `npm run ios` - Start iOS development build
- `npm run web` - Start web development build
- `npm run lint` - Run ESLint

### Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Create a pull request

## Testing

Run the test suite:

```bash
npm run test
```

## Building for Production

1. Configure app.json with your app details
2. Build for your target platform:
   ```bash
   eas build --platform ios
   # or
   eas build --platform android
   ```

## Troubleshooting

Common issues and their solutions:

1. Metro bundler issues:
   ```bash
   npm start -- --reset-cache
   ```

2. Dependencies issues:
   ```bash
   rm -rf node_modules
   npm install
   ```

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Documentation](https://expo.github.io/router/docs/)
