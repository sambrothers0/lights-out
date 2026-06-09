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
      <p className="mx-auto mb-10 text-center w-fit rounded-xl border border-stone-300/15 bg-stone-700 px-4 py-3 text-3xl font-semibold uppercase tracking-[0.18em] text-amber-200">
        Lights Out
      </p>

      {isWon && (
        <div className="fixed left-1/2 top-1/2 z-20 w-lg max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border border-white/40 bg-stone-950/80 px-6 py-10 text-center text-white shadow-[0_30px_80px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:px-10 sm:py-14">
          <p className="uppercase tracking-[0.22em] text-amber-200 sm:text-5xl">
            You Win
          </p>
          {moveCount == 1 && (
            <p className="mt-6 text-xl text-stone-400 sm:text-2xl">
              It took you {moveCount} move
            </p>
          )}
          {moveCount > 1 && (
            <p className="mt-6 text-xl text-stone-400 sm:text-2xl">
              It took you {moveCount} moves
            </p>
          )}
          <button
            type="button"
            className="mt-10 rounded-full border border-amber-300/40 bg-amber-200 px-6 py-3 text-base font-semibold text-stone-950 transition hover:scale-[1.02] hover:bg-amber-200"
            onClick={resetGame}
            >
            Play Again
          </button>
        </div>
      )}

      <section className="relative mx-auto flex h-[70vmin] w-[70vmin] items-center justify-center">
        <GameBoard incrementMoveCount={incrementMoveCount} winGame={winGame} key={resetKey}/>
      </section>

      <p className="mb-4 mt-10 text-center text-sm font-medium uppercase tracking-[0.2em] text-stone-400">
        Moves - {moveCount}
      </p>

      <button 
        className="block mx-auto w-fit my-5 rounded-full border border-stone-700 px-3 py-1 text-base font-semibold text-stone-300 transition hover:scale-[1.02] hover:bg-stone-500"
        onClick={() => {}}
        >
        {"Difficulty"}
      </button> 
      
      <div className="mx-auto my-12 h-px w-[80vmin] bg-stone-700" />
      
      <p className="mx-auto max-w-2xl my-4 text-center text-stone-300 sm:text-lg">
        <a href="https://en.wikipedia.org/wiki/Lights_Out_(game)" className="underline underline-offset-4">Game Info</a>
        <br />
        <a href="https://www.youtube.com/watch?v=ffCWa3Cppk4" className="underline underline-offset-4">Solution</a>
      </p>

      <p className="mx-auto max-w-2xl mt-8 text-center text-sm text-stone-500 sm:text-base">
        Created by <a href="https://sambrothers0.github.io" className="underline underline-offset-4">Sam Brothers</a>.
      </p>

    </main>
  )
}

export default App
