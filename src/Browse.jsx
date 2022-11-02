import { useEffect, useState } from "preact/hooks";
import { Link } from "wouter-preact";
import { deleteCard, getCards } from "./lib/storage";

export function Browse({ name }) {
  name = decodeURI(name);

  const [cards, setCards] = useState([]);
  const [toDelete, setToDelete] = useState([]);
  
  /**
   * Mark the card and the specified index for deletoin
   * @param {number} index
   */
  const toggleToDelete = (index) => {
    const arr = [...toDelete]
    arr[index] = !arr[index]
    setToDelete(arr)
  }
  const update = () => {
    getCards({ deck: name }).then(setCards);
    setToDelete(cards.map(() => false))
  };

  useEffect(update, []);

  /**
   * Delete the selected cards
   */
  const ondelete = async () => {
    if (!confirm("Are you sure you want to delete this card?")) return;
    await Promise.all(cards
      .filter((e,i) => toDelete[i]) // select the cards marked for deletion
      .map((e) => deleteCard(e.key))) // delete it by key
    update();
  };

  return (
    <section id="browse">
      <h2>{decodeURI(name)}</h2>

      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Decks</Link></li>
          <li className="breadcrumb-item"><Link href={`/decks/${name}`}>{name}</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Browse</li>
        </ol>
      </nav>
      <p hidden={cards.length > 0}>There are no cards in this deck.</p>
      <table hidden={cards.length < 1} className="table table-bordered">
        <thead>
          <tr className="">
            <th></th>
            <th>Front</th>
            <th>Back</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((e,i) => (
            <tr onClick={() => toggleToDelete(i)}
              className={toDelete[i] ? 'table-info' : ''}>
              <td><input
                type="checkbox"
                className="form-check-input"
                checked={toDelete[i]}
                /></td>
              <td>{e.front}</td>
              <td>{e.back}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-danger"
        onClick={ondelete}
        hidden={toDelete.indexOf(true) < 0}>
        Delete selected
      </button>
    </section>
  );
}
