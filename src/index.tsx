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
  toHash: (value: T, currentHash: string) => string,
  fromHash: (hash: string) => T,
) {
  const forceRender = useForceRender();
  const trimmedHash = location.hash.substring(1);
  const value = fromHash(trimmedHash);
  function setValue(newValue: T) {
    location.hash = "#" + toHash(newValue, trimmedHash);
    forceRender();
  }
  useEffect(() => {
    window.addEventListener("hashchange", forceRender);
    return () => window.removeEventListener("hashchange", forceRender);
  }, []);
  return [value, setValue] as const;
}

function useHashParamState<T>(
  key: string,
  toParam: (value: T) => string,
  fromParam: (param: string) => T,
) {
  return useHashState<T>(
    (newValue, currentHash) => {
      let params = new URLSearchParams(currentHash);
      params.set(key, toParam(newValue));
      return params.toString();
    },
    (newHash) => {
      return fromParam(new URLSearchParams(newHash).get(key));
    },
  );
}

function App() {
  const [n, setN] = useHashParamState<number>(
    "n",
    (newN) => (Number.isNaN(newN) ? "" : "" + newN),
    (param) => (!param || Number.isNaN(+param) ? 4 : Math.max(0, +param)),
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
            display: flex;
            flex-wrap: wrap;
            gap: 1em;
          `}
        >
          {boards.map((board, i) => (
            <React.Fragment key={i}>
              <div>
                <div>Solution {i + 1}</div>
                <BoardUi board={board} />
              </div>
            </React.Fragment>
          ))}
        </div>
      )}
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("app"));
