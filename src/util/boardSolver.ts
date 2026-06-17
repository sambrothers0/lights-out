export interface Move {
  r: number;
  c: number;
}

/**
 * Calculates a set of moves that solves the given Lights Out board.
 *
 * Adapted from https://github.com/daattali/lightsout/blob/master/R/solve.R,
 * which solves the board with Gaussian elimination modulo 2 on the equation
 * `A · x = b`, where:
 *   - `b` is the current board state (flattened),
 *   - `A` is the toggle matrix (pressing a button flips itself and its four
 *     orthogonal neighbors), and
 *   - `x` is the solution: which buttons to press.
 *
 * The board size is derived from the input array (assumed square). Each
 * returned move is an `{ r, c }` object identifying a tile to press; pressing
 * every tile in the set once, in any order, turns all lights off. If the board
 * has no solution, an empty set is returned.
 */
export const solveBoard = (board: number[][]): Set<Move> => {
  const size = board.length;
  const cells = size * size;
  const index = (r: number, c: number): number => r * size + c;

  // Build the augmented matrix [A | b]. Row `i` is the equation for cell `i`:
  // a button toggles cell `i` if it is that cell or one of its neighbors.
  const matrix: number[][] = Array.from({ length: cells }, () =>
    new Array<number>(cells + 1).fill(0)
  );

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const i = index(r, c);
      matrix[i][i] = 1; // pressing this cell toggles itself
      if (r > 0) matrix[i][index(r - 1, c)] = 1;
      if (r < size - 1) matrix[i][index(r + 1, c)] = 1;
      if (c > 0) matrix[i][index(r, c - 1)] = 1;
      if (c < size - 1) matrix[i][index(r, c + 1)] = 1;
      matrix[i][cells] = board[r][c]; // current state forms the b column
    }
  }

  // Gaussian elimination to reduced row echelon form, all arithmetic mod 2.
  const pivotColForRow: number[] = [];
  let pivotRow = 0;
  for (let col = 0; col < cells && pivotRow < cells; col++) {
    // Find a row at or below pivotRow with a 1 in this column.
    let swap = -1;
    for (let row = pivotRow; row < cells; row++) {
      if (matrix[row][col] === 1) {
        swap = row;
        break;
      }
    }
    if (swap === -1) continue; // free variable, no pivot in this column

    [matrix[pivotRow], matrix[swap]] = [matrix[swap], matrix[pivotRow]];

    // Eliminate this column from every other row by XORing the pivot row in.
    for (let row = 0; row < cells; row++) {
      if (row !== pivotRow && matrix[row][col] === 1) {
        for (let k = col; k <= cells; k++) {
          matrix[row][k] ^= matrix[pivotRow][k];
        }
      }
    }

    pivotColForRow[pivotRow] = col;
    pivotRow++;
  }

  // Any row of the form [0 ... 0 | 1] means the system is inconsistent.
  for (let row = 0; row < cells; row++) {
    const allZero = matrix[row].slice(0, cells).every((v) => v === 0);
    if (allZero && matrix[row][cells] === 1) return new Set<Move>();
  }

  // Each pivot row fixes one variable; free variables default to 0 (no press).
  const solution = new Array<number>(cells).fill(0);
  for (let row = 0; row < pivotRow; row++) {
    solution[pivotColForRow[row]] = matrix[row][cells];
  }

  const moves = new Set<Move>();
  for (let i = 0; i < cells; i++) {
    if (solution[i] === 1) {
      moves.add({ r: Math.floor(i / size), c: i % size });
    }
  }

  return moves;
};

export default solveBoard;
