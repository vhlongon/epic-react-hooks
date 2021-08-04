// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'

import {
  fetchPokemon,
  PokemonDataView,
  PokemonForm,
  PokemonInfoFallback,
} from '../pokemon'

function ErrorFallback({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    pokemon: null,
    status: pokemonName ? 'pending' : 'idle',
    error: null,
  })

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }

    setState(s => ({...s, status: 'pending'}))

    fetchPokemon(pokemonName)
      .then(pokemonData =>
        setState({pokemon: pokemonData, status: 'resolved', error: null}),
      )
      .catch(error => {
        setState({pokemon: null, status: 'rejected', error})
      })
  }, [pokemonName])

  const {status, pokemon, error} = state

  if (status === 'idle') {
    return 'Submit a pokemon'
  }

  if (status === 'rejected') {
    throw error
  }

  if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  }

  return <PokemonDataView pokemon={pokemon} />
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          onReset={handleReset}
          FallbackComponent={ErrorFallback}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
