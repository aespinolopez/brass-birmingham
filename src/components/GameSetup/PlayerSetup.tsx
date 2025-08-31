import { PlayerColor } from '@/types'
import { Input } from '@/components/UI/Input'
import styles from './PlayerSetup.module.css'

interface PlayerSetupProps {
  playerNumber: number
  name: string
  color: PlayerColor | ''
  onNameChange: (name: string) => void
  onColorChange: (color: PlayerColor) => void
  availableColors: PlayerColor[]
  nameError?: string
}

const PLAYER_COLORS: { value: PlayerColor; label: string; hex: string }[] = [
  { value: 'red', label: 'Red', hex: '#dc2626' },
  { value: 'blue', label: 'Blue', hex: '#2563eb' },
  { value: 'green', label: 'Green', hex: '#16a34a' },
  { value: 'yellow', label: 'Yellow', hex: '#ca8a04' }
]

export function PlayerSetup({
  playerNumber,
  name,
  color,
  onNameChange,
  onColorChange,
  availableColors,
  nameError
}: PlayerSetupProps) {
  return (
    <div className={styles.playerSetup}>
      <div className={styles.playerHeader}>
        <span className={styles.playerNumber}>Player {playerNumber}</span>
      </div>
      
      <div className={styles.playerFields}>
        <div className={styles.nameField}>
          <Input
            label="Name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder={`Player ${playerNumber}`}
            maxLength={20}
            error={nameError}
          />
        </div>
        
        <div className={styles.colorField}>
          <label className={styles.colorLabel}>Color</label>
          <div className={styles.colorOptions}>
            {PLAYER_COLORS.map((colorOption) => {
              const isAvailable = availableColors.includes(colorOption.value)
              const isSelected = color === colorOption.value
              
              return (
                <button
                  key={colorOption.value}
                  type="button"
                  className={`${styles.colorSwatch} ${isSelected ? styles.selected : ''} ${!isAvailable ? styles.disabled : ''}`}
                  style={{ backgroundColor: colorOption.hex }}
                  onClick={() => isAvailable && onColorChange(colorOption.value)}
                  disabled={!isAvailable}
                  title={`${colorOption.label}${!isAvailable ? ' (taken)' : ''}`}
                >
                  {isSelected && (
                    <svg className={styles.checkmark} viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}