import { GameState } from "./utils";

export const getGameState = (): { path: string[] } => {
  const gamestate = localStorage.getItem("wordpaths");
  if (!gamestate) return { ...{ path: [] } };
  else return JSON.parse(gamestate);
};

export const addNextWord = (nextWord: string): string[] => {
  const gamestate = getGameState();
  const path: string[] = [...gamestate.path];
  path.push(nextWord);
  localStorage.setItem("wordpaths", JSON.stringify({ ...gamestate, path }));
  return path;
};

export const setTerminus = (startWord: string, endWord: string): void => {
  const gamestate = getGameState();
  localStorage.setItem(
    "wordpaths",
    JSON.stringify({
      ...gamestate,
      startWord,
      endWord,
    })
  );
};

export const clearGame = () => {
  localStorage.setItem("wordpaths", JSON.stringify({}));
};
