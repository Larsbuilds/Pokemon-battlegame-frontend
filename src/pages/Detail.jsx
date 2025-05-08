import { useParams } from 'react-router-dom'
import { DetailView } from '../components/DetailView/DetailView'

export default function Detail() {
  const { name } = useParams()
  return <DetailView pokemonName={name} />
} 