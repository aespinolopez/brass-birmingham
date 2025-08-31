import { useState } from 'react'
import { GameProvider } from '@/hooks'
import { GameSetup } from '@/components/GameSetup/GameSetup'
import './App.css'

type AppState = 'setup' | 'game'

function App() {
  const [appState, setAppState] = useState<AppState>('setup')

  const handleGameStart = () => {
    setAppState('game')
  }

  const handleBackToSetup = () => {
    setAppState('setup')
  }

  return (
    <GameProvider>
      <div className="app">
        {appState === 'setup' && (
          <GameSetup onGameStart={handleGameStart} />
        )}
        {appState === 'game' && (
          <div className="gameView">
            <header className="gameHeader">
              <h1>Brass Birmingham</h1>
              <button 
                className="backButton" 
                onClick={handleBackToSetup}
              >
                Back to Setup
              </button>
            </header>
            <main className="gameMain">
              <div className="gamePlaceholder">
                <h2>Game Board Coming Soon</h2>
                <p>
                  The game has been initialized successfully! 
                  The game board and player interface will be implemented in future updates.
                </p>
              </div>
            </main>
          </div>
        )}
      </div>
    </GameProvider>
  )
}

export default App