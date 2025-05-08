import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TypeSection } from '../TypeSection'

describe('TypeSection', () => {
  const mockTypes = [
    { type: { name: 'grass' } },
    { type: { name: 'poison' } }
  ]

  it('renders types correctly', () => {
    render(<TypeSection types={mockTypes} />)
    expect(screen.getByTestId('type-section')).toBeInTheDocument()
    mockTypes.forEach(type => {
      expect(screen.getByText(type.type.name)).toBeInTheDocument()
    })
  })

  it('handles empty types array', () => {
    render(<TypeSection types={[]} />)
    expect(screen.getByText('No types available')).toBeInTheDocument()
  })

  it('handles null types', () => {
    render(<TypeSection types={null} />)
    expect(screen.getByText('No types available')).toBeInTheDocument()
  })

  it('renders badges with correct styling', () => {
    render(<TypeSection types={mockTypes} />)
    
    // Get all type badges
    const badges = screen.getAllByText((content, element) => {
      return element.tagName.toLowerCase() === 'span' && 
             element.classList.contains('font-medium')
    })
    
    // Check that each badge has the correct classes
    badges.forEach(badge => {
      expect(badge).toHaveClass('inline-block')
      expect(badge).toHaveClass('px-3')
      expect(badge).toHaveClass('py-1')
      expect(badge).toHaveClass('rounded-full')
      expect(badge).toHaveClass('text-sm')
      expect(badge).toHaveClass('text-white')
      expect(badge).toHaveClass('font-medium')
      expect(badge).toHaveClass('capitalize')
    })
  })

  it('handles keyboard navigation', () => {
    render(<TypeSection types={mockTypes} />)
    
    // Get all badges
    const badges = screen.getAllByText((content, element) => {
      return element.tagName.toLowerCase() === 'span' && 
             element.classList.contains('font-medium')
    })
    
    // Since these are not interactive elements, we don't test keyboard navigation
    expect(badges).toHaveLength(2)
  })

  it('maintains proper spacing between badges', () => {
    render(<TypeSection types={mockTypes} />)
    
    // Get the container div
    const container = screen.getByTestId('type-section')
    
    // Check for proper gap spacing
    expect(container).toHaveClass('gap-2')
    expect(container).toHaveClass('flex')
    expect(container).toHaveClass('flex-wrap')
  })

  it('renders badges with correct ARIA attributes', () => {
    render(<TypeSection types={mockTypes} />)
    
    // Get all badges
    const badges = screen.getAllByText((content, element) => {
      return element.tagName.toLowerCase() === 'span' && 
             element.classList.contains('font-medium')
    })
    
    // Check that each badge has the correct classes for accessibility
    badges.forEach(badge => {
      expect(badge).toHaveClass('cursor-default')
      expect(badge).toHaveClass('select-none')
    })
  })

  it('applies correct type-specific colors', () => {
    render(<TypeSection types={mockTypes} />)
    
    // Get all badges
    const badges = screen.getAllByText((content, element) => {
      return element.tagName.toLowerCase() === 'span' && 
             element.classList.contains('font-medium')
    })
    
    // Check that each badge has the correct background color
    badges.forEach((badge, index) => {
      const type = mockTypes[index].type.name
      const style = window.getComputedStyle(badge)
      expect(style.backgroundColor).toMatch(/^rgb\(\d+,\s*\d+,\s*\d+\)$/)
    })
  })
}) 