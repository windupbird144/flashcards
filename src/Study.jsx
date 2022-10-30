import { useEffect, useState } from "preact/hooks";
import { Link } from "wouter-preact";
import { judgeCard } from "./lib/cards";
import { countStudyCard, getStudyCard, putCard } from "./lib/storage";

export function Study({ name }) {
  name = decodeURI(name)
  
  const [studyCount, setStudyCount] = useState(0);
  const [card, setCard] = useState(null);

  // The cut-off date for scheduled cards
  const scheduled = Date.now();

  // Update sets the next card to study and also
  // the count of cards to study
  const update = () => {
    countStudyCard({ deck: name, scheduled })
      .then(setStudyCount);
    getStudyCard({ deck: name, scheduled })
      .then(setCard);
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
      <h3>Study</h3>
      <p>To study: {studyCount}</p>
      {card
        ? <StudyCard card={card} onJudge={onjudge} />
        : <p>There are no cards to study right now.</p>}
      <p>
        <Link to={`/decks/${name}`}>Back</Link>
      </p>
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
    if (!action)
      return;
    const remembered = action === "yes";
    onJudge(remembered);
  };

  // When the card changes, hide the card
  useEffect(hide, [card])

  return <div className="card">
    <div className="card-front">{card.front}</div>
    <div
      className="card-cover"
      hidden={!hidden}
      onClick={reveal}
      // allow tab + enter to reveal
      onKeyDown={reveal}
      tabIndex={1}
    >
      Tap to reveal
    </div>
    <div className="card-back" hidden={hidden}>
      <div className="answer">{card.back}</div>
      <div className="judgement">
        <div className="q">Did you remember this card?</div>
        <div className="card-buttons"
          onClick={onsubmit}
          onKeyDown={onsubmit}
        >
          <button data-action="yes">yes</button>
          <button data-action="no">no</button>
        </div>
      </div>
    </div>
  </div>;
}
