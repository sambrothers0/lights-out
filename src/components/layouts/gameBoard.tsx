import Tile from "@/components/ui/Tile";
import { useEffect, useState } from "react";

interface TileData {
  index: number;
  label: number;
  isFlipped: boolean;
  highlighted: boolean;
  row: number;
  col: number;
}


export const GameBoard = ({ incrementMoveCount, difficulty, winGame }:
  { incrementMoveCount: () => void; difficulty: string; winGame: () => void;}) => {
    
  
  let BOARD_SIZE: number;
  if (difficulty === 'Easy') {BOARD_SIZE = 4} 
  else if (difficulty === 'Normal') {BOARD_SIZE = 5} 
  else {BOARD_SIZE = 7};

  // from board size make an iterable to construct board
  const ROW_NUMS = Array.from({ length: BOARD_SIZE }, (_, i) => i);
  const COL_NUMS = Array.from({ length: BOARD_SIZE }, (_, i) => i);
  
  const startingTiles: () => TileData[] = () => ROW_NUMS.flatMap((row) =>
    COL_NUMS.map((col) => ({
      index: row * BOARD_SIZE + col,
      label: row * BOARD_SIZE + col + 1,
      isFlipped: Math.random() < 0.5,
      highlighted: false,
      row,
      col,
    }))
  );
  
  // for debugging, make a starting board with a one-move solution
  // const startingTiles: TileData[] = ROW_NUMS.flatMap((row) =>
  //   COL_NUMS.map((col) => ({
  //     index: row * BOARD_SIZE + col,
  //     label: row * BOARD_SIZE + col + 1,
  //     isFlipped: ([8, 12, 13, 14, 18].includes(row * BOARD_SIZE + col + 1)) ? true : false,
  //     highlighted: false,
  //     row,
  //     col,
  //   }))
  // );

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

  const handleHover = (index?: number) => {
    if (index === undefined || hasWon) {
      const clearedHoverTiles = tiles.map(tile => ({ ...tile, highlighted: false }));
      setTiles(clearedHoverTiles);
      return;
    }
    const affectedIndices = findAffectedIndices(index);
    const enteredTiles = tiles.map(tile => {
      if (affectedIndices.has(tile.index)) {
        return { ...tile, highlighted: true };
      }
      return { ...tile, highlighted: false };
    });
    setTiles(enteredTiles);
  }

  const [tiles, setTiles] = useState<TileData[]>(startingTiles);

  // DEBUG: press 'w' to auto win
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W') {
        setTiles(prev => prev.map(tile => ({ ...tile, isFlipped: false })));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleState = (index: number) => {
    const affectedIndices = findAffectedIndices(index);
    const newTiles = tiles.map(tile => {
      if (affectedIndices.has(tile.index)) {

        return { ...tile, isFlipped: !tile.isFlipped };
      }

      return tile;
    });
    setTiles(newTiles);
  };

const hasWon = tiles.every(tile => tile.isFlipped === false);
  useEffect(() => {
    if (hasWon) {
      handleHover();
      winGame();
    }
  }, [hasWon, winGame]);

  return (
    <div
      className={`grid ${{ 4: 'grid-cols-4', 5: 'grid-cols-5', 7: 'grid-cols-7' }[BOARD_SIZE]} gap-1 w-full h-full`}
    >
      {tiles.map((tile) => {
        const totalTiles = BOARD_SIZE * BOARD_SIZE;
        const columnMajorOrder = tile.col * BOARD_SIZE + tile.row;
        const animationDelay = (columnMajorOrder / (totalTiles - 1)) * 0.2;
        return (
        <Tile
          key={tile.index}
          isFlipped={tile.isFlipped}
          highlighted={tile.highlighted}
          animationDelay={animationDelay}
          onMouseEnter={() => {handleHover(tile.index)}}
          onMouseLeave={() => {handleHover()}}
          onClick={() => {
            if (!hasWon) {
              toggleState(tile.index);
              incrementMoveCount();
            }
          }}
        />
        );
      })}
    </div>
  );
};

export default GameBoard;
