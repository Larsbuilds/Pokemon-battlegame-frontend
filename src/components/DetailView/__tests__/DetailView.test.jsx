import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { DetailView } from '../DetailView'
import { usePokemon } from '../../../hooks/usePokemon'
import { useParams } from 'react-router-dom'

// Mock the usePokemon hook
vi.mock('../../../hooks/usePokemon')

// Mock the react-router-dom useParams and useNavigate hooks
vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
  useNavigate: vi.fn()
}))

describe('DetailView', () => {
  const mockPokemon = {
    id: 1,
    name: 'bulbasaur',
    sprites: {
      front_default: 'https://example.com/bulbasaur.png'
    },
    types: [
      { type: { name: 'grass' } },
      { type: { name: 'poison' } }
    ],
    height: 7,
    weight: 69,
    abilities: [
      { ability: { name: 'overgrow' } },
      { ability: { name: 'chlorophyll' } }
    ],
    game_indices: [
      { version: { name: 'red' } },
      { version: { name: 'blue' } }
    ],
    weaknesses: [
      { type: 'fire', multiplier: 2 },
      { type: 'ice', multiplier: 2 }
    ],
    genera: [
      { genus: 'Seed Pokémon', language: { name: 'en' } }
    ]
  }

  beforeEach(() => {
    vi.clearAllMocks()
    useParams.mockReturnValue({ id: '1' })
  })

  it('renders loading state correctly', () => {
    usePokemon.mockReturnValue({
      pokemon: null,
      loading: true,
      error: null
    })

    render(<DetailView />)
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('renders error state correctly', () => {
    usePokemon.mockReturnValue({
      pokemon: null,
      loading: false,
      error: 'test error'
    })

    render(<DetailView />)
    expect(screen.getByTestId('error-message')).toBeInTheDocument()
    expect(screen.getByText('test error')).toBeInTheDocument()
  })

  it('renders detail view correctly', () => {
    usePokemon.mockReturnValue({
      pokemon: mockPokemon,
      loading: false,
      error: null
    })

    render(<DetailView />)
    
    expect(screen.getByTestId('detail-view')).toBeInTheDocument()
    expect(screen.getByTestId('pokemon-name')).toHaveTextContent('bulbasaur')
    expect(screen.getByText('2\'04')).toBeInTheDocument()
    expect(screen.getByText('15.2 lbs')).toBeInTheDocument()
    expect(screen.getByText('Seed Pokémon')).toBeInTheDocument()
    
    const abilities = screen.getAllByTestId('ability-text')
    expect(abilities).toHaveLength(2)
    expect(abilities[0]).toHaveTextContent('overgrow')
    expect(abilities[1]).toHaveTextContent('chlorophyll')
  })

  it('handles missing data gracefully', () => {
    const pokemonWithMissingData = {
      ...mockPokemon,
      sprites: {
        front_default: null
      }
    }
    usePokemon.mockReturnValue({
      pokemon: pokemonWithMissingData,
      loading: false,
      error: null
    })

    render(<DetailView />)
    
    const sprite = screen.getByTestId('pokemon-sprite')
    expect(sprite).toHaveAttribute('src', '')
    expect(sprite).toHaveAttribute('alt', 'bulbasaur front view')
  })

  it('displays sprite images correctly', () => {
    usePokemon.mockReturnValue({ pokemon: mockPokemon, loading: false, error: null })
    render(<DetailView />)
    
    const sprite = screen.getByTestId('pokemon-sprite')
    expect(sprite).toHaveAttribute('src', mockPokemon.sprites.front_default)
    expect(sprite).toHaveAttribute('alt', `${mockPokemon.name} front view`)
  })

  it('handles sprite loading errors', () => {
    usePokemon.mockReturnValue({ pokemon: mockPokemon, loading: false, error: null })
    render(<DetailView />)
    
    const sprite = screen.getByTestId('pokemon-sprite')
    fireEvent.error(sprite)
    expect(sprite).toHaveAttribute('src', '')
  })

  it('applies correct styling to sections', () => {
    usePokemon.mockReturnValue({ pokemon: mockPokemon, loading: false, error: null })
    render(<DetailView />)
    
    const sections = screen.getAllByTestId('detail-section')
    sections.forEach(section => {
      expect(section).toHaveClass('bg-white', 'rounded-lg', 'shadow-lg')
    })
  })

  it('handles keyboard navigation between sections', () => {
    usePokemon.mockReturnValue({ pokemon: mockPokemon, loading: false, error: null })
    render(<DetailView />)
    
    const sections = screen.getAllByTestId('detail-section')
    sections[0].focus()
    
    fireEvent.keyDown(sections[0], { key: 'ArrowRight' })
    expect(sections[1]).toHaveFocus()
    
    fireEvent.keyDown(sections[1], { key: 'ArrowLeft' })
    expect(sections[0]).toHaveFocus()
  })

  it('applies correct ARIA attributes', () => {
    usePokemon.mockReturnValue({ pokemon: mockPokemon, loading: false, error: null })
    render(<DetailView />)
    
    const container = screen.getByTestId('detail-view')
    expect(container).toHaveAttribute('role', 'main')
    expect(container).toHaveAttribute('aria-label', 'Pokemon Details')
  })

  it('handles responsive layout', () => {
    usePokemon.mockReturnValue({ pokemon: mockPokemon, loading: false, error: null })
    render(<DetailView />)
    
    const container = screen.getByTestId('detail-view')
    expect(container).toHaveClass('container', 'mx-auto', 'p-6')
    expect(container.querySelector('.grid')).toHaveClass('md:grid-cols-2', 'lg:grid-cols-3')
  })

  it('handles focus states correctly', () => {
    usePokemon.mockReturnValue({ pokemon: mockPokemon, loading: false, error: null })
    render(<DetailView />)
    
    const sections = screen.getAllByTestId('detail-section')
    sections[0].focus()
    expect(sections[0]).toHaveFocus()
  })
}) 