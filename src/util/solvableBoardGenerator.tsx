
/*
    Generates a random, solvable board layout for the Lights Out game
    by simluating random button presses on an initially solved board.

    Takes a `size` parameter to determine the dimensions of the board (size x size).
    Returns a 2D array of 0s and 1s, where `1` represents a turned-on tile and `0` represents a turned-off tile.
*/
export const generateSolvableBoard = (size: number): number[][] => {
    const layout = Array.from({ length: size }, () => new Array(size).fill(0));
    const toggle = (r: number, c: number) => {
      if (r >= 0 && r < size && c >= 0 && c < size) layout[r][c] ^= 1;
    };
    const moves: {row: number; col: number}[] = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (Math.random() < 0.5) {           // randomly "press" this button
          toggle(r, c);
          toggle(r - 1, c); toggle(r + 1, c);
          toggle(r, c - 1); toggle(r, c + 1);
          moves.push({ row: r, col: c });
        }
      }
    }1
    if (layout.every(row => row.every(cell => cell === 0))) {
      return generateSolvableBoard(size); // regenerate if we end up with the solved state
    }
    return layout;
}

export default generateSolvableBoard;