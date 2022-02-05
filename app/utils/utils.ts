import wordsWith4letters from "./wordsWith4Letters.json";

export type GameStateResponse = GameState & {
  error?: string;
  valid: boolean;
  finished?: boolean;
};

export type GameState = {
  nextWord: string;
  path: string[];
  startWord: string;
  endWord: string;
};
export const evaluateGameState = (gamestate: GameState): GameStateResponse => {
  const { nextWord, path, startWord, endWord } = gamestate;

  const { valid, error } = isNextWordValid({
    nextWord,
    previousWord: path.length === 0 ? startWord : path[path.length - 1],
  });

  if (!valid) {
    return { ...gamestate, error, valid };
  }

  //   send data tracking to firestore here - collect data on which word it is,
  //  start word, etc etc to provide data insights to the community in aggregate perhaps?

  //   evaluate if it is the Seal word or not.

  path.push(nextWord);

  //   did they win?
  if (nextWord === endWord) {
    return {
      ...gamestate,
      valid,
      path,
      finished: true,
    };
  }

  // if not, push to top, and return path.

  return {
    ...gamestate,
    nextWord,
    path,
    valid,
  };
};

export const isWordValidInDictionary = (word: string) => {
  const isValid = wordsWith4letters[word.toUpperCase()];
  return !!isValid;
};

const areTwoWordsOneLetterApart = (word1: string, word2: string): boolean => {
  console.log(word1, word2);
  const word1Array: string[] = word1.toLowerCase().split("");
  const word2Array: string[] = word2.toLowerCase().split("");
  let numOfLettersDifferentFromEachOther = 0;
  word1Array.forEach((character: string, index: number) => {
    if (character.charCodeAt(0) - word2Array[index].charCodeAt(0) !== 0) {
      numOfLettersDifferentFromEachOther += 1;
    }
  });
  return numOfLettersDifferentFromEachOther === 1 ? true : false;
};

const isNextWordValid = ({
  nextWord,
  previousWord,
}: {
  nextWord: string;
  previousWord: string;
}): { valid: boolean; error?: string } => {
  // is the word 4 letters long?
  if (nextWord.length !== 4) {
    return {
      error: `${nextWord} should be a word that is 4 letters long. Instead it is ${nextWord.length}`,
      valid: false,
    };
  }

  // is next word in the dictionary?
  if (!isWordValidInDictionary(nextWord)) {
    return {
      error: `${nextWord} isn't in the dictionary`,
      valid: false,
    };
  }

  // is next word the same as the top word?
  if (previousWord === nextWord) {
    return {
      error: `Submitted word is the same as the previous word.`,
      valid: false,
    };
  }

  //   is the word only 1 letter different than the previous word?
  if (!areTwoWordsOneLetterApart(nextWord, previousWord)) {
    return {
      error: `${nextWord} and ${previousWord} are not 1 letter different from each other.`,
      valid: false,
    };
  }

  return { valid: true };
};
