import { useRef, useState } from "preact/hooks";
import { useLocation } from "wouter-preact";
import { Link } from "wouter-preact";
import { createCard } from "./lib/cards";
import { countCards, countStudyCard, deleteDeck, putCard } from "./lib/storage";
import { getFormValues } from "./lib/util";

export function Deck({ name, ...props }) {
  // real name
  name = decodeURI(name)

  const [numCards, setNumCards] = useState(0);
  const [numStudyCards, setNumStudyCards] = useState(0);
  const [_, setLocation] = useLocation();
  const backToDecks = () => setLocation("/");

  countCards({ deck: name }).then(setNumCards);

  countStudyCard({ deck: name, scheduled: Date.now() }).then(setNumStudyCards);

  const form = useRef();

  const onsubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { front, back } = getFormValues(form.current);
    const newCard = createCard({
      front: front.trim(),
      back: back.trim(),
      deck: name,
    });
    putCard(newCard);
    form.current.reset();
    countCards({ deck: name }).then(setNumCards);
  };

  const ondelete = (e) => {
    const deleteText =
      "Are you sure you really wish to delete this deck? All cards in the deck are deleted too. This action cannot be reversed";
    if (!confirm(deleteText)) return
    deleteDeck({ deck: name }).then(backToDecks);
  };

  return (
    <section id="study">
      <h2>{decodeURI(name)}</h2>

      <div className="study-links">
        <Link href={`/decks/${name}/study`}>
          <a id="study-now">Study now</a>
        </Link>
        <Link href={`/decks/${name}/browse`}>
          <a id="">Browse cards</a>
        </Link>
      </div>

      <div className="study-stats">
        <div>
          Cards to study: <b>{numStudyCards}</b>
        </div>
        <div>
          Cards in this deck: <b>{numCards}</b>
        </div>
      </div>

      <div className="study-add-card">
        <h4>Add a card</h4>
        <form action="#" ref={form} onSubmit={onsubmit}>
          <label htmlFor="front">Front</label>
          <textarea name="front" id="front" rows={4} required></textarea>

          <label htmlFor="back">Back</label>
          <textarea name="back" id="back" rows={4} required></textarea>

          <button type="submit">Add card</button>
        </form>
      </div>

      <p>
        <Link to={`/`}>Back</Link>
      </p>
      <details className="delete-deck">
        <summary>Delete deck</summary>
        <button onClick={ondelete}>tap to delete this deck</button>
      </details>
    </section>
  );
}
