import './App.css'
import { useState } from "react";
import { languages } from "./languages.jsx";
import { clsx } from "clsx";
import { getFarewellText } from "./utils.jsx";
import { guessWord } from "./utils.jsx";
import Confetti from "canvas-confetti";

export default function AssemblyEndgame() {
  const [language, setLanguage] = useState(languages);
  const [word, setWord] = useState(() => guessWord());
  const [clickedButtons, setClickedButtons] = useState([]);

  const wrongGuessCount = clickedButtons.filter(
    (e) => !word.includes(e)
  ).length;

  const gameLost = wrongGuessCount >= 8;

  const gameWon = word.split("").every((e) => clickedButtons.includes(e));

  let gameOver = gameWon || gameLost;

  function addAlphabets(letter) {
    return setClickedButtons((prev) =>
      prev.includes(letter) ? letter : [...prev, letter]
    );
  }

  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  const alphabetButtons = alphabet.split("").map((e) => {
    let isGuess = clickedButtons.includes(e);
    let isCorrect = isGuess && word.includes(e);
    let isWrong = isGuess && !word.includes(e);

    const className = clsx({
      correct: isCorrect,
      wrong: isWrong,
    });

    return (
      <button
        disabled={gameOver}
        className={className}
        onClick={() => addAlphabets(e)}
      >
        {e.toUpperCase()}
      </button>
    );
  });

  const gameStatus = clsx("game-status", {
    won: gameWon,
    lost: gameLost,
  });

  function reset() {
    setWord(guessWord());
    setClickedButtons([]);
    gameOver = false;
  }

  function renderGameStatus() {
    const guessArray = wrongGuessCount - 1;
    if (!gameOver) {
      const message = getFarewellText(
        language[wrongGuessCount && guessArray].name
      );
      return <p>{wrongGuessCount ? message : ""}</p>;
    }
    if (gameWon) {
      return (
        <>
          <h2>You Won!</h2>
          <p>Well done!🎉</p>
        </>
      );
    } else {
      return (
        <>
          <h2>Game Over!</h2>
          <p>You lose, Better Start learning assembly.</p>
          <p>The word was "{word.toUpperCase()}".</p>
        </>
      );
    }
  }

  return (
    <main>
      {gameWon && <Confetti recycle={false} numberOfPieces={10000} />}
      <header className="header">
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word within 8 attempts to keep the programming world safe
          from assembly!
        </p>
      </header>
      <section aria-live="polite" role="status" className={gameStatus}>
        {renderGameStatus()}
      </section>
      <section className="languages">
        {language.map((e, index) => {
          const isLanguageLost = index < wrongGuessCount;
          const className = clsx("chip", isLanguageLost && "lost");
          return (
            <span
              className={className}
              style={{ backgroundColor: e.backgroundColor, color: e.color }}
            >
              {e.name}
            </span>
          );
        })}
      </section>
      <section className="main-game">
        {word.split("").map((e, index) => {
          const className = clsx(
            gameLost && !clickedButtons.includes(e) && "missed-letters"
          );
          return (
            <span className={className} key={index}>
              {clickedButtons.includes(e)
                ? e.toUpperCase()
                : gameLost
                ? e.toUpperCase()
                : ""}
            </span>
          );
        })}
      </section>
      <section className="alphabetButtons">{alphabetButtons}</section>
      {gameOver && (
        <section className="new-game">
          <button onClick={reset}>New Game</button>
        </section>
      )}
    </main>

  );
}

