import GameBoard from '@/components/layouts/gameBoard';

function App() {
  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-12 text-stone-900 sm:px-10">

      <p className="mx-auto w-fit rounded-full border border-stone-900/15 bg-gray-200 px-3 py-1 text-lg font-semibold uppercase tracking-[0.18em] text-stone-700">
        Lights Out
      </p>
      <section className="relative mx-auto flex h-[70vmin] w-[70vmin] items-center justify-center rounded-3xl border border-stone-900/10 bg-white/70 p-8 backdrop-blur-md sm:p-10">
        <GameBoard/>
      </section>

        <p className="mx-auto max-w-2xl text-center text-base text-stone-700 sm:text-lg">
          A simple implementation of the classic "Lights Out" puzzle game, built with ReactTS and Tailwind CSS.
        </p>
    </main>
  )
}

export default App
