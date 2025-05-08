import React from 'react'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { EvolutionChain } from '../EvolutionChain'
import { useEvolutionChain } from '../../../hooks/useEvolutionChain'

// Mock the useEvolutionChain hook
vi.mock('../../../hooks/useEvolutionChain')

// Mock the react-router-dom useNavigate hook
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn()
}))

const mockEvolutionChain = {
  name: 'bulbasaur',
  id: 1,
  sprite: 'sprite.png',
  types: ['grass', 'poison'],
  evolvesTo: [
    {
      name: 'ivysaur',
      id: 2,
      sprite: 'sprite.png',
      types: ['grass', 'poison'],
      evolvesTo: [
        {
          name: 'venusaur',
          id: 3,
          sprite: 'sprite.png',
          types: ['grass', 'poison'],
          evolvesTo: []
        }
      ]
    }
  ]
}

const mockPokemonData = {
  sprites: {
    front_default: 'sprite.png'
  },
  types: [
    { type: { name: 'grass' } },
    { type: { name: 'poison' } }
  ]
}

describe('EvolutionChain', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loading state correctly', () => {
    useEvolutionChain.mockReturnValue({
      evolutionChain: null,
      loading: true,
      error: null
    })

    render(<EvolutionChain pokemonId={1} />)
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
  })

  it('renders error state correctly', () => {
    useEvolutionChain.mockReturnValue({
      evolutionChain: null,
      loading: false,
      error: 'test error'
    })

    render(<EvolutionChain pokemonId={1} />)
    expect(screen.getByTestId('error-message')).toBeInTheDocument()
  })

  it('renders evolution chain correctly', () => {
    useEvolutionChain.mockReturnValue({
      evolutionChain: mockEvolutionChain,
      loading: false,
      error: null
    })

    render(<EvolutionChain pokemonId={1} />)
    expect(screen.getByTestId('evolution-chain-item-bulbasaur')).toBeInTheDocument()
    expect(screen.getByTestId('evolution-chain-item-ivysaur')).toBeInTheDocument()
    expect(screen.getByTestId('evolution-chain-item-venusaur')).toBeInTheDocument()
  })

  it('handles Pokemon with no evolutions', () => {
    const noEvolutionChain = {
      name: 'ditto',
      id: 132,
      sprite: 'sprite.png',
      types: ['normal'],
      evolvesTo: []
    }

    useEvolutionChain.mockReturnValue({
      evolutionChain: noEvolutionChain,
      loading: false,
      error: null
    })

    render(<EvolutionChain pokemonId={132} />)
    expect(screen.getByTestId('evolution-chain-item-ditto')).toBeInTheDocument()
    expect(screen.queryByText('evolves to')).not.toBeInTheDocument()
  })

  it('handles Pokemon with multiple evolution paths', () => {
    const multiEvolutionChain = {
      name: 'eevee',
      id: 133,
      sprite: 'sprite.png',
      types: ['normal'],
      evolvesTo: [
        {
          name: 'vaporeon',
          id: 134,
          sprite: 'sprite.png',
          types: ['water'],
          evolvesTo: []
        },
        {
          name: 'jolteon',
          id: 135,
          sprite: 'sprite.png',
          types: ['electric'],
          evolvesTo: []
        }
      ]
    }

    useEvolutionChain.mockReturnValue({
      evolutionChain: multiEvolutionChain,
      loading: false,
      error: null
    })

    render(<EvolutionChain pokemonId={133} />)
    expect(screen.getByTestId('evolution-chain-item-eevee')).toBeInTheDocument()
    expect(screen.getByTestId('evolution-chain-item-vaporeon')).toBeInTheDocument()
    expect(screen.getByTestId('evolution-chain-item-jolteon')).toBeInTheDocument()
  })

  it('renders type badges correctly', () => {
    useEvolutionChain.mockReturnValue({
      evolutionChain: mockEvolutionChain,
      loading: false,
      error: null
    })

    render(<EvolutionChain pokemonId={1} />)
    expect(screen.getAllByTestId('type-badge-grass')).toHaveLength(3)
    expect(screen.getAllByTestId('type-badge-poison')).toHaveLength(3)
  })

  it('makes evolution chain items clickable', () => {
    useEvolutionChain.mockReturnValue({
      evolutionChain: mockEvolutionChain,
      loading: false,
      error: null
    })

    render(<EvolutionChain pokemonId={1} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(3)
  })

  it('handles special evolution conditions', () => {
    const specialEvolutionChain = {
      name: 'pichu',
      id: 172,
      sprite: 'sprite.png',
      types: ['electric'],
      evolvesTo: [
        {
          name: 'pikachu',
          id: 25,
          sprite: 'sprite.png',
          types: ['electric'],
          evolvesTo: [
            {
              name: 'raichu',
              id: 26,
              sprite: 'sprite.png',
              types: ['electric'],
              evolvesTo: []
            }
          ]
        }
      ]
    }

    useEvolutionChain.mockReturnValue({
      evolutionChain: specialEvolutionChain,
      loading: false,
      error: null
    })

    render(<EvolutionChain pokemonId={172} />)
    expect(screen.getByTestId('evolution-chain-item-pichu')).toBeInTheDocument()
    expect(screen.getByTestId('evolution-chain-item-pikachu')).toBeInTheDocument()
    expect(screen.getByTestId('evolution-chain-item-raichu')).toBeInTheDocument()
  })
}) 