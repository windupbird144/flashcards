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
  const frontTextArea = useRef()

  /**
   * Submit the form and create a new card.
   * When done, focus on the 'front' textarea
   * so you can easily enter the next card
   */
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
    frontTextArea.current.focus()
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
      <ol className="breadcrumb">
        <li className="breadcrumb-item"><Link to="/" tabIndex={1}>Decks</Link></li>
        <li className="breadcrumb-item active" aria-current="page">{name}</li>
      </ol>

      <div className="study-links d-flex gap-2 mb-3">
        <Link href={`/decks/${name}/study`}>
          <a id="study-now" className="btn btn-primary" tabIndex={2}>Study now</a>
        </Link>
        <Link href={`/decks/${name}/browse`}>
          <a className="btn btn-secondary" tabIndex={3}>Browse cards</a>
        </Link>
      </div>

      <div className="study-stats mb-5">
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
          <div className="mb-3">
            <label htmlFor="front" className="form-label">Front</label>
            <textarea name="front" id="front" rows={4} className="form-control" required ref={frontTextArea} tabIndex={4}></textarea>
          </div>
          <div className="mb-3">
          <label htmlFor="back" className="form-label">Back</label>
          <textarea name="back" id="back" rows={4} className="form-control" required tabIndex={5}></textarea>
          </div>

          <button type="submit" className="btn btn-primary" tabIndex={6}>Add card</button>
        </form>
      </div>

      <div className="mt-5">
        <button
          className="btn-outline-danger btn"
          onClick={ondelete}>delete deck</button>
      </div>
    </section>
  );
}
