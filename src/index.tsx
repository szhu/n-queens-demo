import { css } from "@emotion/css";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import BoardUi from "./BoardUi";
import getNQueensBoards, { Board } from "./getNQueensBoards";

function useForceRender() {
  const [, setRandom] = useState<number>(0);
  return function forceRefresh() {
    setRandom(Math.random());
  };
}

function useHashState<T>(
  toHash: (value: T) => string,
  fromHash: (hash: string) => T,
) {
  const forceRender = useForceRender();
  const value = fromHash(location.hash.substring(1));
  function setValue(newValue: T) {
    location.hash = "#" + toHash(newValue);
    forceRender();
  }
  return [value, setValue] as const;
}

function App() {
  const [n, setN] = useHashState<number>(
    (newN) => (Number.isNaN(newN) ? "" : "" + newN),
    (hash) => (hash === "" || Number.isNaN(+hash) ? 4 : +hash),
  );
  const [isCalculating, setIsCalculating] = useState(false);

  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    setIsCalculating(true);
    setTimeout(() => {
      setBoards([...getNQueensBoards(n)]);
      setIsCalculating(false);
    }, 100);
  }, [n]);

  return (
    <>
      <div
        className={css`
          position: sticky;
          top: 0;
          background: white;
          padding: 1em;
          border-bottom: 1px solid black;
          display: flex;
          flex-direction: column;
          gap: 0.5em;
        `}
      >
        <h1
          className={css`
            font-size: 1.5em;
            margin: 0;
          `}
        >
          N-Queens Problem
        </h1>
        <div>
          How can <i>n</i> queens be arranged on an <i>n</i> &times; <i>n</i>{" "}
          chessboard such that no queens are attacking each other?
        </div>
        <div>
          See the solutions for <i>n</i> ={" "}
          <input
            type="number"
            min="0"
            max="10"
            value={n}
            onChange={(e) => setN(e.currentTarget.valueAsNumber)}
            onFocus={(e) => e.currentTarget.select()}
            className={css`
              width: 4ch;
            `}
          />
        </div>
        <div>
          {isCalculating ? (
            <>Crunching some numbers&hellip;</>
          ) : (
            <>
              There {boards.length === 1 ? "is" : "are"} <b>{boards.length}</b>{" "}
              solution
              {boards.length === 1 || "s"} for this <i>n</i>
              {boards.length > 0 ? (
                <>, listed below:</>
              ) : (
                <>
                  .{" "}
                  {n === 0 ? (
                    <>
                      That’s just the number the algorithm is spitting out. I’m
                      not actually sure if this problem is well-defined for{" "}
                      <i>n</i> = 0.
                    </>
                  ) : (
                    <>Surprising, right?</>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
      {!isCalculating && boards.length > 0 && (
        <div
          className={css`
            padding: 1em;
          `}
        >
          {boards.map((board, i) => (
            <React.Fragment key={i}>
              <div>Solution {i + 1}</div>
              <BoardUi board={board} />
              <br />
            </React.Fragment>
          ))}
        </div>
      )}
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
