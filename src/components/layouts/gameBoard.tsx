import Tile from "@/components/ui/Tile";
import { useState } from "react";
// import Model from "@/model/Model";

interface TileData {
  index: number;
  label: number;
  state: boolean;
  row: number;
  col: number;
}

const BOARD_SIZE = 5;

// from board size make an iterable to construct board
const ROW_NUMS = Array.from({ length: BOARD_SIZE }, (_, i) => i);
const COL_NUMS = Array.from({ length: BOARD_SIZE }, (_, i) => i);

const startingTiles: TileData[] = ROW_NUMS.flatMap((row) =>
  COL_NUMS.map((col) => ({
    index: row * BOARD_SIZE + col,
    label: row * BOARD_SIZE + col + 1,
    state: false, // random starting logic could be implemented here
    row,
    col,
  }))
);

export const GameBoard = () => {
  const findAffectedIndices = (index: number): Set<number> => {
    const affectedIndices = new Set<number>();
    affectedIndices.add(index)

    const tile = tiles.find(tile => tile.index === index);
    if (!tile) return affectedIndices;

    if (tile.row > 0) {
      affectedIndices.add(tile.index - BOARD_SIZE);
    }
    if (tile.row < BOARD_SIZE - 1) {
      affectedIndices.add(tile.index + BOARD_SIZE);
    }
    if (tile.col > 0) {
      affectedIndices.add(tile.index - 1);
    }
    if (tile.col < BOARD_SIZE - 1) {
      affectedIndices.add(tile.index + 1);
    }
    return affectedIndices;
  };

  const [tiles, setTiles] = useState<TileData[]>(startingTiles);

  const toggleState = (index: number) => {
    const affectedIndices = findAffectedIndices(index);
    setTiles(prev => prev.map(tile => {
      if (affectedIndices.has(tile.index)) {
        return { ...tile, state: !tile.state };
      }
      return tile;
    }));
  };

  return (
    <div className={`grid grid-cols-5 gap-1 w-full h-full`}>
      {tiles.map((tile) => (
        <Tile
          key={tile.index}
          number={tile.label}
          state={tile.state}
          onClick={() => toggleState(tile.index)}
        />
      ))}
    </div>
  );
};

export default GameBoard;
