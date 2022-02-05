import { FC } from "react";
import { Form } from "remix";
import "./PathTable.css";

type PathTableParams = {
  path: string[];
  lengthOfWord?: number;
};

const pattern = /^[A-Za-z]$/;
const inputPattern = "[A-Za-z]";
const invalid = true;

export const PathTable: FC<PathTableParams> = ({ path, lengthOfWord = 4 }) => {
  // make a component just for letter input
  //

  const onChange = (value: string): void => {
    console.log(value);
  };
  return (
    <div id="PathTable">
      {path.length > 0
        ? path.map((value) => <div key={value}>{value}</div>)
        : null}
      <Form method="post" action="/daily">
        <div id="PathTableForm">
          <input type="text" maxLength={4}></input>
          <button>Submit</button>
        </div>
      </Form>
    </div>
  );
};
