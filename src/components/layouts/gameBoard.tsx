import Tile from "@/components/ui/Tile";
import { useEffect, useState } from "react";
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

// const startingTiles: () => TileData[] = () => ROW_NUMS.flatMap((row) =>
//   COL_NUMS.map((col) => ({
//     index: row * BOARD_SIZE + col,
//     label: row * BOARD_SIZE + col + 1,
//     state: Math.random() < 0.5,
//     row,
//     col,
//   }))
// );

// for debugging, make a starting board with a one-move solution
const startingTiles: TileData[] = ROW_NUMS.flatMap((row) =>
  COL_NUMS.map((col) => ({
    index: row * BOARD_SIZE + col,
    label: row * BOARD_SIZE + col + 1,
    state: ([8, 12, 13, 14, 18].includes(row * BOARD_SIZE + col + 1)) ? true : false,
    row,
    col,
  }))
);

export const GameBoard = ({ incrementMoveCount, winGame }: { incrementMoveCount: () => void; winGame: () => void;}) => {

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
    const newTiles = tiles.map(tile => {
      if (affectedIndices.has(tile.index)) {
        return { ...tile, state: !tile.state };
      }
      return tile;
    });
    setTiles(newTiles);
  };

  const hasWon = tiles.every(tile => tile.state === false);
  useEffect(() => {
    if (hasWon) {
      winGame();
    }
  }, [hasWon, winGame]);

   const autoWin = () => {
    const newTiles = tiles.map(tile => ({ ...tile, state: false }));
    setTiles(newTiles);
  };

  return (
    <>
    {/* <div className="mb-2">
        <button
          onClick={() => {autoWin(); incrementMoveCount(); }}
          className="px-3 py-1 bg-green-600 text-white rounded"
        >
          Click to win
        </button>
      </div> */}


    <div className={`grid grid-cols-5 gap-1 w-full h-full`}>
      {tiles.map((tile) => (
        <Tile
          key={tile.index}
          state={tile.state}
          onClick={() => {
            if (!hasWon) {
              toggleState(tile.index);
              incrementMoveCount();
            }
            }
          }
        />
      ))}
    </div>
    </>
  );
};

export default GameBoard;
