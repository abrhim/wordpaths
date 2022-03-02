import { FC, useState, useEffect, useRef, ElementRef, LegacyRef } from "react";
import "../../styles/global.css";

const nextLetterIdBase = "NextLetterId-";

type NextWordInputProps = {
  onChange: (word: string) => void;
  hidden: boolean;
  invalid: boolean;
  reset: any;
  placeHolder: string;
};

const initState = ["", "", "", ""];
export const NextWordInput: FC<NextWordInputProps> = ({
  onChange,
  hidden,
  invalid,
  reset,
  placeHolder,
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
    setNextWord((previousWord) => {
      const nextWordTemp = [...previousWord];
      nextWordTemp[index] = char;
      return nextWordTemp;
    });
  };

  useEffect(() => {
    onChange(nextWord.join(""));
  }, [nextWord]);
  useEffect(() => {
    setFocusToNextCharacter(-1);
  }, [reset]);

  if (hidden) return null;
  return (
    <div className="path-entry path-entry--active flex gap-xs items-center text-center">
      {nextWord.map((char, index) => (
        <NextLetterInput
          key={index}
          hidden={hidden}
          invalid={invalid}
          placeHolder={placeHolder}
          onChange={(changedChar) => {
            wordChange({ index, char: changedChar });
          }}
          setFocusToNextCharacter={() => {
            setFocusToNextCharacter(index);
          }}
          index={index}
          id={`${nextLetterIdBase}${index}`}
        />
      ))}
    </div>
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
  placeHolder: string;
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
  placeHolder,
}) => {
  const [char, setChar] = useState<string>("");
  const onCharChange = (value: string) => {
    setChar(value);
    onChange(value);
  };
  useEffect(() => {
    onCharChange("");
    // console.log(placeHolder);
  }, [placeHolder]);
  useEffect(() => {
    // console.log(char);
  }, [char]);
  return (
    <input
      value={char}
      autoFocus={index === 0}
      id={id}
      placeholder={placeHolder.split("")[index]}
      hidden={hidden}
      className="path-entry__letter path-entry__letter--input border radius-md padding-xs"
      type="text"
      maxLength={1}
      onKeyDown={(e) => {
        if (char && letters.includes(e.key)) {
          onCharChange(e.key);
        } else if (char && (e.key === "Backspace" || e.key === "Delete")) {
          onCharChange("");
        }
      }}
      onChange={(e) => {
        if (letters.includes(e.target.value)) {
          onCharChange(e.target.value);
          setFocusToNextCharacter();
        }
      }}
    />
  );
};
