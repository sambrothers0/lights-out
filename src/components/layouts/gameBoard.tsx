import Tile from "@/components/ui/Tile";
import { useState } from "react";
// import Model from "@/model/Model";

const BOARD_SIZE = 5;
const ROWS = Array.from({ length: BOARD_SIZE }, (_, row) => row);
const COLS = Array.from({ length: BOARD_SIZE }, (_, col) => col);

interface TileData {
    state: boolean;
    number: number;
    row: number;
    col: number;
}

const startingTiles: TileData[] = ROWS.flatMap((row) =>
  COLS.map((col) => ({
      state: false, // random starting logic could be implemented here
      number: row * BOARD_SIZE + col + 1,
      row,
      col,
  }))
);

export const GameBoard = () => {
  const [tiles, setTiles] = useState<TileData[]>(() => startingTiles);

  const toggleState = (number: number) => {
    setTiles(prev => prev.map(tile => {
      if (tile.number === number) {
        return { ...tile, state: !tile.state };
      }
      return tile;
    }));
  };

  return (
    <div className={`grid grid-cols-5 gap-1 w-full h-full`}>
      {tiles.map((tile) => (
        <Tile
          key={tile.number}
          number={tile.number}
          state={tile.state}
          onClick={() => toggleState(tile.number)}
        />
      ))}
    </div>
  );
};

export default GameBoard;
