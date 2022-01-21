export type Board = boolean[][];

interface State {
  board: Board;
  /** Next row */
  i: number;
  /** Remaining columns */
  js: number[];
  /** Remaining positive diagonals */
  ks: number[];
  /** Remaining negative diagonals */
  ls: number[];
}

function inclusiveRange(min: number, max: number) {
  let values = [];
  for (let i = min; i <= max; i++) {
    values.push(i);
  }
  return values;
}

function copyAndRemoveItemFromList<T>(item: T, list: T[]) {
  list = [...list];
  var index = list.indexOf(item);
  if (index !== -1) {
    list.splice(index, 1);
  }
  return list;
}

export default function* getNQueensBoards(
  n: number,
): Generator<Board, void, unknown> {
  let initialState: State = {
    board: new Array(n).fill(undefined).map(() => new Array(n).fill(false)),
    i: 0,
    js: inclusiveRange(0, n - 1),
    ks: inclusiveRange(-(n - 1), n - 1),
    ls: inclusiveRange(0, 2 * (n - 1)),
  };
  let fringe = [initialState];

  while (fringe.length > 0) {
    let { board, i, js, ks, ls } = fringe.shift();

    for (let j of js) {
      // Calculate the diagonal ids. Make sure neither diagonal is occupied.
      let k = i - j;
      if (!ks.includes(k)) continue;

      let l = i + j;
      if (!ls.includes(l)) continue;

      // At this point we know the new board is valid. Make a copy of the sets
      // of remaining columns and diagonals, removing the column and diagonal
      // ids we just used.
      let newBoard = board.map((row) => row.map((cell) => cell));
      newBoard[i][j] = true;
      let newState: State = {
        board: newBoard,
        i: i + 1,
        js: copyAndRemoveItemFromList(j, js),
        ks: copyAndRemoveItemFromList(k, ks),
        ls: copyAndRemoveItemFromList(l, ls),
      };

      if (newState.i >= n) {
        yield newBoard;
      } else {
        fringe.push(newState);
      }
    }
  }
}

function formatBoard(board: Board) {
  return board
    .map((row) => row.map((cell) => (cell ? "Q" : ".")).join(" "))
    .join("\n");
}

function debugN(n: number) {
  let boards = [...getNQueensBoards(n)];
  console.log("n =", n, boards.length);
  console.group();
  for (let board of boards) {
    console.log(formatBoard(board));
  }
  console.groupEnd();
}

// debugN(1);
// debugN(2);
// debugN(3);
// debugN(4);
// debugN(5);
// debugN(6);
// debugN(7);
// debugN(8);
// debugN(9);
// debugN(10);
