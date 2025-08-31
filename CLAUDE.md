# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based typing tutor application called "Typing Tutor Theory" that helps users practice typing skills with different character generation modes and audio feedback.

## Common Development Commands

### Development
- `npm start` - Start the development server (opens on localhost:3000)
- `npm run build` - Build the app for production
- `npm test` - Run tests with coverage reports
- `npm run jest` - Run Jest in watch mode with coverage

### Testing
- `npm test` - Runs React Scripts test runner with coverage
- `npm run jest` - Alternative Jest command with watch mode
- Tests are located in `src/tests/` directory

### Deployment
- `npm run deploy` - Deploy to GitHub Pages
- `npm run predeploy` - Automatically runs before deploy to build the app

## Architecture and Key Components

### Core Files Structure
- `src/App.js` - Main React component containing the typing interface
- `src/lib/ttt.js` - TTT (Typing Tutor Theory) class with core typing logic
- `src/typingIndicator.jsx` - Visual feedback component for typed characters
- `src/tests/ttt.test.js` - Test suite for the TTT class

### Main Application Logic (TTT Class)

The `TTT` class in `src/lib/ttt.js` is the core engine that:

1. **Character Set Generation**: Supports two modes:
   - `KEY_SEQUENCE` (0): Generates character combinations using L-picking algorithm
   - `RANDOM_WORDS` (1): Uses filtered random words matching training characters

2. **Training Character Management**:
   - Scrambles input characters to avoid predictable patterns
   - Validates input using Joi schema validation
   - Supports custom character sets (a-z by default)

3. **Error Handling**:
   - Tracks error positions for visual highlighting
   - Returns characters to practice when errors occur (configurable amount)
   - Prevents duplicate character sequences

4. **Progress Tracking**:
   - Calculates elimination percentage
   - Maintains original vs current character set state

### React Components

1. **App Component**:
   - Manages typing interface state
   - Integrates with TTT class for character generation
   - Provides audio feedback using Web Audio API (piano notes)
   - Handles visual feedback (shaking on errors, progress bar)

2. **TypingIndicator Component**:
   - Shows typed characters with fade/grow animation
   - Provides visual confirmation of user input

### Dependencies

**Main Dependencies**:
- React 17.0.2 with Bootstrap 5.1.3 for UI
- `joi` for input validation
- `random-words` for word generation mode

**Testing**:
- Jest and React Testing Library for unit tests
- Tests focus on TTT class functionality

### Audio Features

The app plays random piano notes (C4-B4 range) when correct characters are typed using the Web Audio API.

### Development Notes

- Uses Create React App as the base setup
- ESLint configuration extends react-app defaults
- No TypeScript - uses vanilla JavaScript/JSX
- Bootstrap CSS framework for styling
- Deployed to GitHub Pages

### Testing Strategy

Focus testing efforts on the `TTT` class as it contains the core business logic. The existing test suite covers:
- Character set generation algorithms
- Error handling and validation
- Progress tracking
- Character elimination logic