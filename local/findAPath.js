// const wordsWith4Letters = require("../app/utils/wordsWith4Letters.json");
const wordsWith4LettersWithLettersSiblings = require("/Users/abram/Code/sideprojects/word-paths/local/wordsWith4LettersSiblings.json");
const wordsWithShortestPaths = require("/Users/abram/Code/sideprojects/word-paths/local/wordsWithShortestPaths.json");
const fs = require("fs");

// import { initializeApp } from "firebase/app";
const { initializeApp } = require("firebase/app");
// console.log(apps);
// import { doc, getFirestore, setDoc } from "firebase/firestore";
const {
  doc,
  getFirestore,
  setDoc,
  collection,
  query,
  getDocs,
} = require("firebase/firestore");
// console.log(fs);
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

const areTwoWordsOneLetterApart = (word1, word2) => {
  const word1Array = word1.toUpperCase().split("");
  const word2Array = word2.toUpperCase().split("");
  let numOfLettersDifferentFromEachOther = 0;
  word1Array.forEach((character, index) => {
    if (character.charCodeAt(0) - word2Array[index].charCodeAt(0) !== 0) {
      numOfLettersDifferentFromEachOther += 1;
    }
  });
  return numOfLettersDifferentFromEachOther === 1 ? true : false;
};

const findAllWords1letterApart = (word) => {
  const words = Object.keys(wordsWith4Letters);
  return words.filter((fourLetterWord) =>
    areTwoWordsOneLetterApart(word, fourLetterWord)
  );
};

const calculateEachWordsSiblings = () => {
  const myWords = { ...wordsWith4Letters };
  let words = Object.keys(myWords);
  // calculate siblings for each word O(n^2)
  words.forEach((word) => {
    myWords[word] = {
      ...myWords[word],
      siblings: findAllWords1letterApart(word),
    };
  });

  fs.writeFile(
    "./wordsWith4LettersSiblings.json",
    JSON.stringify(myWords),
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
      //file written successfully
    }
  );
};

// Djikstra's Algorithm
const findShortestPath = (graph, startNode) => {
  const nodes = Object.keys(graph);
  const startNodeDistanceMap = initializeStartNodeDistanceMap(nodes, startNode);
  while (nodes.length > 0) {
    nodes.sort((node1, node2) => {
      return (
        startNodeDistanceMap[node2].distance -
        startNodeDistanceMap[node1].distance
      );
    });
    const nodeWithShortestPath = nodes.pop();
    const currentDistance =
      startNodeDistanceMap[nodeWithShortestPath].distance + 1;
    const currentPath = [
      ...startNodeDistanceMap[nodeWithShortestPath].path,
      nodeWithShortestPath,
    ];

    graph[nodeWithShortestPath].siblings?.forEach((sibling) => {
      if (startNodeDistanceMap[sibling].distance > currentDistance) {
        startNodeDistanceMap[sibling].distance = currentDistance;
        startNodeDistanceMap[sibling].path = currentPath;
      }
    });
  }

  return startNodeDistanceMap;
};

const initializeStartNodeDistanceMap = (nodes, startNode) => {
  const map = {};
  nodes.forEach(
    (node) =>
      (map[node] =
        node !== startNode
          ? { distance: Infinity, path: "" }
          : { distance: 0, path: "" })
  );
  return map;
};

const findShortestPathForEachWord = async () => {
  // loop thru each word and find it's shortest paths for everything.

  const dictionary = wordsWith4LettersWithLettersSiblings;
  const words = Object.keys(dictionary);
  const limit = 10;
  let index = 0;

  for (let i = 0; i < words.length - 1; i++) {
    const word = words[i];

    if (
      dictionary[word].siblings.length > 0 &&
      !dictionary[word].writtenToFirestore
    ) {
      const shortestPaths = findShortestPath(dictionary, word);
      const paths = Object.keys(shortestPaths);
      // loop thru each path and remove all paths taht don't have a valid distance.
      paths.forEach((path) => {
        if (
          shortestPaths[path].distance === Infinity ||
          shortestPaths[path].distance === 0
        ) {
          if (wordsWith4LettersWithLettersSiblings[path].siblings.length > 0)
            console.log(
              path,
              shortestPaths[path].distance,
              wordsWith4LettersWithLettersSiblings[path].siblings
            );

          delete shortestPaths[path];
        }
        // else {
        //   shortestPaths[path].path = JSON.stringify(shortestPaths[path].path);
        // }
      });
      console.log(Object.keys(shortestPaths).length);

      const value = {
        ...dictionary[word],
        shortestPaths,
      };

      if (index === limit) {
        break;
      }

      // await writeToFirestore(word, value);
      index++;
      dictionary[word] = { ...dictionary[word], writtenToFirestore: true };
      // fs.writeFile(
      //   "/Users/abram/Code/sideprojects/word-paths/local/wordsWith4LettersSiblings.json",
      //   JSON.stringify(dictionary),
      //   (err) => (err ? console.error(err) : null)
      // );
    } else {
      console.log(word, " - skipped");
    }
  }

  // fs.writeFile(
  //   "/Users/abram/Code/sideprojects/word-paths/local/wordsWithShortestPaths.json",
  //   JSON.stringify(wordsWithShortestPaths),
  //   (err) => {
  //     if (err) {
  //       console.error(err);
  //       return;
  //     }
  //     console.log("success");
  //   }
  // );
};

// findShortestPathForEachWord();

const collectionName = "scrabble-dictionary";

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

const writeToFirestore = async (word, value) => {
  console.log(word);
  setDoc(doc(firestore, collectionName, word), value);
};

// findShortestPathForEachWord();
const luck = findShortestPath(
  wordsWith4LettersWithLettersSiblings,
  "luck".toUpperCase()
);
console.log(luck.CROW);

const countNum = async () => {
  const collectionQuery = query(collection(firestore, collectionName));
  const qSnap = await getDocs(collectionQuery);
  console.log(qSnap.size);
  // const snapshot = await query.get();
  // const count = snapshot.size;
  // console.log(count);
};
// countNum();
