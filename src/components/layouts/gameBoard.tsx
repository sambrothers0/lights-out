import Tile, { type TileProps } from "@/components/ui/Tile";
import { generateSolvableBoard } from "@/util/solvableBoardGenerator";
import { parseBoard } from "@/util/boardParser";
import { solveBoard } from "@/util/boardSolver";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from 'motion/react';

function initializeBoard(n: number): TileProps[] {
  const layout = generateSolvableBoard(n);
  const tiles: TileProps[] = [];
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      tiles.push({
        index: row * n + col,
        isTurnedOn: layout[row][col] === 1,
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

export const GameBoard = () => {
  type Difficulty = 'Easy' | 'Normal' | 'Hard';
  const startingDifficulty: Difficulty = 'Normal';

  const boardSizes: Record<Difficulty, number> = {
    'Easy': 4,
    'Normal': 5,
    'Hard': 7,
  };
  
  const [boardSize, setBoardSize] = useState(boardSizes[startingDifficulty]);
  const [moveCount, setMoveCount] = useState(0);
  const [resetKey, setResetKey] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>(startingDifficulty);
  const [tiles, setTiles] = useState<TileProps[]>(() => initializeBoard(boardSize));
  const [solutionShown, setSolutionShown] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  const changeDifficulty = () => {
    const nextDifficulty: Difficulty =
      difficulty === 'Easy' ? 'Normal' : difficulty === 'Normal' ? 'Hard' : 'Easy';
    setDifficulty(nextDifficulty);
    setBoardSize(boardSizes[nextDifficulty]);
    setTiles(initializeBoard(boardSizes[nextDifficulty]));
    setSolutionShown(false);
    setResetKey(prev => prev + 1);
    setMoveCount(0);
  };

  // for clicking and highlighting
  const findAffectedIndices = (index: number): Set<number> => {
    const affectedIndices = new Set<number>();
    affectedIndices.add(index)
    
    const tile = tiles.find(tile => tile.index === index);
    if (!tile) return affectedIndices;
    if (tile.row > 0) {
      affectedIndices.add(tile.index - boardSize);
    }
    if (tile.row < boardSize - 1) {
      affectedIndices.add(tile.index + boardSize);
    }
    if (tile.col > 0) {
      affectedIndices.add(tile.index - 1);
    }
    if (tile.col < boardSize - 1) {
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
    const enteredTiles = tiles.map(tile => ({
      ...tile,
      highlighted: affectedIndices.has(tile.index)
    }));
    setTiles(enteredTiles);
  }

  const handleClick = (index: number) => {
    if (!hasWon) {
      const affectedIndices = findAffectedIndices(index);
      const toggledTiles = tiles.map(tile => ({
        ...tile,
        isTurnedOn: affectedIndices.has(tile.index) ? !tile.isTurnedOn : tile.isTurnedOn,
      }));
      const suggestedIndices = solutionShown
        ? getSuggestedTileIndices(toggledTiles)
        : new Set<number>();
      const newTiles = toggledTiles.map(tile => ({
        ...tile,
        suggested: suggestedIndices.has(tile.index),
      }));
      setTiles(newTiles);
      setMoveCount(prev => prev + 1);
      if (newTiles.every(tile => !tile.isTurnedOn)) {
        winGame();
      }
    }
  }
  
  const getSuggestedTileIndices = (boardTiles: TileProps[] = tiles): Set<number> => {
    const solution = solveBoard(parseBoard(boardTiles));
    const indices = new Set<number>();
    solution.forEach(move => {
      const index = move.r * boardSize + move.c;
      indices.add(index);
    });
    return indices;
  };

  useEffect(() => {
    if (!solutionShown) {
      setTiles(prev => prev.map(tile => ({
        ...tile,
        suggested: false
      }))); 
    }
    else {
      const suggestedIndices = getSuggestedTileIndices();
      setTiles(prev => prev.map(tile => ({
        ...tile,
        suggested: suggestedIndices.has(tile.index)
      })));
    }}, [solutionShown]);

  const toggleSolution = () => {
    const nextShown = !solutionShown;
    setSolutionShown(nextShown);
  }
  
  const winGame = () => {
    setTimeout(() => {
      setHasWon(true);
    }, 500);
  }

  useEffect(() => {
    document.body.style.overflow = hasWon ? 'hidden' : '';
    if (!hasWon) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') resetGame();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [hasWon]);

  const resetGame = () => {
    setHasWon(false);
    setTiles(initializeBoard(boardSize));
    setResetKey(prev => prev + 1);
    setSolutionShown(false);
    setTimeout(() => {
      setMoveCount(0);
    }, 300);
  }
  
  // DEBUG: press 'w' to auto win. this could also just be an easter egg for the user
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W') {
        setTiles(prev => prev.map(tile => ({ ...tile, isTurnedOn: false })));
        winGame();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <AnimatePresence>
        {hasWon && (
          <motion.div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div
              className="w-lg max-w-2xl rounded-[2rem] border border-white/40 px-6 py-10 text-center text-white shadow-[0_30px_80px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:px-10 sm:py-14"
              style={{ backgroundColor: '#1d2021cc' }}
            >
              <p className="uppercase tracking-[0.22em] text-amber-300 sm:text-5xl">
                You Win
              </p>
              <p className="mt-6 text-md text-stone-400 sm:text-lg">
                Solved in {moveCount} {moveCount === 1 ? 'move' : 'moves'}
              </p>
              <button
                type="button"
                className="mt-10 rounded-full border border-amber-300/40 bg-amber-300 px-6 py-3 text-base font-semibold text-stone-950 transition hover:scale-[1.02] hover:bg-amber-300 focus:outline-none"
                onClick={resetGame}
              >
                Play Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex w-full flex-col items-center">
        <AnimatePresence mode="wait">
          <div
            key={resetKey}
            data-testid="game-board"
            className="grid gap-1 h-[70vmin] w-[70vmin] overflow-hidden"
            style={{
              gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${boardSize}, minmax(0, 1fr))`,
            }}
          >
            {tiles.map((tile) => {
              const totalTiles = boardSize * boardSize;
              const columnMajorOrder = tile.col * boardSize + tile.row;
              const animationDelay = (columnMajorOrder / (totalTiles - 1)) * 0.2;
              return (
                <Tile
                  key={tile.index}
                  index={tile.index}
                  isTurnedOn={tile.isTurnedOn}
                  highlighted={!hasWon && tile.highlighted}
                  suggested={solutionShown && tile.suggested}
                  row={tile.row}
                  col={tile.col}
                  animationDelay={animationDelay}
                  onMouseEnter={() => {handleHover(tile.index)}}
                  onMouseLeave={() => {handleHover()}}
                  onClick={() => {handleClick(tile.index)}}
                ></Tile>
              );
            })}
          </div>
        </AnimatePresence>
        
        <p className="mb-4 mt-10 text-center text-sm font-medium uppercase tracking-[0.2em] text-stone-400">
          Moves - {moveCount}
        </p>

        <p className="mb-2 mt-2 text-center text-sm text-stone-400">
          Turn off all the lights in as few moves as possible!
        </p>

        <div className="flex items-center justify-center gap-4 my-5">
          <button
            className={`w-fit rounded-full border border-stone-700 px-3 py-1 text-base font-semibold text-stone-300 transition ${!hasWon && 'hover:bg-stone-600'}`}
            disabled={hasWon}
            onClick={changeDifficulty}
          >
            {difficulty}
          </button>
          <button
            className={`w-fit rounded-full border border-stone-700 px-3 py-1 text-base font-semibold text-stone-300 transition ${!hasWon && 'hover:bg-stone-600'}`}
            disabled={hasWon}
            onClick={resetGame}
          >
            Reset
          </button>
          <button
            className={`w-fit rounded-full border border-stone-700 px-3 py-1 text-base font-semibold text-stone-300 transition ${!hasWon && 'hover:bg-stone-600'}`}
            disabled={hasWon}
            onClick={toggleSolution}
          >
            {solutionShown ? 'Hide Solution' : 'Solution'}
          </button>
        </div>
      </div>
    </>
  );
};

export default GameBoard;
