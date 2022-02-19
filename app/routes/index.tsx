import { FC, useEffect, useRef, useState } from "react";
import {
  ActionFunction,
  useActionData,
  Form,
  useTransition,
  useLoaderData,
  Meta,
  Links,
  Scripts,
} from "remix";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faArrowRight,
  faForwardStep,
  faRotateRight,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";

import { evaluateGameState, getDailyChallenge } from "~/utils/utils";
import type { GameState } from "~/utils/utils";
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

export const ErrorBoundary = ({ error }) => {
  console.error(error);
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        {error}
        <Scripts />
      </body>
    </html>
  );
};

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
      <header>
        <div className="container text-center">
          <h2 className="title">Wordpaths</h2>
        </div>
      </header>
      <main>
        <div className="container max-width-sm padding-y-md">
          <ChallengeOfTheDay
            startWord={startWord}
            endWord={endWord}
            shortestPathLength={shortestPath}
            currentPathLength={path.length}
          />

          <Form method="post" style={{ border: "none" }}>
            <fieldset
              style={{ border: "none" }}
              disabled={transition.state === "submitting"}
            >
              <PathTable
                path={path}
                startWord={startWord}
                endWord={endWord}
                finished={finished}
              >
                <NextWordInput
                  hidden={finished}
                  invalid={actionData?.errors?.nextWord}
                  onChange={onNextWordChange}
                  reset={actionData}
                  placeHolder={
                    path.length > 0 ? path[path.length - 1] : startWord
                  }
                />
              </PathTable>
              <ValidationMessage
                error={actionData?.error}
                isSubmitting={transition.state === "submitting"}
              />
              <input
                type="hidden"
                value={JSON.stringify(gamestate)}
                name="gamestate"
              />
              <input type="hidden" value={nextWord} name="nextWord" />

              <h3 hidden={!finished}>Finished!</h3>

              <div className="container max-width-md padding-y-sm margin-top-sm">
                {finished ? null : (
                  <button
                    className="btn btn--primary col-2 offset-4"
                    type="submit"
                    hidden={finished}
                  >
                    {transition.state === "submitting"
                      ? "Submitting... "
                      : "Submit"}
                    <FontAwesomeIcon
                      className="text-sm margin-left-xxs"
                      icon={faForwardStep}
                    />
                  </button>
                )}
                <button
                  type="button"
                  className="btn col-2"
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  Reset
                  <FontAwesomeIcon
                    className="text-sm margin-left-xxs"
                    icon={faRotateLeft}
                  />
                </button>
              </div>
            </fieldset>
          </Form>
        </div>

        <div className="container max-width-sm padding-y-sm margin-top-sm">
          <div className="text-component">
            <h3 className="component__title">Instructions: </h3>
            <p>Welcome to Word Paths 👋</p>
            <p>
              The goal of the game is to find a path from the starting word to
              the ending word. All words in the path must be 4 letters long, a
              word in the scrabble dictionary, not the previous word, and only
              be one letter different than the previous word.
            </p>
            <p>
              If the starting word is <code>DONE</code> and the ending word is{" "}
              <code>CONS</code>, a valid path would be <code>DONE</code> -{">"}{" "}
              <code>CONE</code> -{">"} <code>CONS</code>.{" "}
            </p>

            <p>Come back every day for a new challenge 😀 </p>
          </div>
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
        wordBreak: "break-word",
        margin: "20px",
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
  <>
    <header className="path-details text-center">
      <h2 className="text-base">Today's Challenge</h2>
      <div className="inline-block margin-y-xs padding-xs bg-contrast-lower bg-opacity-40% radius-md text-xl text-uppercase font-bold letter-spacing-lg">
        <span className="color-accent">{startWord.toUpperCase()}</span>
        <button
          style={{ borderStyle: "none", background: "none", color: "black" }}
          type="button"
        >
          <FontAwesomeIcon
            icon={faArrowRight}
            className="text-xl margin-left-xxs margin-right-xxs"
          />
        </button>
        <span className="color-accent">{endWord.toUpperCase()}</span>
      </div>
    </header>
    <footer className="path-progress flex flex-row flex-center gap-md text-sm">
      <p>
        Shortest Path: <b className="text-bold">{shortestPathLength}</b>
      </p>
      <p>
        Your Path:{" "}
        <b className="text-bold">{currentPathLength ? currentPathLength : 0}</b>
      </p>
    </footer>
  </>
);
