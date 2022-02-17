import { FC, useEffect, useRef, useState } from "react";
import {
  ActionFunction,
  useActionData,
  Form,
  useTransition,
  useLoaderData,
} from "remix";

import { evaluateGameState, getDailyChallenge } from "~/utils/utils";
import type { GameState } from "~/utils/utils";
import { Header } from "~/components/Header";
import { PathTable } from "~/components/PathTable";
import { NextWordInput } from "~/components/NextWordInput";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const nextWord: string = formData.get("nextWord") as string;
  const gamestate: GameState = JSON.parse(
    formData.get("gamestate") as string
  ) as GameState;

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
  const [nextWord, setNextWord] = useState<string>("");
  const transition = useTransition();
  const initialData = useLoaderData();
  const actionData = useActionData();
  const [gamestate, setGamestate] = useState<GameState>({
    ...initialData,
    path: [],
  });
  const [finished, setFinished] = useState<boolean>(false);

  useEffect(() => {
    if (actionData?.valid) {
      if (actionData.finished) setFinished(true);
      try {
        setGamestate((gamestate: GameState) => ({
          ...gamestate,
          path: actionData.path,
        }));
      } catch (e) {
        console.log(e);
      }
    }
  }, [actionData]);

  const onNextWordChange = (word: string) => {
    setNextWord(word);
  };

  if (initialData.error) {
    return (
      <div>
        {" "}
        <h2>{initialData.error}</h2>
      </div>
    );
  }

  const { endWord, startWord, shortestPath, path } = gamestate;
  return (
    <div className="">
      <nav>
        <Header />
      </nav>
      <main>
        <ChallengeOfTheDay
          startWord={startWord}
          endWord={endWord}
          shortestPathLength={shortestPath}
          currentPathLength={path.length}
        />
        <PathTable
          path={finished ? path.concat(endWord.toUpperCase()) : path}
          startWord={startWord}
        />

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
            <input type="hidden" value={nextWord} name="nextWord" />

            <h3 hidden={!finished}>Finished!</h3>
            <NextWordInput
              hidden={finished}
              invalid={actionData?.errors?.nextWord}
              onChange={onNextWordChange}
              reset={actionData}
            />
            <br />

            <br />

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
                window.location.reload();
              }}
            >
              Reset
            </button>
          </fieldset>
        </Form>
        <div>
          <h3>Instructions: </h3>
          <p>Welcome to Word Paths 👋</p>
          <p>
            The goal of the game is to find a path from the starting word to the
            ending word. All words in the path must be 4 letters long, a word in
            the scrabble dictionary, not the previous word, and only be one
            letter different than the previous word.
          </p>
          <p>
            If the starting word is <code>DONE</code> and the ending word is{" "}
            <code>CONS</code>, a valid path would be <code>DONE</code> -{">"}{" "}
            <code>CONE</code> -{">"} <code>CONS</code>.{" "}
          </p>

          <p>Come back every day for a new challenge 😀 </p>
        </div>
      </main>
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

const ChallengeOfTheDay: FC<{
  startWord: string;
  endWord: string;
  shortestPathLength: number;
  currentPathLength: number;
}> = ({ startWord, endWord, shortestPathLength, currentPathLength }) => (
  <div className="ChallengeOfTheDay">
    <table>
      <tbody>
        <tr>
          {startWord
            .toUpperCase()
            .split("")
            .map((letter: string) => (
              <td key={Math.random()}>
                <span className={"LetterBox"}>{letter}</span>
              </td>
            ))}
          <td>
            <span>➡️</span>
          </td>
          {endWord
            .toUpperCase()
            .split("")
            .map((letter: string) => (
              <td key={Math.random()}>
                {" "}
                <span className={"LetterBox"}>{letter}</span>
              </td>
            ))}
        </tr>
        <tr>
          <td colSpan={5}>
            {shortestPathLength ? (
              <h3>shortest path: {shortestPathLength} </h3>
            ) : null}
          </td>
          <td colSpan={5}>
            <h3>your path: {currentPathLength ? currentPathLength : 0}</h3>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);
