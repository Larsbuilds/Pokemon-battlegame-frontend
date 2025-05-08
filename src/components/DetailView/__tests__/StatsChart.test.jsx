import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { StatsChart } from '../StatsChart'

describe('StatsChart', () => {
  const mockStats = [
    { stat: { name: 'hp' }, base_stat: 45 },
    { stat: { name: 'attack' }, base_stat: 49 },
    { stat: { name: 'defense' }, base_stat: 49 },
    { stat: { name: 'special-attack' }, base_stat: 65 },
    { stat: { name: 'special-defense' }, base_stat: 65 },
    { stat: { name: 'speed' }, base_stat: 45 }
  ]

  it('renders stats chart correctly', () => {
    render(<StatsChart stats={mockStats} loading={false} />)
    
    // Check for section title
    expect(screen.getByText('Base Stats')).toBeInTheDocument()
    
    // Check for all stat labels
    expect(screen.getByText('HP')).toBeInTheDocument()
    expect(screen.getByText('Attack')).toBeInTheDocument()
    expect(screen.getByText('Defense')).toBeInTheDocument()
    expect(screen.getByText('Sp. Attack')).toBeInTheDocument()
    expect(screen.getByText('Sp. Defense')).toBeInTheDocument()
    expect(screen.getByText('Speed')).toBeInTheDocument()
    
    // Check for all stat values using data-testid
    expect(screen.getByTestId('stat-value-hp')).toHaveTextContent('45')
    expect(screen.getByTestId('stat-value-attack')).toHaveTextContent('49')
    expect(screen.getByTestId('stat-value-defense')).toHaveTextContent('49')
    expect(screen.getByTestId('stat-value-special-attack')).toHaveTextContent('65')
    expect(screen.getByTestId('stat-value-special-defense')).toHaveTextContent('65')
    expect(screen.getByTestId('stat-value-speed')).toHaveTextContent('45')
  })

  it('renders loading skeleton when loading is true', () => {
    render(<StatsChart stats={mockStats} loading={true} />)
    
    // Check for loading skeleton elements
    expect(screen.getByText('Base Stats')).toBeInTheDocument()
    expect(screen.getAllByTestId('skeleton')).toHaveLength(18)
  })

  it('handles null or undefined stats prop', () => {
    render(<StatsChart stats={null} loading={false} />)
    
    // Should not render any stats
    expect(screen.queryByText('HP')).not.toBeInTheDocument()
    expect(screen.queryByTestId('stat-value-hp')).not.toBeInTheDocument()
  })

  it('shows tooltip on hover', () => {
    render(<StatsChart stats={mockStats} loading={false} />)
    
    // Hover over HP stat
    const hpStat = screen.getByText('HP')
    fireEvent.mouseEnter(hpStat)
    
    // Check for tooltip content
    expect(screen.getByText('Hit Points - Determines how much damage a Pokémon can take before fainting')).toBeInTheDocument()
  })

  it('applies correct colors to stat bars', () => {
    render(<StatsChart stats={mockStats} loading={false} />)
    
    // Get all stat bars using data-testid
    expect(screen.getByTestId('stat-bar-hp')).toHaveClass('bg-red-500')
    expect(screen.getByTestId('stat-bar-attack')).toHaveClass('bg-orange-500')
    expect(screen.getByTestId('stat-bar-defense')).toHaveClass('bg-yellow-500')
    expect(screen.getByTestId('stat-bar-special-attack')).toHaveClass('bg-purple-500')
    expect(screen.getByTestId('stat-bar-special-defense')).toHaveClass('bg-green-500')
    expect(screen.getByTestId('stat-bar-speed')).toHaveClass('bg-blue-500')
  })

  it('handles keyboard navigation', () => {
    render(<StatsChart stats={mockStats} loading={false} />)
    
    // Get all stat elements
    const stats = screen.getAllByRole('listitem')
    
    // Focus on first stat
    act(() => {
      stats[0].focus()
    })
    
    // Press arrow down
    act(() => {
      fireEvent.keyDown(stats[0], { key: 'ArrowDown' })
    })
    expect(stats[1]).toHaveFocus()
    
    // Press arrow up
    act(() => {
      fireEvent.keyDown(stats[1], { key: 'ArrowUp' })
    })
    expect(stats[0]).toHaveFocus()
  })

  it('applies correct ARIA attributes', () => {
    render(<StatsChart stats={mockStats} loading={false} />)
    
    // Get the stats container
    const container = screen.getByRole('list')
    
    // Check ARIA attributes
    expect(container).toHaveAttribute('aria-label', 'Pokemon base stats')
    
    // Get all stat items
    const stats = screen.getAllByRole('listitem')
    
    // Check ARIA attributes for each stat
    stats.forEach(stat => {
      expect(stat).toHaveAttribute('role', 'listitem')
      expect(stat).toHaveAttribute('tabindex', '0')
    })
  })

  it('applies correct styling to stat bars', () => {
    render(<StatsChart stats={mockStats} loading={false} />)
    
    // Get all stat bars
    const statBars = screen.getAllByRole('progressbar')
    
    // Check styling for each bar
    statBars.forEach(bar => {
      expect(bar).toHaveClass('h-3')
      expect(bar).toHaveClass('bg-gray-100')
      expect(bar).toHaveClass('rounded-full')
      expect(bar).toHaveClass('overflow-hidden')
    })
  })

  it('applies correct styling to stat values', () => {
    render(<StatsChart stats={mockStats} loading={false} />)
    
    // Get all stat values using data-testid
    const values = [
      screen.getByTestId('stat-value-hp'),
      screen.getByTestId('stat-value-attack'),
      screen.getByTestId('stat-value-defense'),
      screen.getByTestId('stat-value-special-attack'),
      screen.getByTestId('stat-value-special-defense'),
      screen.getByTestId('stat-value-speed')
    ]
    
    // Check styling for each value
    values.forEach(value => {
      expect(value).toHaveClass('text-sm')
      expect(value).toHaveClass('mt-1')
      expect(value).toHaveClass('text-gray-600')
    })
  })

  it('handles focus states correctly', () => {
    render(<StatsChart stats={mockStats} loading={false} />)
    
    // Get first stat
    const firstStat = screen.getAllByRole('listitem')[0]
    
    // Focus the stat
    act(() => {
      firstStat.focus()
    })
    
    // Check focus styles
    expect(firstStat).toHaveClass('focus:outline-none')
    expect(firstStat).toHaveClass('focus:ring-2')
    expect(firstStat).toHaveClass('focus:ring-blue-500')
    expect(firstStat).toHaveClass('focus:ring-offset-2')
  })
}) 