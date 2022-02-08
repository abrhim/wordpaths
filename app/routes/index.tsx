import { useEffect, useState } from "react";
import {
  ActionFunction,
  useActionData,
  Form,
  useTransition,
  useLoaderData,
} from "remix";
import {
  addNextWord,
  clearGame,
  setLocalStorageGamestate,
} from "~/utils/localStorage";
import { evaluateGameState, getDailyChallenge } from "~/utils/utils";
import type { GameState } from "~/utils/utils";
// Note the "action" export name, this will handle our form POST
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  console.log(formData);
  const nextWord: string = formData.get("nextWord") as string;
  const gamestate: GameState = JSON.parse(
    formData.get("gamestate") as string
  ) as GameState;
  // const startWord: string = formData.get("startWord") as string;
  // const endWord: string = formData.get("endWord") as string;
  // const path: string[] | undefined = formData
  //   .get("path")
  //   ?.toString()
  //   .split(",");
  //   const shortestPath = formData.get("")

  return evaluateGameState({
    ...gamestate,
    endWord: gamestate.endWord.toUpperCase(),
    startWord: gamestate.startWord.toUpperCase(),
    nextWord: nextWord.toUpperCase(),
  });
};

export const loader = async () => {
  return await getDailyChallenge();
};

export const unstable_shouldReload = () => false;

export default function Index() {
  // when the form is being processed on the server, this returns different
  // transition states to help us build pending and optimistic UI.
  const transition = useTransition();
  const initialData = useLoaderData();
  const actionData = useActionData();
  const [gamestate, setGamestate] = useState<GameState>({
    ...initialData,
    path: [],
  });
  // const [path, setPath] = useState<string[]>([]);
  // const [endWord, setEndWord] = useState<string>("");
  // const [startWord, setStartWord] = useState<string>("");
  const [finished, setFinished] = useState<boolean>(false);

  useEffect(() => {
    if (actionData?.valid) {
      if (actionData.finished) setFinished(true);
      try {
        const pathsFromLocalStorage = addNextWord(
          actionData.nextWord.toUpperCase()
        );
        setGamestate((gamestate: GameState) => ({
          ...gamestate,
          path: pathsFromLocalStorage,
        }));
      } catch (e) {
        console.log(e);
      }
    }
  }, [actionData]);

  const initializeGame = (): void => {
    //   set starting and ending words
    clearGame();
    if (initialData.startWord && initialData.endWord) {
      const startWord = initialData.startWord.toUpperCase() as string;
      const endWord = initialData.endWord.toUpperCase() as string;
      setLocalStorageGamestate({ endWord, startWord, path: [] });
    }
  };

  useEffect(() => {
    initializeGame();
  }, []);

  if (initialData.error) {
    return (
      <div>
        {" "}
        <h2>{initialData.error}</h2>
      </div>
    );
  }

  const { endWord, startWord, shortestPath, path } = gamestate;
  console.log(gamestate);

  return (
    <div>
      <div>
        <div>
          <h3 style={{ display: "inline" }}>
            start: {startWord.toUpperCase()}
          </h3>
          <h3>end: {endWord.toUpperCase()}</h3>
          <h3>shortest submitted path: {shortestPath}</h3>
        </div>
        {path && path.length > 0
          ? path.map((word) =>
              word.toLowerCase() !== endWord.toLowerCase() ? (
                <div key={Math.random()}>{word}</div>
              ) : null
            )
          : null}

        {actionData?.finished ? (
          <div>Path length: {path.length - 1}</div>
        ) : null}

        <Form method="post" style={{ border: "none" }}>
          <fieldset
            style={{ border: "none" }}
            disabled={transition.state === "submitting"}
          >
            <input
              type="hidden"
              value={JSON.stringify(gamestate)}
              name="gamestate"
            />
            <h3 hidden={!finished}>Finished!</h3>
            <input
              hidden={finished}
              name="nextWord"
              type="text"
              style={{
                borderColor: actionData?.errors?.nextWord ? "red" : "",
                textTransform: "uppercase",
              }}
              maxLength={4}
            />
            <button type="submit" hidden={finished}>
              {transition.state === "submitting" ? "Submitting..." : "Submit"}
            </button>
            <ValidationMessage
              error={actionData?.error}
              isSubmitting={transition.state === "submitting"}
            />
            <br />
            <button
              type="button"
              onClick={() => {
                localStorage.setItem("wordpaths", "");
                window.location.reload();
              }}
            >
              Reset
            </button>
          </fieldset>
        </Form>
      </div>
      <div>
        <h3>Instructions: </h3>
        <p>Welcome to Word Paths 👋</p>
        <p>
          The goal of the game is to find a path from the starting word to the
          ending word. All words in the path must be 4 letters long, a word in
          the scrabble dictionary, not the previous word, and only be one letter
          different than the previous word.
        </p>
        <p>
          If the starting word is <code>DONE</code> and the ending word is{" "}
          <code>CONS</code>, a valid path would be <code>DONE</code> -{">"}{" "}
          <code>CONE</code> -{">"} <code>CONS</code>.{" "}
        </p>

        <p>Come back every day for a new challenge 😀 </p>
      </div>
    </div>
  );
}

function ValidationMessage({
  error,
  isSubmitting,
}: {
  error: string;
  isSubmitting: boolean;
}) {
  const [show, setShow] = useState(!!error);

  useEffect(() => {
    const id = setTimeout(() => {
      const hasError = !!error;
      setShow(hasError && !isSubmitting);
    });
    return () => clearTimeout(id);
  }, [error, isSubmitting]);

  return (
    <div
      style={{
        opacity: show ? 1 : 0,
        height: show ? "1em" : 0,
        color: "red",
        transition: "all 300ms ease-in-out",
      }}
    >
      {error}
    </div>
  );
}
