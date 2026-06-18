export interface Move {
  r: number;
  c: number;
}

// Above this kernel dimension the coset has more than 2^MAX_KERNEL_ENUM members,
// so we skip the exhaustive minimum-weight search and return the particular
// solution instead. The app's boards stay well under this (4x4 -> 4, 5x5 -> 2,
// 7x7 -> 0); the cap only protects against pathological large inputs.
const MAX_KERNEL_ENUM = 20;

/** Number of set bits (presses) in a 0/1 vector. */
const weight = (vec: number[]): number =>
  vec.reduce((sum, bit) => sum + bit, 0);

/** XOR `src` into `target` in place (mod-2 addition of two press vectors). */
const xorInto = (target: number[], src: number[]): void => {
  for (let i = 0; i < target.length; i++) target[i] ^= src[i];
};

/**
 * Reads a basis for the kernel of the toggle matrix off its RREF form. Every
 * free column `f` (one with no pivot) yields one kernel vector: it has a 1 in
 * position `f`, and for each pivot row the coefficient that RREF left in column
 * `f` lands in that row's pivot column. These vectors are the "quiet patterns" —
 * button sets that change nothing — and span all alternative solutions.
 */
const computeKernelBasis = (
  matrix: number[][],
  pivotColForRow: number[],
  pivotRow: number,
  cells: number
): number[][] => {
  const isPivotCol = new Array<boolean>(cells).fill(false);
  for (let row = 0; row < pivotRow; row++) isPivotCol[pivotColForRow[row]] = true;

  const basis: number[][] = [];
  for (let free = 0; free < cells; free++) {
    if (isPivotCol[free]) continue;
    const vec = new Array<number>(cells).fill(0);
    vec[free] = 1;
    for (let row = 0; row < pivotRow; row++) {
      vec[pivotColForRow[row]] = matrix[row][free];
    }
    basis.push(vec);
  }
  return basis;
};

/**
 * Given a particular solution `x0` and a basis for the kernel, returns the
 * lowest-weight member of the full solution coset `x0 + ker(A)` by enumerating
 * all 2^k combinations of kernel vectors. This is the fewest-moves solution; the
 * coset is the complete set of solutions, so the minimum over it is optimal.
 */
const minWeightSolution = (
  particular: number[],
  kernelBasis: number[][]
): number[] => {
  let best = particular;
  let bestWeight = weight(particular);

  const combos = 1 << kernelBasis.length;
  for (let mask = 1; mask < combos; mask++) {
    const candidate = particular.slice();
    for (let b = 0; b < kernelBasis.length; b++) {
      if (mask & (1 << b)) xorInto(candidate, kernelBasis[b]);
    }
    const w = weight(candidate);
    if (w < bestWeight) {
      best = candidate;
      bestWeight = w;
    }
  }
  return best;
};

/**
 * Calculates the minimum-move set of moves that solves the given Lights Out board.
 *
 * Adapted from https://github.com/daattali/lightsout/blob/master/R/solve.R,
 * which solves the board with Gaussian elimination modulo 2 on the equation
 * `A · x = b`, where:
 *   - `b` is the current board state (flattened),
 *   - `A` is the toggle matrix (pressing a button flips itself and its four
 *     orthogonal neighbors), and
 *   - `x` is the solution: which buttons to press.
 *
 * When `A` is singular (e.g. the 4x4 and 5x5 boards) there are many solutions:
 * the coset `x0 + ker(A)` of a particular solution `x0`. This function returns
 * the lightest member of that coset — the one with the fewest presses — which is
 * provably optimal because the coset is the complete solution set.
 *
 * The board size is derived from the input array (assumed square). Each
 * returned move is an `{ r, c }` object identifying a tile to press; pressing
 * every tile in the set once, in any order, turns all lights off. An empty set
 * means the board has no solution or is already solved (zero presses is minimal).
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
  // This is a particular solution x0; the kernel's free columns generate the rest.
  const particular = new Array<number>(cells).fill(0);
  for (let row = 0; row < pivotRow; row++) {
    particular[pivotColForRow[row]] = matrix[row][cells];
  }

  // With k free variables the solution coset has 2^k members. When there are
  // any (and not too many to enumerate), search it for the fewest-moves member;
  // otherwise fall back to the particular solution.
  const kernelDim = cells - pivotRow;
  let solution = particular;
  if (kernelDim > 0 && kernelDim <= MAX_KERNEL_ENUM) {
    const kernelBasis = computeKernelBasis(matrix, pivotColForRow, pivotRow, cells);
    solution = minWeightSolution(particular, kernelBasis);
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
