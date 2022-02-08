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

console.log("origin");
console.log("ants", findAllWords1letterApart("ants"));
console.log("step 2");
console.log("ants -> anus", findAllWords1letterApart("anus"));
console.log("step 3");
console.log("ants -> anus -> onus", findAllWords1letterApart("onus"));
console.log("ants -> anus -> ands", findAllWords1letterApart("ands"));
console.log("step 4");
console.log("ants -> anus -> onus -> opus", findAllWords1letterApart("opus"));
console.log("ants -> anus -> ands -> aids", findAllWords1letterApart("aids"));
console.log("step 5");
console.log(
  "ants -> anus -> ands -> aids -> bids",
  findAllWords1letterApart("bids")
);

console.log("step 6");
console.log(
  "ants -> anus -> ands -> aids -> bins",
  findAllWords1letterApart("bins")
);

console.log("step 7");
console.log(
  "ants -> anus -> ands -> aids -> buds -> bads",
  findAllWords1letterApart("buds")
);
console.log(
  "ants -> anus -> ands -> aids -> bins -> bans",
  findAllWords1letterApart("bins")
);

console.log("step 7");
console.log(
  "ants -> anus -> ands -> aids -> bins -> bans",
  findAllWords1letterApart("bans")
);

console.log("step 8");
console.log(
  "ants -> anus -> ands -> aids -> bins -> bans",
  findAllWords1letterApart("bank")
);

console.log("step 9");
console.log(
  "ants -> anus -> ands -> aids -> bins -> bans",
  findAllWords1letterApart("back")
);

console.log("step 10");

console.log(
  "ants -> anus -> ands -> aids -> bids -> bins -> bans -> bank -> back -> buck",
  findAllWords1letterApart("back")
);
