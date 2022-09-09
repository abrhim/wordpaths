import { FC, useState, useEffect } from "react";
import "../../styles/global.css";

const nextLetterIdBase = "NextLetterId-";

type NextWordInputProps = {
  onChange: (word: string) => void;
  hidden: boolean;
  invalid: boolean;
  reset: any;
  placeholder: string;
};

export const NextWordInput: FC<NextWordInputProps> = ({
  onChange,
  hidden,
  invalid,
  reset,
  placeholder,
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
          placeholder={placeholder.split("")[index]}
          onChange={(changedChar) => {
            wordChange({ index, char: changedChar });
          }}
          setFocusToNextCharacter={() => {
            setFocusToNextCharacter(index);
          }}
          setFocusToPreviousCharacter={() => {
            setFocusToNextCharacter(index - 2);
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
  placeholder: string;
  onChange: (character: string) => void;
  setFocusToNextCharacter: () => void;
  setFocusToPreviousCharacter: () => void;
};

const NextLetterInput: FC<NextLetterInputProps> = ({
  hidden,
  onChange,
  setFocusToNextCharacter,
  setFocusToPreviousCharacter,
  index,
  id,
  placeholder,
}) => {
  const [char, setChar] = useState<string>(placeholder);

  const onCharChange = (value: string) => {
    setChar(value);
    onChange(value);
  };

  return (
    <input
      value={char}
      onFocus={() => onCharChange("")}
      autoFocus={index === 0}
      id={id}
      placeholder={placeholder}
      hidden={hidden}
      className="path-entry__letter path-entry__letter--input border radius-md padding-xs"
      type="text"
      maxLength={1}
      onBlur={(e) => {
        if (!char) onCharChange(placeholder);
      }}
      onKeyDown={(e) => {
        if (char && letters.includes(e.key)) {
          onCharChange(e.key);
        }
        if (char && (e.key === "Backspace" || e.key === "Delete")) {
          onCharChange("");
        }
        if (e.key === "ArrowRight") {
          setFocusToNextCharacter();
        }
        if (e.key === "ArrowLeft") {
          setFocusToPreviousCharacter();
        }
      }}
      onChange={(e) => {
        if (letters.includes(e.target.value)) {
          onCharChange(e.target.value);
        }
      }}
    />
  );
};
