import coffeeImg from '@/assets/coffee.png';
import githubImg from '@/assets/github.png';
import GameBoard from '@/components/layouts/gameBoard';
import { AnimatePresence, MotionConfig, useReducedMotion } from 'motion/react';
import { useState } from 'react';

function App() {
  const prefersReduced = useReducedMotion();
  const [motionOverride, setMotionOverride] = useState<boolean | null>(null);
  const motionDisabled = motionOverride ?? prefersReduced ?? false;

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-12 text-stone-900 sm:px-10">
      <p className="mx-auto mb-10 text-center w-fit rounded-sm px-4 py-3 text-4xl uppercase tracking-[0.30em] text-amber-300">
        Lights Out
      </p>

      <section className="relative mx-auto flex justify-center">
        <MotionConfig reducedMotion={motionDisabled ? 'always' :'never'}>
          <AnimatePresence mode="wait">
            <GameBoard motionDisabled={motionDisabled} />
          </AnimatePresence>
        </MotionConfig>
      </section>

      <div className="mx-auto mb-12 mt-7 h-px w-[80vmin] bg-stone-700" />
      
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
          Tutorial
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
        <div className="w-px h-4 bg-stone-500" />
        <button
          type="button"
          onClick={() => setMotionOverride(!motionDisabled)}
          aria-pressed={motionDisabled}
          aria-label={motionDisabled ? 'Enable motion' : 'Disable motion'}
          title={motionDisabled ? 'Enable motion' : 'Disable motion'}
          className={`rounded-full p-1.5 transition hover:bg-stone-700 ${
            motionDisabled ? 'text-amber-300' : 'text-stone-500'
          }`}
          >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-[1.15rem] w-[1.15rem]"
            aria-hidden="true"
            >
            <circle cx="15" cy="12" r="3.5" />
            <line x1="2" y1="7" x2="8" y2="7" />
            <line x1="1.5" y1="12" x2="6.5" y2="12" />
            <line x1="3" y1="17" x2="8" y2="17" />
            {motionDisabled && <line x1="3" y1="21" x2="21" y2="3" />}
          </svg>
        </button>
      </div>

    </main>
  )
}

export default App
