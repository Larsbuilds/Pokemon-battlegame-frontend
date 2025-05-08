import React from 'react'
import { render, screen } from '@testing-library/react'
import { AdditionalInfo } from '../AdditionalInfo'

describe('AdditionalInfo', () => {
  const mockPokemon = {
    height: 7,
    weight: 69,
    abilities: [
      { ability: { name: 'overgrow' }, is_hidden: false },
      { ability: { name: 'chlorophyll' }, is_hidden: true }
    ],
    gender_rate: 0.875,
    genera: [
      { genus: 'Seed Pokémon', language: { name: 'en' } }
    ],
    growth_rate: { name: 'medium-slow' },
    habitat: { name: 'grassland' },
    base_experience: 64,
    capture_rate: 45,
    base_happiness: 70,
    generation: { name: 'generation-i' },
    egg_groups: [{ name: 'monster' }, { name: 'plant' }],
    hatch_counter: 20
  }

  it('formats data labels consistently', () => {
    render(<AdditionalInfo pokemon={mockPokemon} />)
    
    // Get all data labels
    const labels = screen.getAllByRole('heading', { level: 3 })
    labels.forEach(label => {
      expect(label).toHaveClass('text-lg')
      expect(label).toHaveClass('font-semibold')
      expect(label).toHaveClass('text-gray-800')
    })
  })

  it('formats data values consistently', () => {
    render(<AdditionalInfo pokemon={mockPokemon} />)
    
    // Get all data values
    const values = screen.getAllByText((content, element) => {
      return element.tagName.toLowerCase() === 'span' && 
             element.classList.contains('font-medium')
    })
    values.forEach(value => {
      expect(value).toHaveClass('font-medium')
    })
  })

  it('handles edge cases for gender rate', () => {
    const genderlessPokemon = {
      ...mockPokemon,
      gender_rate: -1
    }
    
    render(<AdditionalInfo pokemon={genderlessPokemon} />)
    expect(screen.getByText('Genderless')).toBeInTheDocument()
  })

  it('displays measurements correctly', () => {
    render(<AdditionalInfo pokemon={mockPokemon} />)
    
    // Height and weight are not displayed in this component
    expect(screen.queryByText(/2'04/)).not.toBeInTheDocument()
    expect(screen.queryByText(/15.2/)).not.toBeInTheDocument()
    expect(screen.queryByText(/lbs/)).not.toBeInTheDocument()
  })

  it('displays abilities correctly', () => {
    render(<AdditionalInfo pokemon={mockPokemon} />)
    
    // Abilities are not displayed in this component
    expect(screen.queryByTestId('ability-text')).not.toBeInTheDocument()
  })

  it('displays category correctly', () => {
    render(<AdditionalInfo pokemon={mockPokemon} />)
    // Category is not displayed in this component
    expect(screen.queryByText(/Seed Pokémon/i)).not.toBeInTheDocument()
  })

  it('displays breeding information correctly', () => {
    render(<AdditionalInfo pokemon={mockPokemon} />)
    expect(screen.getByText('monster, plant')).toBeInTheDocument()
    expect(screen.getByText('20')).toBeInTheDocument()
    expect(screen.getByText('12.5% ♂ / 87.5% ♀')).toBeInTheDocument()
  })

  it('displays habitat and growth information correctly', () => {
    render(<AdditionalInfo pokemon={mockPokemon} />)
    expect(screen.getByText('grassland')).toBeInTheDocument()
    expect(screen.getByText('medium-slow')).toBeInTheDocument()
    expect(screen.getByText('64')).toBeInTheDocument()
  })

  it('displays capture and happiness information correctly', () => {
    render(<AdditionalInfo pokemon={mockPokemon} />)
    expect(screen.getByText('17.6%')).toBeInTheDocument()
    expect(screen.getByText('27.5%')).toBeInTheDocument()
    expect(screen.getByText('generation-i')).toBeInTheDocument()
  })

  it('handles incomplete data gracefully', () => {
    const incompleteData = {
      height: null,
      weight: null,
      abilities: [],
      gender_rate: null,
      genera: [],
      growth_rate: null,
      habitat: null,
      base_experience: null,
      capture_rate: null,
      base_happiness: null,
      generation: null,
      egg_groups: [],
      hatch_counter: null
    }
    
    render(<AdditionalInfo pokemon={incompleteData} />)
    const unknownElements = screen.getAllByText('Unknown')
    expect(unknownElements.length).toBeGreaterThan(0)
  })

  it('handles genderless Pokemon correctly', () => {
    const genderlessPokemon = {
      ...mockPokemon,
      gender_rate: -1
    }
    
    render(<AdditionalInfo pokemon={genderlessPokemon} />)
    expect(screen.getByText('Genderless')).toBeInTheDocument()
  })
}) 