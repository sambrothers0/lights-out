import GameBoard from '@/components/layouts/gameBoard';
import { useState } from 'react';

function App() {
  const [moveCount, setMoveCount] = useState(0);
  const incrementMoveCount = () => setMoveCount(prev => prev + 1);

  const [isWon, setIsWon] = useState(false);
  const winGame = () => setIsWon(true);

  const [resetKey, setResetKey] = useState(0);
  const resetGame = () => {
    setIsWon(false);
    setResetKey(prev => prev + 1);
    setMoveCount(0);
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-12 text-stone-900 sm:px-10">
      <p className="mx-auto w-fit rounded-xl border border-stone-300/15 bg-stone-700 px-3 py-1 text-3xl font-semibold uppercase tracking-[0.18em] text-stone-200">
        Lights Out
      </p>

      <div className="pointer-events-none absolute inset-x-4 top-20 z-20 flex justify-center sm:inset-x-8 sm:top-24">
        {isWon && (
          <div className="w-full max-w-4xl rounded-[2rem] border border-white/40 bg-stone-950/80 px-6 py-10 text-center text-white shadow-[0_30px_80px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:px-10 sm:py-14">
            <p className="text-5xl font-black uppercase tracking-[0.22em] text-amber-300 sm:text-7xl">
              You Win
            </p>
            <p className="mt-6 text-xl text-stone-600 sm:text-2xl">
              It took you {moveCount} tries.
            </p>
            <button
              type="button"
              className="pointer-events-auto mt-10 rounded-full border border-amber-300/40 bg-amber-300 px-6 py-3 text-base font-semibold text-stone-950 transition hover:scale-[1.02] hover:bg-amber-200"
              onClick={resetGame}
            >
              Restart Game
            </button>
          </div>
        )}
      </div>

      <section className="relative mx-auto flex h-[70vmin] w-[70vmin] items-center justify-center p-8 sm:p-10">
        <GameBoard incrementMoveCount={incrementMoveCount} winGame={winGame} key={resetKey}/>
      </section>

      <p className="mt-4 pb-4 text-center text-sm font-medium uppercase tracking-[0.2em] text-stone-400">
        Move Count: {moveCount}
      </p>

        <p className="mx-auto max-w-2xl text-center text-base text-stone-300 sm:text-lg">
          A simple implementation of the classic "Lights Out" puzzle game, built with ReactTS and Tailwind CSS.
        </p>
        
    </main>
  )
}

export default App
