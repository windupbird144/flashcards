import { deleteDB, openDB } from "idb";

/**
 * Create the flashcards database
 *
 * Object Stores:
 *  decks { key }
 *  cards { key, scheduledAt, front, back }
 */
async function createDb() {
  const db = await openDB("flashcards", 1, {
    upgrade(db) {
      db.createObjectStore("decks", { keyPath: "key" });
      const store = db.createObjectStore("cards", { keyPath: "key" });
      // Create an index on scheduled and deck
      store.createIndex("idx_scheduled", "scheduled");
      store.createIndex("idx_deck", "deck");
      store.createIndex("idx_deck_scheduled", ["deck", "scheduled"]);
    },
  });
  return db;
}

// Create a read-only transaction for the cards object store
const cards = async () =>
  (await createDb()).transaction("cards").objectStore("cards");

export const listDecks = async () =>
  (await createDb())
    .transaction("decks")
    .objectStore("decks")
    .getAll()
    .then((e) => e.map((e) => e.key));

export const createDeck = async (key) =>
  (await createDb())
    .transaction("decks", "readwrite")
    .objectStore("decks")
    .put({ key: key });

export const putCard = async (card) =>
  (await createDb())
    .transaction("cards", "readwrite")
    .objectStore("cards")
    .put(card);

export const countCards = async ({ deck }) =>
  (await cards()).index("idx_deck").count(deck);

/**
 * Returns an IDBKeyRange to find cards which are ready
 * to study in a certain deck.
 *
 * it is equivalent to the sql query
 *
 * where (deck = $deck) and (scheduled < $scheduled)
 */
const scheduledInDeck = ({ deck, scheduled }) =>
  IDBKeyRange.bound(
    [deck, 0], // lower bound
    [deck, scheduled + 2000] // upper bound (add two seconds)
  );

export const getStudyCard = async ({ deck, scheduled }) =>
  (await cards())
    .index("idx_deck_scheduled")
    .get(scheduledInDeck({ deck, scheduled }));

export const countStudyCard = async ({ deck, scheduled }) =>
  (await cards())
    .index("idx_deck_scheduled")
    .count(scheduledInDeck({ deck, scheduled }));

export const getCards = async ({ deck }) =>
  (await cards()).index("idx_deck").getAll(IDBKeyRange.only(deck));

export const deleteCard = async (key) =>
  (await createDb())
    .transaction("cards", "readwrite")
    .objectStore("cards")
    .delete(key);

/**
 * Delete all cards belonging to the given deck
 */
export const deleteDeck = async ({ deck }) => {
  /**
   * Delete the deck
   */
  await (await createDb())
    .transaction("decks", "readwrite")
    .objectStore("decks")
    .delete(deck);
  /**
   * Delete all cards in the deck
   */
  const cursor = await (await createDb())
    .transaction("cards", "readwrite")
    .objectStore("cards")
    .index("idx_deck")
    .openCursor();
  if (cursor) {
    cursor.delete();
    cursor.continue();
  }
};
