import { useEffect, useState } from 'preact/hooks'
import { Link } from "wouter-preact"
import { listDecks, createDeck, countStudyCard } from './lib/storage'

export function Decks() {
    const [decks, setDecks] = useState([])

    useEffect(() => {
      listDecks().then(setDecks)
    }, [])
  
    const newdeck = () => {
      const name = prompt("Enter a new name")
      if (name) {
        createDeck(name)
          .then(listDecks)
          .then(setDecks)
      }
    }
  
    return (
      <section id="decks">
        <h2>Decks</h2>
        <ul>
          {
            decks.map(e => <li>
              <Link to={`/decks/${e}`}>
                <a>{e}</a>
              </Link>
            </li>)
          }
        </ul>
        <button onClick={newdeck} onKeyDown={newdeck}>
          Create new deck
        </button>
      </section>
    )
  }