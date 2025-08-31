import { InputHTMLAttributes, forwardRef } from 'react'
import styles from './Input.module.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ 
  label, 
  error, 
  helperText,
  className,
  ...props 
}, ref) {
  const inputClass = [
    styles.input,
    error ? styles.error : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <div className={styles.inputGroup}>
      {label && (
        <label className={styles.label} htmlFor={props.id}>
          {label}
        </label>
      )}
      <input 
        ref={ref}
        className={inputClass} 
        {...props} 
      />
      {error && (
        <span className={styles.errorMessage}>{error}</span>
      )}
      {helperText && !error && (
        <span className={styles.helperText}>{helperText}</span>
      )}
    </div>
  )
})