import { css } from "@emotion/css";
import { Board } from "./getNQueensBoards";

const BoardUi: React.FC<{
  board: Board;
}> = (props) => {
  return (
    <table
      cellSpacing={0}
      className={css`
        border: 2px solid black;
      `}
    >
      <tbody>
        {props.board.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td
                className={css`
                  text-align: center;
                  background-color: ${(i - j) % 2 ? "black" : "white"};
                  width: 1.5em;
                  height: 1.5em;
                `}
                key={j}
              >
                {cell ? "👑" : null}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BoardUi;
