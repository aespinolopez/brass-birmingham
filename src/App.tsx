import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="app">
        <header>
          <h1>Brass Birmingham</h1>
          <p>Digital board game implementation coming soon...</p>
        </header>
        <main>
          <div className="card">
            <button onClick={() => setCount((count) => count + 1)}>
              Development counter: {count}
            </button>
            <p>
              Project setup complete. Ready for development!
            </p>
          </div>
        </main>
      </div>
    </>
  )
}

export default App