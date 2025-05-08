import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { VersionBadges } from '../VersionBadges'

const mockVersions = [
  { name: 'red', url: 'https://pokeapi.co/api/v2/version/1/' },
  { name: 'blue', url: 'https://pokeapi.co/api/v2/version/2/' },
  { name: 'yellow', url: 'https://pokeapi.co/api/v2/version/3/' }
]

describe('VersionBadges', () => {
  it('renders version badges correctly', () => {
    render(<VersionBadges versions={mockVersions} />)
    
    mockVersions.forEach(version => {
      const badge = screen.getByTestId(`version-badge-${version.name}`)
      expect(badge).toHaveTextContent(version.name)
      expect(badge).toHaveClass('capitalize')
    })
  })

  it('maintains proper spacing between badges', () => {
    render(<VersionBadges versions={mockVersions} />)
    
    const container = screen.getByTestId('version-badges-container')
    expect(container).toHaveClass('flex')
    expect(container).toHaveClass('gap-2')
  })

  it('handles keyboard navigation', () => {
    render(<VersionBadges versions={mockVersions} />)
    
    const badges = screen.getAllByTestId(/^version-badge-/)
    badges[0].focus()
    
    // Press right arrow
    fireEvent.keyDown(badges[0], { key: 'ArrowRight' })
    expect(badges[1]).toHaveFocus()
    
    // Press left arrow
    fireEvent.keyDown(badges[1], { key: 'ArrowLeft' })
    expect(badges[0]).toHaveFocus()
  })

  it('applies correct styling to badges', () => {
    render(<VersionBadges versions={mockVersions} />)
    
    const badges = screen.getAllByTestId(/^version-badge-/)
    badges.forEach(badge => {
      expect(badge).toHaveClass('bg-gray-100')
      expect(badge).toHaveClass('text-gray-800')
      expect(badge).toHaveClass('rounded-full')
      expect(badge).toHaveClass('px-3')
      expect(badge).toHaveClass('py-1')
    })
  })

  it('handles hover states correctly', () => {
    render(<VersionBadges versions={mockVersions} />)
    
    const badges = screen.getAllByTestId(/^version-badge-/)
    badges.forEach(badge => {
      expect(badge).toHaveClass('hover:bg-gray-200')
      expect(badge).toHaveClass('transition-colors')
    })
  })

  it('applies consistent sizing to badges', () => {
    render(<VersionBadges versions={mockVersions} />)
    
    const badges = screen.getAllByTestId(/^version-badge-/)
    badges.forEach(badge => {
      expect(badge).toHaveClass('text-sm')
      expect(badge).toHaveClass('font-medium')
    })
  })

  it('handles focus trap navigation', () => {
    render(<VersionBadges versions={mockVersions} />)
    
    const badges = screen.getAllByTestId(/^version-badge-/)
    badges[0].focus()
    
    // Press left arrow at start
    fireEvent.keyDown(badges[0], { key: 'ArrowLeft' })
    expect(badges[badges.length - 1]).toHaveFocus()
    
    // Press right arrow at end
    fireEvent.keyDown(badges[badges.length - 1], { key: 'ArrowRight' })
    expect(badges[0]).toHaveFocus()
  })

  it('handles empty versions array', () => {
    render(<VersionBadges versions={[]} />)
    
    const container = screen.getByTestId('version-badges-container')
    expect(container).toBeEmptyDOMElement()
  })

  it('handles null or undefined versions prop', () => {
    render(<VersionBadges versions={null} />)
    
    const container = screen.getByTestId('version-badges-container')
    expect(container).toBeEmptyDOMElement()
  })
}) 