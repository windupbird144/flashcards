import { useEffect, useState } from "preact/hooks";
import "./app.css";
import { Card, judgeCard, newCard } from "./lib/cards";
import { Database, getDatabase } from "./lib/storage";

export function App() {
  const [hash, setHash] = useState(location.hash);
  addEventListener("hashchange", () => {
    setHash(location.hash);
  });

  return (
    <>
      <nav>
        <a href="#study">Study</a>
        <a href="#add-card">Add card</a>
        <a href="#browse">Browse cards</a>
        <a href="#about">About</a>
      </nav>
      <main>
        <Page hash={hash}></Page>
      </main>
    </>
  );
}

function Page(props: { hash: string }) {
  if (props.hash === "#study") return <PageStudy></PageStudy>;
  if (props.hash === "#add-card") return <PageAddCard></PageAddCard>;
  if (props.hash === "#browse") return <PageBrowse></PageBrowse>;
  if (props.hash === "#about") return <PageAbout></PageAbout>;
  return <></>;
}

function PageStudy() {
  // Fetch the database connection
  const [db, setDb] = useState<Database | null>(null);
  const [card, setCard] = useState<Card | null>(null);
  
  useEffect(() => {
    getDatabase().then((db) => {
      setDb(db);
      db.getNextStudyCard().then(setCard);
    });
  }, []);

  if (!db) return <></>;

  function judge(e: Event) {
    const target = e?.target as HTMLElement
    if (!target) return
    if (!card) return
    const choice = target.dataset.value
    console.log(choice)
    if (!choice) return
    const  remembered = choice === "yes"
    const newCard = judgeCard(card, remembered)
    // update the card
    db?.updateCard(newCard)
    // load the next card to study
    db?.getNextStudyCard().then(setCard)
  }

  return <>
      <h3>Study</h3>
      {
        (!card)
          ? <p>There are no cards to study right now.</p>
          : <PageStudyCard
          card={card}
          onJudge={judge}
          />
      }
  </>
  
}

function PageStudyCard(props: {
    card: Card
    onJudge: (e: Event) => void
  }) {

  const [hidden, setHidden] = useState(true);
  const reveal = () => setHidden(false)

  // hide when the card changes
  useEffect(() => { setHidden(true)}, [props.card])

  return (
    <>
      {props.card === null && <p>"There are no cards to study at this time.";</p>}

      <div>
        { props.card?.front }
        {
          hidden
            ? <div class="cover" onClick={reveal}>Click to reveal</div>
            : <div class="card-back">
              <div>{props.card?.back}</div>
              <div className="did-you-remember">Did you remember?</div>
              <div className="buttons" onClick={props.onJudge}>
                <button type="submit" data-value="yes">yes</button>
                <button type="submit" data-value="no">no</button>
              </div>

            </div>
        }
      </div>
    </>
  );
}

function PageAbout() {
  return (
    <p>
      <h3>About Flashcards</h3>
      Flashcards is a flash card app with spaced repitition.
    </p>
  );
}

function PageBrowse() {
  // Fetch the database connection
  const [db, setDb] = useState<Database | null>(null);
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    getDatabase().then((db) => {
      setDb(db);
      db.listCards().then(setCards);
    });
  }, []);

  if (!db) return <></>;

  const onDelete = (card: Card) => {
    // Ask for confirmation first
    if (!confirm("Are you sure you want to delete this card?")) return;

    // Update cards
    const newCards = [...cards];
    newCards.splice(cards.indexOf(card), 1);
    setCards(newCards);

    // Delete in database
    db.deleteCard(card.key);
  };

  return (
    <>
      <h3>Browse</h3>
      <p hidden={!!cards.length}>
        You have not created any cards.
      </p>
      <table hidden={cards.length<1}>
        <thead>
          <tr>
            <th>Front</th>
            <th>Back</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cards.map((e) => (
            <tr>
              <td>{e.front}</td>
              <td>{e.back}</td>
              <td>
                <button onClick={() => onDelete(e)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function PageAddCard() {
  // Fetch the database connection
  const [db, setDb] = useState<Database | null>(null);
  useEffect(() => {
    getDatabase().then(setDb);
  }, []);
  if (!db) return <></>;

  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  const onsubmit = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    const card = newCard({ front, back });
    db.addCard(card);
    setFront("");
    setBack("");
  };

  // Show the card
  return (
    <>
      <h3>Add card</h3>
      <form id="form-add-card" onSubmit={onsubmit}>
        <label htmlFor="front">Front</label>
        <textarea
          required
          name="front"
          id="front"
          rows={5}
          value={front}
          onInput={(e) => setFront(e.currentTarget.value ?? "")}
        ></textarea>

        <label htmlFor="back">Back</label>
        <textarea
          required
          name="back"
          id="back"
          rows={5}
          value={back}
          onInput={(e) => setBack(e.currentTarget.value ?? "")}
        ></textarea>

        <button type="submit">Add</button>
      </form>
    </>
  );
}
