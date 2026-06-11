import coffeeImg from '@/assets/coffee.png';
import githubImg from '@/assets/github.png';
import GameBoard from '@/components/layouts/gameBoard';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

export type Difficulty = 'Easy' | 'Normal' | 'Hard';

function App() {
  const [moveCount, setMoveCount] = useState(0);
  const incrementMoveCount = () => setMoveCount(prev => prev + 1);

  const [hasWon, setHasWon] = useState(false);
  const winGame = () => {
    setTimeout(() => {
      setHasWon(true);
    }, 500);
  };
  
  const [resetKey, setResetKey] = useState(0);
  const resetGame = () => {
    setHasWon(false);
    setTimeout(() => {
      setResetKey(prev => prev + 1);
      setMoveCount(0);
    }, 300);
  }
  
  const [difficulty, setDifficulty] = useState<Difficulty>('Normal');
  const changeDifficulty = () => {
    setDifficulty(prev => {
      if (prev === 'Easy') return 'Normal';
      if (prev === 'Normal') return 'Hard';
      return 'Easy';
    });
    setResetKey(prev => prev + 1);
    setMoveCount(0);
  };

  useEffect(() => {
    document.body.style.overflow = hasWon ? 'hidden' : '';
    if (!hasWon) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') resetGame();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [hasWon]);

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-12 text-stone-900 sm:px-10">
      <p className="mx-auto mb-10 text-center w-fit rounded-sm px-4 py-3 text-4xl uppercase tracking-[0.30em] text-amber-300">
        Lights Out
      </p>

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
              {moveCount <= 1 && (
                <p className="mt-6 text-md text-stone-400 sm:text-lg">
                  Solved in 1 move
                </p>
              )}
              {moveCount > 1 && (
                <p className="mt-6 text-md text-stone-400 sm:text-lg">
                  Solved in {moveCount} moves
                </p>
              )}
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

      <section className="relative mx-auto flex h-[70vmin] w-[70vmin] items-center justify-center">
        <AnimatePresence mode="wait">
          <GameBoard 
          incrementMoveCount={incrementMoveCount}
          difficulty={difficulty} 
          winGame={winGame} 
          key={resetKey}/>
        </AnimatePresence>
      </section>

      <p className="mb-4 mt-10 text-center text-sm font-medium uppercase tracking-[0.2em] text-stone-400">
        Moves - {moveCount}
      </p>

      <button 
        className={`block mx-auto w-fit my-5 rounded-full border border-stone-700 px-3 py-1 text-base font-semibold text-stone-300 transition ${!hasWon && 'hover:bg-stone-600'}`}
        onClick={() => {
          if (hasWon) {
            return;
          }
          changeDifficulty();
        }}
        >
        {difficulty}
      </button> 

      <div className="mx-auto my-12 h-px w-[80vmin] bg-stone-700" />
      
      <p className="mx-auto max-w-2xl my-4 text-center text-stone-300 sm:text-md">
        <a href="https://en.wikipedia.org/wiki/Lights_Out_(game)" 
          className="underline underline-offset-4" 
          target="_blank" 
          rel="noreferrer"
          >
          Game Info
        </a>
        <br />
        <a href="https://www.youtube.com/watch?v=ffCWa3Cppk4" 
          className="underline underline-offset-4" 
          target="_blank" 
          rel="noreferrer"
          >
          Solution
        </a>
      </p>

      <p className="mx-auto max-w-2xl mt-8 text-center text-sm text-stone-500 sm:text-base">
        Created by <a href="https://sambrothers0.github.io"
          className="underline underline-offset-4"
          target="_blank"
          rel="noreferrer"
          >
          Sam Brothers
        </a>
      </p>

      <div className="mx-auto mt-6 flex items-center justify-center gap-3">
        <a href="https://github.com/sambrothers0/lights-out"
          className="rounded-full p-1.5 transition hover:bg-stone-700"
          target="_blank"
          rel="noreferrer"
          >
          <img src={githubImg} alt="GitHub" className="h-4 w-4" />
        </a>
        <div className="w-px h-4 bg-stone-500" />
        <a href="https://buymeacoffee.com/sambrothers"
          className="rounded-full p-1.5 transition hover:bg-stone-700"
          target="_blank"
          rel="noreferrer"
          >
          <img src={coffeeImg} alt="Buy me a coffee" className="h-4 w-4" />
        </a>
      </div>

    </main>
  )
}

export default App
