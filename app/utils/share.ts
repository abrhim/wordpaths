export const copyShareString = (
  path: string[],
  endWord: string,
  startWord: string
) => {
  const text = generateShareString(path, endWord, startWord);
  setClipboard(text);
};

const setClipboard = (text: string): void => {
  var type = "text/plain";
  var blob = new Blob([text], { type });
  var data = [new ClipboardItem({ [type]: blob })];

  navigator.clipboard.write(data).then(
    function () {
      console.log("worked!");
    },
    function () {
      console.log("didnt work :(");
    }
  );
};

const generateShareString = (
  path: string[],
  endWord: string,
  startWord: string
): string => {
  const correct = "🟩";
  const incorrect = "⬜";
  const splitEndWord = endWord.split("");
  const currentUrl = "https://wordpaths.app";

  return (
    `${startWord.toUpperCase()}➡️${endWord.toUpperCase()}\n` +
    path
      .map((word) =>
        word
          .split("")
          .map((letter, index) =>
            letter.toLocaleUpperCase() === splitEndWord[index].toUpperCase()
              ? correct
              : incorrect
          )
          .join("")
      )
      .join("\n") +
    `\n${currentUrl}`
  );
};
