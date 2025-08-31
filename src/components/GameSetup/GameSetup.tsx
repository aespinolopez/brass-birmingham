import { useState } from 'react'
import { PlayerColor } from '@/types'
import { useGameActions } from '@/hooks'
import { Button } from '@/components/UI/Button'
import { PlayerSetup } from './PlayerSetup'
import styles from './GameSetup.module.css'

interface GameSetupProps {
  onGameStart: () => void
}

interface PlayerSetupData {
  name: string
  color: PlayerColor | ''
}

const PLAYER_COUNT_OPTIONS = [2, 3, 4]

export function GameSetup({ onGameStart }: GameSetupProps) {
  const [playerCount, setPlayerCount] = useState<number>(2)
  const [players, setPlayers] = useState<PlayerSetupData[]>([
    { name: '', color: '' },
    { name: '', color: '' }
  ])
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const { initializeGame } = useGameActions()

  const updatePlayerCount = (count: number) => {
    setPlayerCount(count)
    const newPlayers = Array.from({ length: count }, (_, index) => 
      players[index] || { name: '', color: '' }
    )
    setPlayers(newPlayers)
    setErrors({})
  }

  const updatePlayer = (index: number, field: keyof PlayerSetupData, value: string) => {
    const newPlayers = [...players]
    newPlayers[index] = { ...newPlayers[index], [field]: value }
    setPlayers(newPlayers)
    
    if (errors[`player${index}_${field}`]) {
      const newErrors = { ...errors }
      delete newErrors[`player${index}_${field}`]
      setErrors(newErrors)
    }
  }

  const getAvailableColors = (currentPlayerIndex: number): PlayerColor[] => {
    const usedColors = players
      .map((player, index) => index !== currentPlayerIndex ? player.color : '')
      .filter((color): color is PlayerColor => color !== '')
    
    const allColors: PlayerColor[] = ['red', 'blue', 'green', 'yellow']
    return allColors.filter(color => !usedColors.includes(color))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    players.forEach((player, index) => {
      if (!player.name.trim()) {
        newErrors[`player${index}_name`] = 'Player name is required'
        isValid = false
      } else if (player.name.trim().length > 20) {
        newErrors[`player${index}_name`] = 'Name must be 20 characters or less'
        isValid = false
      }

      if (!player.color) {
        newErrors[`player${index}_color`] = 'Please select a color'
        isValid = false
      }
    })

    const colors = players.map(p => p.color).filter(c => c !== '')
    const uniqueColors = new Set(colors)
    if (colors.length !== uniqueColors.size) {
      players.forEach((player, index) => {
        if (player.color && colors.filter(c => c === player.color).length > 1) {
          newErrors[`player${index}_color`] = 'Color must be unique'
          isValid = false
        }
      })
    }

    setErrors(newErrors)
    return isValid
  }

  const handleStartGame = () => {
    if (!validateForm()) {
      return
    }

    const playerNames = players.map(p => p.name.trim())
    const playerColors = players.map(p => p.color) as PlayerColor[]

    initializeGame(playerCount, playerNames, playerColors)
    onGameStart()
  }

  return (
    <div className={styles.gameSetup}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Brass Birmingham</h1>
          <p className={styles.subtitle}>Configure your game to get started</p>
        </header>

        <div className={styles.setupForm}>
          <div className={styles.playerCountSection}>
            <h2 className={styles.sectionTitle}>Number of Players</h2>
            <div className={styles.playerCountOptions}>
              {PLAYER_COUNT_OPTIONS.map((count) => (
                <button
                  key={count}
                  type="button"
                  className={`${styles.playerCountButton} ${count === playerCount ? styles.active : ''}`}
                  onClick={() => updatePlayerCount(count)}
                >
                  {count} Players
                </button>
              ))}
            </div>
          </div>

          <div className={styles.playersSection}>
            <h2 className={styles.sectionTitle}>Player Configuration</h2>
            <div className={styles.playersGrid}>
              {players.map((player, index) => (
                <PlayerSetup
                  key={index}
                  playerNumber={index + 1}
                  name={player.name}
                  color={player.color}
                  onNameChange={(name) => updatePlayer(index, 'name', name)}
                  onColorChange={(color) => updatePlayer(index, 'color', color)}
                  availableColors={getAvailableColors(index)}
                  nameError={errors[`player${index}_name`]}
                />
              ))}
            </div>
          </div>

          <div className={styles.actions}>
            <Button 
              onClick={handleStartGame}
              size="large"
              className={styles.startButton}
            >
              Start Game
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}