import { type TileProps } from '@/components/ui/Tile';

/*
    Generates a random, solvable board layout for the Lights Out game
    by simulating random button presses on an initially solved board.

    Takes a `size` parameter to determine the dimensions of the board (size x size).
    Returns a flat, row-major array of tiles where each tile's `isTurnedOn`
    reflects whether that light starts on.
*/
export const generateSolvableBoard = (size: number): TileProps[] => {
    const layout = new Array<number>(size * size).fill(0);
    const toggle = (r: number, c: number) => {
      if (r >= 0 && r < size && c >= 0 && c < size) layout[r * size + c] ^= 1;
    };
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        if (Math.random() < 0.5) {           // randomly "press" this button
          toggle(r, c);
          toggle(r - 1, c); toggle(r + 1, c);
          toggle(r, c - 1); toggle(r, c + 1);
        }
      }
    }
    if (layout.every(cell => cell === 0)) {
      return generateSolvableBoard(size); // regenerate if we end up with the solved state
    }

    const tiles: TileProps[] = [];
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        tiles.push({
          index: row * size + col,
          isTurnedOn: layout[row * size + col] === 1,
          highlighted: false,
          suggested: false,
          row,
          col,
          animationDelay: 0,
          onMouseEnter: () => {},
          onMouseLeave: () => {},
          onClick: () => {},
        });
      }
    }
    return tiles;
}

export default generateSolvableBoard;
