import type { FC } from "react";
import "../../styles/global.css";
type Path = string[];

export const PathTable: FC<{ path: Path; startWord: string }> = ({
  path,
  startWord,
}) => {
  if (!path || !path.length) return null;
  const differentLetters = getDifferentLetters(path, startWord);
  return (
    <div className="PathTable">
      <table>
        <tbody>
          {path.map((word, wordIndex) => {
            const letters = word.split("");
            return (
              <tr key={Math.random()}>
                {letters.map((letter, letterIndex) => (
                  <td key={Math.random()}>
                    <LetterBox
                      letter={letter}
                      differentLetter={differentLetters[wordIndex][letterIndex]}
                    />
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const LetterBox: FC<{ letter: string; differentLetter: boolean }> = ({
  letter,
  differentLetter,
}) => {
  return (
    <span className={`LetterBox ${differentLetter ? "DifferentLetter" : ""}`}>
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
