import coffeeImg from '@/assets/coffee.png';
import githubImg from '@/assets/github.png';
import GameBoard from '@/components/layouts/gameBoard';
import { AnimatePresence } from 'motion/react';

function App() {
  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-12 text-stone-900 sm:px-10">
      <p className="mx-auto mb-10 text-center w-fit rounded-sm px-4 py-3 text-4xl uppercase tracking-[0.30em] text-amber-300">
        Lights Out
      </p>

      <section className="relative mx-auto flex justify-center">
        <AnimatePresence mode="wait">
          <GameBoard />
        </AnimatePresence>
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
      </div>

    </main>
  )
}

export default App
