# Architecture Documentation

## Project Architecture

This Brass Birmingham implementation follows a modern React architecture with TypeScript, focusing on maintainability, performance, and user experience.

## Technology Stack

### Core Technologies
- **React 18** - UI library with concurrent features
- **TypeScript** - Type safety and developer experience  
- **Vite** - Fast build tool and development server
- **Framer Motion** - Animation library for smooth interactions

### State Management
- **useReducer + Context** - Game state management
- **Immer** - Immutable state updates
- **Custom hooks** - Encapsulated game logic

### Styling
- **CSS Modules** - Scoped component styles
- **CSS Custom Properties** - Theming and consistency
- **SVG** - Scalable graphics for game board

### Development Tools
- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **Vitest** - Unit testing framework

## Folder Structure

```
src/
├── components/          # React components
│   ├── Board/          # Game board components
│   ├── Cards/          # Card-related components  
│   ├── Markets/        # Market display components
│   └── UI/             # Reusable UI components
├── hooks/              # Custom React hooks
├── types/              # TypeScript definitions
├── data/               # Static game data
├── utils/              # Helper functions
├── assets/             # Images and SVG files
└── styles/             # Global styles and themes
```

## State Management

### Game State Structure
```typescript
interface GameState {
  players: Player[]
  board: BoardState
  markets: MarketState
  currentPlayer: number
  phase: GamePhase
  era: Era
  turn: number
}
```

### State Flow
1. **Actions** - User interactions dispatch actions
2. **Reducer** - Pure functions update state immutably
3. **Context** - Provides state to components
4. **Hooks** - Abstract state access and mutations

## Component Architecture

### Component Hierarchy
- **App** - Root component, providers
  - **GameProvider** - State management
    - **Board** - Main game board
    - **PlayerDashboard** - Player information
    - **MarketBoards** - Market displays
    - **CardHand** - Player's cards

### Component Guidelines
- **Separation of Concerns** - UI vs Logic
- **Composition** - Reusable, composable components
- **Props Interface** - Well-defined TypeScript interfaces
- **Performance** - Memo where appropriate

## Data Flow

### User Interaction Flow
1. User clicks/interacts with component
2. Component calls hook function
3. Hook validates and dispatches action
4. Reducer updates state immutably
5. Context provides new state
6. Components re-render with new data

### Game Logic Flow
1. **Validation** - Check if action is legal
2. **State Update** - Apply changes to game state
3. **Side Effects** - Update markets, scores, etc.
4. **Phase Management** - Progress to next phase/player

## Performance Considerations

### Optimization Strategies
- **React.memo** - Prevent unnecessary re-renders
- **useMemo/useCallback** - Expensive calculations
- **SVG Optimization** - Minimize DOM nodes
- **Code Splitting** - Lazy load components

### Memory Management
- **Immutable Updates** - Prevent memory leaks
- **Effect Cleanup** - Remove event listeners
- **Ref Management** - Avoid circular references

## Testing Strategy

### Unit Tests
- **Components** - Render and interaction tests
- **Hooks** - State management logic
- **Utils** - Pure function testing

### Integration Tests
- **Game Flow** - Complete action sequences
- **State Transitions** - Phase management
- **Validation** - Rule enforcement

## Development Workflow

### Code Standards
- **TypeScript Strict** - Maximum type safety
- **ESLint Rules** - Consistent code style
- **Component Patterns** - Established conventions

### Git Workflow
- **Feature Branches** - One feature per branch
- **Pull Requests** - Code review process
- **Issue Tracking** - GitHub Issues for tasks

---

This architecture provides a solid foundation for building a complex board game while maintaining code quality and developer experience.