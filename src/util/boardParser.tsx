import { type TileProps } from '@/components/ui/Tile';

/**
 * Reads the current tiles data and constructs a 2D array of 0s and 1s
 * representing the board state mathematically.
 *
 * A `1` means the tile is turned on, a `0` means it is off. The tile's
 * `row` and `col` determine its position in the returned grid.
 */
export const parseBoard = (tiles: TileProps[]): number[][] => {
  const size = Math.round(Math.sqrt(tiles.length));
  const board: number[][] = Array.from({ length: size }, () =>
    new Array<number>(size).fill(0)
  );

  for (const tile of tiles) {
    board[tile.row][tile.col] = tile.isTurnedOn ? 1 : 0;
  }

  return board;
};

export default parseBoard;
