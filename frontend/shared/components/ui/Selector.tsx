'use client'
import React from 'react'

type SelectorProps = {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

const Selector: React.FC<SelectorProps> = ({ children, onClick, className }) => {
  return (
    <div
      className={`selector ${className ?? ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  )
}

export default Selector
