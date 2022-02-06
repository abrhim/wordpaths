import wordsWith4letters from "./wordsWith4Letters.json";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { doc, getDoc, getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATKCcQH3Ac9jHMrjGXCnQJJIJ4te6YGAU",
  authDomain: "wordpaths-6a715.firebaseapp.com",
  projectId: "wordpaths-6a715",
  storageBucket: "wordpaths-6a715.appspot.com",
  messagingSenderId: "111041994511",
  appId: "1:111041994511:web:d8d8811a56beceb73e287a",
  measurementId: "G-5HK60E5E8B",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

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
  const word1Array: string[] = word1.toUpperCase().split("");
  const word2Array: string[] = word2.toUpperCase().split("");
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

export const getDailyChallenge = async (): Promise<
  { startWord: string; endWord: string } | { error: string }
> => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();

  const todaysDate = mm + "-" + dd + "-" + yyyy;
  const docRef = doc(firestore, "daily-challenges", todaysDate);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const { startWord, endWord } = docSnap.data();
    return { startWord, endWord };
  } else {
    return { error: "Error accessing today's challenge." };
  }
};
