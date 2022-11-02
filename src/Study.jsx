import { useEffect, useState } from "preact/hooks";
import { Link } from "wouter-preact";
import { judgeCard } from "./lib/cards";
import { countStudyCard, getStudyCard, putCard } from "./lib/storage";

export function Study({ name }) {
  name = decodeURI(name);

  const [studyCount, setStudyCount] = useState(0);
  const [card, setCard] = useState(null);

  // The cut-off date for scheduled cards
  const scheduled = Date.now();

  // Update sets the next card to study and also
  // the count of cards to study
  const update = () => {
    countStudyCard({ deck: name, scheduled }).then(setStudyCount);
    getStudyCard({ deck: name, scheduled }).then(setCard);
  };

  // Update on initial load
  useEffect(update, []);

  // Update when the current card is answered
  const onjudge = (remembered) => {
    const newCard = judgeCard(card, remembered);
    putCard(newCard).then(update);
  };

  return (
    <>
      <h2>Study</h2>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Decks</Link></li>
          <li className="breadcrumb-item"><Link href={`/decks/${name}`}>{name}</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Study</li>
        </ol>
      </nav>
      <p>To study: {studyCount}</p>
      {card ? (
        <StudyCard card={card} onJudge={onjudge} />
      ) : (
        <p>There are no cards to study right now.</p>
      )}
    </>
  );
}
function StudyCard({ card, onJudge }) {
  const [hidden, setHidden] = useState(true);
  const reveal = () => setHidden(false);
  const hide = () => setHidden(true);
  const onsubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const action = e.target.dataset.action;
    if (!action) return;
    const remembered = action === "yes";
    onJudge(remembered);
  };

  // When the card changes, hide the card
  useEffect(hide, [card]);

  // reveal()

  return (
    <div className="card">
      <div className="card-body">
        <div className="card-front"><b>Question: </b>{card.front}</div>
        <hr />
        <div
          className="card-cover"
          hidden={!hidden}
          onClick={reveal}
          onKeyDown={reveal}
          tabIndex={1}
        >
          Tap to reveal the answer
        </div>
        <div className="card-back" hidden={hidden}>
          <div className="answer"><b>Answer: </b>{card.back}</div>
          <hr />
          <div className="judgement">
            <div className="q mb-3">Did you remember this card?</div>
            <div
              className="btn-group"
              onClick={onsubmit}
              onKeyDown={onsubmit}
            >
              <button data-action="yes" className="btn btn-outline-primary btn">yes</button>
              <button data-action="no" className="btn btn-outline-primary btn">no</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
