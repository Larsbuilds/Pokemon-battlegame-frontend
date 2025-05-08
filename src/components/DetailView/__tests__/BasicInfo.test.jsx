import React from 'react'
import { render, screen } from '@testing-library/react'
import { BasicInfo } from '../BasicInfo'

const mockPokemon = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  abilities: [
    { ability: { name: 'overgrow' } },
    { ability: { name: 'chlorophyll' } }
  ],
  gender_rate: 1,
  genera: [
    { genus: 'Seed Pokémon', language: { name: 'en' } }
  ]
}

describe('BasicInfo', () => {
  it('renders basic information correctly', () => {
    render(<BasicInfo pokemon={mockPokemon} />)
    
    // Check height conversion (7 decimeters = 2'04")
    expect(screen.getByText("2'04")).toBeInTheDocument()
    
    // Check weight conversion (69 hectograms = 15.2 lbs)
    expect(screen.getByText('15.2 lbs')).toBeInTheDocument()
    
    // Check abilities
    expect(screen.getByText('overgrow')).toBeInTheDocument()
    expect(screen.getByText('chlorophyll')).toBeInTheDocument()
    
    // Check category
    expect(screen.getByText('Seed Pokémon')).toBeInTheDocument()
  })

  it('formats measurements correctly', () => {
    render(<BasicInfo pokemon={mockPokemon} />)
    
    // Check measurement formatting
    const heightText = screen.getByText("2'04")
    const weightText = screen.getByText('15.2 lbs')
    
    expect(heightText).toHaveClass('text-2xl')
    expect(weightText).toHaveClass('text-2xl')
  })

  it('displays abilities with correct styling', () => {
    render(<BasicInfo pokemon={mockPokemon} />)
    
    const abilities = screen.getAllByTestId('ability-text')
    abilities.forEach(ability => {
      expect(ability).toHaveClass('text-2xl')
      expect(ability).toHaveClass('capitalize')
    })
  })

  it('handles null or undefined values gracefully', () => {
    const incompleteData = {
      ...mockPokemon,
      height: null,
      weight: undefined,
      abilities: [],
      genera: []
    }
    
    render(<BasicInfo pokemon={incompleteData} />)
    expect(screen.getByText("0'00")).toBeInTheDocument()
    expect(screen.getByText('Unknown')).toBeInTheDocument()
  })

  it('applies correct container styling', () => {
    render(<BasicInfo pokemon={mockPokemon} />)
    
    const container = screen.getByTestId('basic-info-container')
    expect(container).toHaveClass('grid')
    expect(container).toHaveClass('grid-cols-2')
    expect(container).toHaveClass('gap-6')
    expect(container).toHaveClass('p-6')
    expect(container).toHaveClass('bg-sky-400')
    expect(container).toHaveClass('rounded-lg')
    expect(container).toHaveClass('text-white')
  })

  it('formats section headings consistently', () => {
    render(<BasicInfo pokemon={mockPokemon} />)
    
    const headings = screen.getAllByRole('heading', { level: 3 })
    headings.forEach(heading => {
      expect(heading).toHaveClass('text-xl')
      expect(heading).toHaveClass('font-semibold')
      expect(heading).toHaveClass('mb-2')
    })
  })

  it('displays gender symbols correctly', () => {
    render(<BasicInfo pokemon={mockPokemon} />)
    
    const genderContainer = screen.getByTestId('gender-container')
    expect(genderContainer).toHaveClass('flex')
    expect(genderContainer).toHaveClass('gap-4')
    expect(genderContainer).toHaveClass('text-2xl')
    
    expect(screen.getByText('♂')).toBeInTheDocument()
    expect(screen.getByText('♀')).toBeInTheDocument()
  })
}) 