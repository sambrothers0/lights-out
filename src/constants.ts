import { type TileProps } from "@/components/ui/Tile";

export type Difficulty = 'Easy' | 'Normal' | 'Hard';

export const BOARD_SIZES: Record<Difficulty, number> = {
  'Easy': 4,
  'Normal': 5,
  'Hard': 7,
};

export const STARTING_DIFFICULTY: Difficulty = 'Normal';

// A stable string fingerprint of the board's on/off pattern, used to compare boards.
export const boardKey = (tiles: TileProps[]): string =>
  tiles.map(tile => (tile.isTurnedOn ? "1" : "0")).join("");

export const WIN_SCREEN_DELAY = 500;
export const RESET_GAME_DELAY = 300;