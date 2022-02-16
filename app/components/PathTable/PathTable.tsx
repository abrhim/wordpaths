import type { FC } from "react";
import "../../styles/global.css";
type Path = string[];

export const PathTable: FC<{ path: Path }> = ({ path }) => {
  if (!path || !path.length) return null;
  return (
    <div className="PathTable">
      <table>
        <tbody>
          {path.map((word) => {
            const letters = word.split("");
            return (
              <tr key={Math.random()}>
                {letters.map((letter) => (
                  <td key={Math.random()}>
                    <LetterBox letter={letter} />
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const LetterBox: FC<{ letter: string }> = ({ letter }) => {
  return <span className="LetterBox">{letter.toUpperCase()}</span>;
};
