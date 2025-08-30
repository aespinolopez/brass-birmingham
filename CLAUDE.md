# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production (runs TypeScript check + Vite build)
- `npm run lint` - Run ESLint with TypeScript extensions
- `npm run test` - Run tests with Vitest
- `npm run preview` - Preview production build locally

## Project Architecture

This is a React 18 + TypeScript implementation of the Brass Birmingham board game using Vite as the build tool.

### State Management Strategy
- **useReducer + Context API** for game state management
- **Immer** for immutable state updates
- **Custom hooks** to encapsulate game logic and provide clean API to components

### Key Technologies
- **Vite** with path alias `@/*` pointing to `src/*`
- **Framer Motion** for animations and interactions
- **CSS Modules** for component styling
- **SVG graphics** for scalable game board elements
- **Vitest** for testing

### Project Structure
```
src/
├── components/     # React components (Board/, Cards/, Markets/, UI/)
├── hooks/         # Custom React hooks for game logic
├── types/         # TypeScript definitions for game entities
├── data/          # Static game data and constants
├── utils/         # Helper functions
├── assets/        # SVG graphics and images
└── styles/        # Global styles and themes
```

### Component Architecture
- Root **App** component provides context providers
- **GameProvider** manages all game state through reducer
- Components organized by game domain (Board, Cards, Markets, UI)
- Strict TypeScript with `noUnusedLocals` and `noUnusedParameters` enabled

### Game State Structure
The game state follows the board game's structure with players, board state, markets, current player/phase/era tracking, and turn management.

### Development Workflow
1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Make changes and test thoroughly
3. Run linting: `npm run lint`
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push branch: `git push origin feature/amazing-feature`
6. Open Pull Request