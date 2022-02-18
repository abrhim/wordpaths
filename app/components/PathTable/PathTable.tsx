import type { FC } from "react";
import "../../styles/global.css";
type Path = string[];

export const PathTable: FC<{
  path: Path;
  startWord: string;
  endWord: string;
}> = ({ path, startWord, endWord, children }) => {
  return (
    <div className="PathTable">
      <table>
        <tbody>
          <tr>
            {startWord.split("").map((letter) => (
              <td key={Math.random()}>
                <LetterBox letter={letter} correctLetter={false} />
              </td>
            ))}
          </tr>

          {path?.map((word) => {
            const letters = word.split("");
            return (
              <tr key={Math.random()}>
                {letters.map((letter, letterIndex) => (
                  <td key={Math.random()}>
                    <LetterBox
                      letter={letter}
                      correctLetter={
                        letter.toUpperCase() ===
                        endWord.split("")[letterIndex].toUpperCase()
                      }
                    />
                  </td>
                ))}
              </tr>
            );
          })}
          {children}
          <tr>
            {endWord.split("").map((letter) => (
              <td key={Math.random()}>
                <LetterBox letter={letter} correctLetter={false} />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const LetterBox: FC<{
  letter: string;
  correctLetter: boolean;
}> = ({ letter, correctLetter }) => {
  return (
    <span className={`LetterBox ${correctLetter ? "CorrectLetter" : ""}`}>
      {letter.toUpperCase()}
    </span>
  );
};

const getDifferentLetters = (
  words: string[],
  startWord: string
): boolean[][] => {
  const differentLetters: boolean[][] = [];
  words.forEach((word1: string, wordIndex: number) => {
    const letters: boolean[] = [];

    const splitWordToCompareTo =
      wordIndex === 0
        ? startWord.toUpperCase().split("")
        : words[wordIndex - 1].toUpperCase().split("");

    word1.split("").forEach((letter, letterIndex) => {
      if (letter.toUpperCase() !== splitWordToCompareTo[letterIndex])
        letters[letterIndex] = true;
      else letters[letterIndex] = false;
    });
    differentLetters[wordIndex] = letters;
  });

  return differentLetters;
};
