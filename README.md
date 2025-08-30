# Brass Birmingham - Digital Implementation

A modern digital implementation of the acclaimed board game **Brass Birmingham** built with React, TypeScript, and SVG graphics.

## 🎯 About

Brass Birmingham is a strategic board game set in Birmingham, England during the Industrial Revolution (1770-1870). Players compete as entrepreneurs to build and develop their industrial networks across two distinct eras: the Canal Era and the Railroad Era.

This digital version faithfully recreates the game mechanics while providing an intuitive, responsive interface that works on desktop, tablet, and mobile devices.

## ✨ Features

- **Complete Game Implementation** - All rules and mechanics from the physical game
- **Responsive Design** - Optimized for all screen sizes and devices  
- **Local Multiplayer** - 2-4 players on the same device
- **Interactive Board** - Drag-and-drop tile placement with visual feedback
- **Game State Management** - Save and resume games with localStorage
- **Smooth Animations** - Polished interactions using Framer Motion
- **Accessibility** - WCAG compliant with screen reader support

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/aespinolopez/brass-birmingham.git
cd brass-birmingham

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:3000
```

## 🛠 Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **State Management**: useReducer + Context API
- **Animations**: Framer Motion
- **Styling**: CSS Modules + CSS Custom Properties
- **Graphics**: Custom SVG assets
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint + Prettier

## 📁 Project Structure

```
brass-birmingham/
├── src/
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript definitions
│   ├── data/              # Game data and constants
│   ├── utils/             # Helper functions
│   ├── assets/            # SVG graphics and images
│   └── styles/            # Global styles and themes
├── docs/                  # Documentation
├── tests/                 # Test files
└── .github/               # GitHub templates and workflows
```

## 🎮 How to Play

1. **Setup**: Choose number of players (2-4) and start new game
2. **Canal Era**: Build industries, develop locations, sell goods
3. **Railroad Era**: Transition to rail network and advanced industries
4. **Scoring**: Earn victory points through connected networks

For complete rules, see [Game Rules Documentation](docs/game-rules.md).

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checking
```

### Development Workflow

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Make changes and test thoroughly
3. Run linting: `npm run lint`
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push branch: `git push origin feature/amazing-feature`
6. Open Pull Request

## 📋 Roadmap

### Milestone 1: Foundation (Week 1)
- [x] Project setup and configuration
- [ ] Core type definitions
- [ ] Static game data

### Milestone 2: Game Logic (Week 2)
- [ ] Game state reducer
- [ ] React Context and hooks
- [ ] Action validation

### Milestone 3: Board Components (Week 3)  
- [ ] SVG asset generation
- [ ] Interactive board component
- [ ] Industry tile placement system

### Milestone 4: UI Components (Week 4)
- [ ] Player hand and cards
- [ ] Market boards  
- [ ] Player dashboard

### Milestone 5: Game Flow (Week 5)
- [ ] Turn management system
- [ ] Scoring and victory conditions
- [ ] Game flow integration

### Milestone 6: Polish (Week 6)
- [ ] Mobile responsive design
- [ ] Animations and polish
- [ ] Game persistence and multiplayer

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting PRs.

### Issue Types
- 🐛 **Bug Report** - Found a problem?
- ✨ **Feature Request** - Have an idea?
- 📚 **Documentation** - Improve our docs
- 🎨 **Design** - UI/UX improvements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Martin Wallace** - Creator of Brass Birmingham
- **Roxley Games** - Publisher of Brass Birmingham  
- **Board Game Community** - For playtesting and feedback

## 📞 Support

- 📖 [Documentation](docs/)
- 🐛 [Report Issues](https://github.com/aespinolopez/brass-birmingham/issues)
- 💬 [Discussions](https://github.com/aespinolopez/brass-birmingham/discussions)

---

**Note**: This is a fan-made digital implementation created for educational purposes. We respect the intellectual property of the original game creators.