import { FC, useState, useEffect, useRef, ElementRef, LegacyRef } from "react";
import "../../styles/global.css";

const nextLetterIdBase = "NextLetterId-";

type NextWordInputProps = {
  onChange: (word: string) => void;
  hidden: boolean;
  invalid: boolean;
  reset: any;
};

export const NextWordInput: FC<NextWordInputProps> = ({
  onChange,
  hidden,
  invalid,
  reset,
}) => {
  const [nextWord, setNextWord] = useState<string[]>(["", "", "", ""]);

  const setFocusToNextCharacter = (index: number) => {
    const nextChar = document.getElementById(`${nextLetterIdBase}${index + 1}`);
    nextChar?.focus();
  };

  const wordChange = ({
    index,
    char,
  }: {
    index: number;
    char: string;
  }): void => {
    const nextWordTemp = [...nextWord];
    nextWordTemp[index] = char;
    setNextWord(nextWordTemp);
  };

  useEffect(() => onChange(nextWord.join("")), [nextWord]);
  useEffect(() => {
    setFocusToNextCharacter(-1);
  }, [reset]);

  if (hidden) return null;
  return (
    <>
      <tr>
        {nextWord.map((char, index) => (
          <td key={index}>
            <NextLetterInput
              hidden={hidden}
              invalid={invalid}
              onChange={(changedChar) => {
                wordChange({ index, char: changedChar });
              }}
              setFocusToNextCharacter={() => {
                setFocusToNextCharacter(index);
              }}
              index={index}
              id={`${nextLetterIdBase}${index}`}
            />
          </td>
        ))}
      </tr>
    </>
  );
};

const letters = (() => {
  const caps = [...Array(26)].map((val, i) => String.fromCharCode(i + 65));
  return caps.concat(caps.map((letter) => letter.toLowerCase()));
})();

type NextLetterInputProps = {
  hidden: boolean;
  invalid: boolean;
  index: number;
  id: string;
  onChange: (character: string) => void;
  setFocusToNextCharacter: () => void;
};

const NextLetterInput: FC<NextLetterInputProps> = ({
  hidden,
  invalid,
  onChange,
  setFocusToNextCharacter,
  index,
  id,
}) => {
  const [char, setChar] = useState<string>("");

  return (
    <input
      value={char}
      autoFocus={index === 0}
      id={id}
      hidden={hidden}
      className="LetterBox"
      type="text"
      style={{
        borderColor: invalid ? "red" : "",
        textTransform: "uppercase",
      }}
      maxLength={1}
      onKeyDown={(e) => {
        if (char && letters.includes(e.key)) {
          setChar(e.key);
          onChange(e.key);
        } else if (char && (e.key === "Backspace" || e.key === "Delete")) {
          setChar("");
          onChange("");
        }
      }}
      onChange={(e) => {
        if (letters.includes(e.target.value)) {
          setChar(e.target.value);
          onChange(e.target.value);
          setFocusToNextCharacter();
        }
      }}
    />
  );
};
