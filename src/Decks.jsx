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
        <div className='list-group mb-3'>
          {
            decks.map(e => 
              <Link
                className="list-group-item"
                to={`/decks/${e}`}>
                  {e}
              </Link>
            )
          }
        </div>
        <button className='btn btn-primary' onClick={newdeck} onKeyDown={newdeck}>
          Create new deck
        </button>
      </section>
    )
  }