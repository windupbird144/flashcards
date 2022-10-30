import { useEffect, useState } from "preact/hooks";
import { Link } from "wouter-preact";
import { deleteCard, getCards } from "./lib/storage";

export function Browse({ name }) {
  name = decodeURI(name)
  
  const [cards, setCards] = useState([]);

  const update = () => {
    getCards({ deck: name }).then(setCards);
  };

  useEffect(update, []);

  const ondelete = (key) => {
    // Ask for confirmation
    if (!confirm("Are you sure you want to delete this card?"))
      return;
    deleteCard(key);
    update();
  };

  return (
    <section id="browse">
      <h2>{decodeURI(name)}</h2>
      <p hidden={cards.length > 0}>There are no cards in this deck.</p>
      <table hidden={cards.length < 1}>
        <thead>
          <tr>
            <th>Front</th>
            <th>Back</th>
            <th></th>
          </tr>
        </thead>

        {cards.map((e) => (
          <tr>
            <td>{e.front}</td>
            <td>{e.back}</td>
            <td>
              <button onClick={() => ondelete(e.key)}>Delete</button>
            </td>
          </tr>
        ))}
      </table>
      <p>
        <Link to={`/decks/${name}`}>Back</Link>
      </p>
    </section>
  );
}
