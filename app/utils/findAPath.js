const wordsWith4Letters = require("./wordsWith4Letters.json");

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
  let words = Object.keys(wordsWith4Letters);
  words = words.map((word) => ({
    word,
    siblings: findAllWords1letterApart(word),
  }));
  words.sort((a, b) => a.siblings.length - b.siblings.length);
  console.log(words.length);
  words = words.filter((word) => word.siblings.length !== 0);
  console.log(words.length);
  console.log(words[0], words[words.length - 1]);
};

const startWord = "bads";
const ends = "good";
console.log(startWord, findAllWords1letterApart(startWord));
console.log(ends, findAllWords1letterApart(ends));

// console.log("ants", findAllWords1letterApart("ants"));

// console.log("origin");
// const word = "loop";
// console.log(
//   word,
//   findAllWords1letterApart(word),
//   findAllWords1letterApart(word).length
// );

// loop thru all words, rate it's commonality and number of siblings, and number of common siblings.
// how d
