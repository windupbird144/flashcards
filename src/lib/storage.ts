import { Card } from "./cards";

export type Database = {
  db: IDBDatabase;
  transaction: () => IDBObjectStore;
  addCard(obj: Card): void;
  deleteCard(key: string): void;
  updateCard(obj: Card): void;
  listCards(): Promise<Card[]>;
  getNextStudyCard(): Promise<Card | null>;
}

/**
 * Returns the flashcards database.
 *
 * Creates it if needed.
 * It is called FlashCardsDatabase.
 * It has one object store "flashcards"
 * Its keyPath is "key" and is a uuid
 *
 * @returns the flahscards database
 */
export async function getDatabase() {
  return new Promise<Database>((resolve, reject) => {
    const request = indexedDB.open("FlashCardsDatabase", 2);

    request.onerror = (event) => {
      reject(request.error);
    };

    request.onupgradeneeded = (event) => {
      const db = request.result;
      const objectStore = db.createObjectStore("flashcards", {
        keyPath: "key",
      });
      objectStore.createIndex("scheduled", "scheduled");
    };

    request.onsuccess = (event) => {
      const db = request.result;

      const wrapper = {
        db: db,
        // Create a new transaction that touches the 'flashcards' object
        transaction: () =>
          db.transaction(["flashcards"], "readwrite").objectStore("flashcards"),

        // Add a card to the database
        addCard(obj: Card): void {
          wrapper.transaction().add(obj);
        },

        // Delete a card with this key from the database
        deleteCard(key: string) {
          wrapper.transaction().delete(key);
        },

        // Update this card in the database
        updateCard(obj: Card) {
          wrapper.transaction().put(obj);
        },

        // Retrieve all cards in the database
        listCards(): Promise<Card[]> {
          return new Promise((resolve) => {
            // Get all the keys in the database
            const values = wrapper.transaction().getAll();
            values.onsuccess = () => {
              resolve(values.result);
            };
          });
        },

        // Get the next card that is ready to be studied
        getNextStudyCard(): Promise<Card | null> {
          return new Promise((resolve) => {
            const cursor = wrapper
              .transaction()
              .index("scheduled")
              .openCursor();
            cursor.onsuccess = (event) => {
              // cursor.result is null if there are no entries
              if (!cursor.result) return resolve(null);

              // we have a card
              const card = cursor.result.value;

              // See if this card is scheduled
              if (card.scheduled <= Date.now()) {
                resolve(card);
              }

              // This card is not yet scheduled
              // Since results are sorted by the scheduled property
              // there is nothing to study right now
              resolve(null);
            };
          });
        },
      };

      resolve(wrapper);
    };
  });
}
