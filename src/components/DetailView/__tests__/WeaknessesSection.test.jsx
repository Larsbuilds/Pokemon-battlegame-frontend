import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { WeaknessesSection } from '../WeaknessesSection'

const mockWeaknesses = [
  { type: 'fire', multiplier: 2 },
  { type: 'ice', multiplier: 2 },
  { type: 'flying', multiplier: 2 },
  { type: 'psychic', multiplier: 2 }
]

describe('WeaknessesSection', () => {
  it('renders weaknesses section correctly', () => {
    render(<WeaknessesSection weaknesses={mockWeaknesses} />)
    
    // Check for section title
    expect(screen.getByText('Weaknesses')).toBeInTheDocument()
    
    // Check for each weakness type
    mockWeaknesses.forEach(weakness => {
      expect(screen.getByText(weakness.type)).toBeInTheDocument()
    })
  })

  it('displays multipliers on hover', () => {
    render(<WeaknessesSection weaknesses={mockWeaknesses} />)
    
    mockWeaknesses.forEach(weakness => {
      const tooltip = screen.getByTestId(`multiplier-tooltip-${weakness.type}`)
      expect(tooltip).toHaveTextContent(`${weakness.multiplier}x`)
    })
  })

  it('applies correct styling to badges', () => {
    render(<WeaknessesSection weaknesses={mockWeaknesses} />)
    
    const badges = screen.getAllByTestId(/^weakness-badge-/)
    badges.forEach(badge => {
      expect(badge).toHaveClass('rounded-full')
      expect(badge).toHaveClass('text-white')
      expect(badge).toHaveClass('font-medium')
      expect(badge).toHaveClass('text-sm')
      expect(badge).toHaveClass('capitalize')
    })
  })

  it('handles keyboard navigation', () => {
    render(<WeaknessesSection weaknesses={mockWeaknesses} />)
    
    const badges = screen.getAllByTestId(/^weakness-badge-/)
    badges[0].focus()
    expect(badges[0]).toHaveFocus()
    
    // Press right arrow
    fireEvent.keyDown(badges[0], { key: 'ArrowRight' })
    expect(badges[1]).toHaveFocus()
    
    // Press left arrow
    fireEvent.keyDown(badges[1], { key: 'ArrowLeft' })
    expect(badges[0]).toHaveFocus()
  })

  it('maintains proper spacing between badges', () => {
    render(<WeaknessesSection weaknesses={mockWeaknesses} />)
    
    const container = screen.getByTestId('weaknesses-container')
    const badgesContainer = container.querySelector('.flex.flex-wrap.gap-2')
    expect(badgesContainer).toBeInTheDocument()
  })

  it('handles null or empty weaknesses prop', () => {
    render(<WeaknessesSection weaknesses={null} />)
    expect(screen.getByText('Weaknesses')).toBeInTheDocument()
    expect(screen.getByText('No weaknesses found')).toBeInTheDocument()
  })

  it('applies correct focus styles', () => {
    render(<WeaknessesSection weaknesses={mockWeaknesses} />)
    
    const badges = screen.getAllByTestId(/^weakness-badge-/)
    badges[0].focus()
    expect(badges[0]).toHaveFocus()
  })

  it('handles empty weaknesses array', () => {
    render(<WeaknessesSection weaknesses={[]} />)
    expect(screen.getByText('Weaknesses')).toBeInTheDocument()
    expect(screen.getByText('No weaknesses found')).toBeInTheDocument()
  })

  it('implements focus trap navigation', () => {
    render(<WeaknessesSection weaknesses={mockWeaknesses} />)
    
    const badges = screen.getAllByTestId(/^weakness-badge-/)
    badges[0].focus()
    
    // Navigate to last badge
    fireEvent.keyDown(badges[0], { key: 'ArrowLeft' })
    expect(badges[badges.length - 1]).toHaveFocus()
    
    // Navigate past last badge should wrap to first
    // Press right arrow at end
    fireEvent.keyDown(badges[badges.length - 1], { key: 'ArrowRight' })
    expect(badges[0]).toHaveFocus()
  })
}) 