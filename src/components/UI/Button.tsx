import { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './Button.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  size?: 'small' | 'medium' | 'large'
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  className,
  ...props 
}: ButtonProps) {
  const buttonClass = [
    styles.button,
    styles[variant],
    styles[size],
    className
  ].filter(Boolean).join(' ')

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  )
}