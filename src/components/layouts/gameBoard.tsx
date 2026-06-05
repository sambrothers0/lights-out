import Tile from "@/components/ui/Tile";
import { useState } from "react";
// import Model from "@/model/Model";

const BOARD_SIZE = 5;
const ROWS = Array.from({ length: BOARD_SIZE }, (_, row) => row);
const COLS = Array.from({ length: BOARD_SIZE }, (_, col) => col);

interface TileData {
  number: number;
  row: number;
  col: number;
}

type TileState = Record<number, "on" | "off">;

const TILES: TileData[] = ROWS.flatMap((row) =>
  COLS.map((col) => ({
    number: row * BOARD_SIZE + col + 1,
    row,
    col,
  }))
);

export const GameBoard = () => {
  const [tileStates, setTileStates] = useState<TileState>(() =>
    TILES.reduce<TileState>((states, tile) => {
      states[tile.number] = 'off';
      return states;
    }, {})
  );

  const toggleState = (tileNumber: number) => {
    setTileStates((currentStates) => ({
      ...currentStates,
      [tileNumber]: currentStates[tileNumber] === 'on' ? 'off' : 'on',
    }));
  };

  return (
    <div className={`grid grid-cols-5 gap-1 w-full h-full`}>
      {TILES.map((tile) => (
        <Tile
          key={tile.number}
          state={tileStates[tile.number]}
          number={tile.number}
          onClick={() => toggleState(tile.number)}
        />
      ))}
    </div>
  );
};

export default GameBoard;
