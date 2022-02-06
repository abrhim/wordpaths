import { useEffect, useState } from "react";
import {
  ActionFunction,
  useActionData,
  Form,
  useTransition,
  useLoaderData,
} from "remix";
import { addNextWord, getGameState, setTerminus } from "~/utils/localStorage";
import { evaluateGameState, getDailyChallenge } from "~/utils/utils";

// Note the "action" export name, this will handle our form POST
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const nextWord: string = formData.get("nextWord") as string;
  const startWord: string = formData.get("startWord") as string;
  const endWord: string = formData.get("endWord") as string;
  const path: string[] | undefined = formData
    .get("path")
    ?.toString()
    .split(",");
  console.log(formData);
  return evaluateGameState({
    nextWord: nextWord.toUpperCase(),
    endWord: endWord.toUpperCase(),
    startWord: startWord.toUpperCase(),
    path: path ? path : [],
  });
};

export const loader = async () => {
  return await getDailyChallenge();
};

export default function Daily() {
  // when the form is being processed on the server, this returns different
  // transition states to help us build pending and optimistic UI.
  const transition = useTransition();
  const initialData = useLoaderData();
  const actionData = useActionData();
  const [path, setPath] = useState<string[]>([]);
  const [endWord, setEndWord] = useState<string>("");
  const [startWord, setStartWord] = useState<string>("");
  const [finished, setFinished] = useState<boolean>(false);

  useEffect(() => {
    if (actionData?.valid) {
      if (actionData.finished) setFinished(true);
      try {
        const pathsFromLocalStorage = addNextWord(
          actionData.nextWord.toUpperCase()
        );
        setPath(pathsFromLocalStorage);
      } catch (e) {
        console.log(e);
      }
    }
  }, [actionData]);

  const initializeGame = (): void => {
    //   set starting and ending words
    if (initialData.startWord && initialData.endWord) {
      const startWord = initialData.startWord.toUpperCase();
      const endWord = initialData.endWord.toUpperCase();
      setTerminus(startWord, endWord);
    }
  };

  useEffect(() => {
    initializeGame();
    const gamestate = getGameState();
    setPath(gamestate.path);
    setEndWord(gamestate.endWord);
    setStartWord(gamestate.startWord);
    if (
      gamestate.path &&
      gamestate.path[gamestate.path.length - 1] === gamestate.endWord
    ) {
      setFinished(true);
    }
  }, []);

  if (initialData.error) {
    return (
      <div>
        {" "}
        <h2>{initialData.error}</h2>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h3 style={{ display: "inline" }}>
          {startWord} -{">"} {endWord}
        </h3>
      </div>
      {path
        ? path.length > 0
          ? path.map((word) => <div key={Math.random()}>{word}</div>)
          : null
        : null}

      <Form method="post" style={{ border: "none" }}>
        <fieldset
          style={{ border: "none" }}
          disabled={transition.state === "submitting"}
        >
          <input type="hidden" value={path} name="path" />
          <input type="hidden" value={startWord} name="startWord" />
          <input type="hidden" value={endWord} name="endWord" />
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
  );
}

function ValidationMessage({ error, isSubmitting }) {
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
