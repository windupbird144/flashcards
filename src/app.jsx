import { Link, Route, Router } from "wouter-preact";
import "./app.css";
import { Browse } from "./Browse";
import { Deck } from "./Deck";
import { Decks } from "./Decks";
import { Study } from "./Study";

export function App() {
  /**
   * Use location.hash as a router
   */
  return (
    <>
      <nav>
        <Link to="/">
          <a>Decks</a>
        </Link>
        <Link to="/about">
          <a>About</a>
        </Link>
      </nav>
      <main>
        <Route path="/" component={Decks} />
        <Route path="/decks/:name">
          {(params) => <Deck name={params.name} />}
        </Route>
        <Route path="/decks/:name/study">
          {(params) => <Study name={params.name} />}
        </Route>
        <Route path="/decks/:name/browse">
          {(params) => <Browse name={params.name} />}
        </Route>
        <Route path="/about">{(params) => <About />}</Route>
      </main>
    </>
  );
}

function About() {
  return (
    <article>
      <h2>About Flashcards</h2>
      <p>Flashcards is an offline flash cards app for the browser.</p>
      <p>
        Flashcards is an app to create and study flash cards. It works in the
        browser as an offline app. The app is very simple. For more advanced use
        cases, see [Wikipedia: List of flash card
        software](https://en.wikipedia.org/wiki/List_of_flashcard_software) for
        good solutions.
      </p>
      <h4>Flash cards</h4>
      <p>
        The app lets you create flash cards with a front (text) and back (text).
        In a study session, you review each card and note whether you remembered
        the answer or not. Cards which you remember will appear less frequently
        while cards you failed to remember appear sooner. This method is called
        [spaced repitition](https://en.wikipedia.org/wiki/Spaced_repetition).
      </p>

      <h4>Work offline</h4>
      <p>
        The app works offline. Open the app in your browser and select "Add to
        home screen". This adds an icon to your home screen and makes the app
        available offline.
      </p>
    </article>
  );
}

