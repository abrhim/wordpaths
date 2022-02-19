import type { FC } from "react";
import "../../styles/global.css";

export const PathTable: FC<{
  path: string[];
  startWord: string;
  endWord: string;
  finished: boolean;
}> = ({ path, startWord, endWord, children, finished }) => {
  return (
    <div className="path-list margin-top-md">
      <div className="flex flex-column gap-xs items-center">
        <div className="path-entry path-entry--start flex gap-xs items-center text-center">
          {startWord.split("").map((letter, index) => (
            <LetterBox
              key={`${letter}-${index}`}
              letter={letter}
              correctLetter={false}
            />
          ))}
        </div>

        {path?.map((word) => (
          <div className="path-entry path-entry--start flex gap-xs items-center text-center">
            {word.split("").map((letter, letterIndex) => (
              <LetterBox
                letter={letter}
                correctLetter={
                  letter.toUpperCase() ===
                  endWord.split("")[letterIndex].toUpperCase()
                }
              />
            ))}{" "}
          </div>
        ))}
        {children}
        <div className="path-entry path-entry--last flex gap-xs items-center text-center">
          {endWord.split("").map((letter, index) => (
            <LetterBox
              key={`${letter}-${index}`}
              letter={letter}
              correctLetter={
                path && path.length > 0
                  ? path[path.length - 1].split("")[index].toUpperCase() ===
                      letter.toUpperCase() || finished
                  : false
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const LetterBox: FC<{
  letter: string;
  correctLetter: boolean;
}> = ({ letter, correctLetter }) => {
  return (
    <span
      className={`path-entry__letter border radius-md padding-xs ${
        correctLetter ? "CorrectLetter" : ""
      }`}
    >
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
