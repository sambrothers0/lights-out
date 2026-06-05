import { useEffect, useRef } from 'react';

function App() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    function recalc() {
      if (!el) return;
      el.style.width = '';
      el.style.height = '';
      const h = el.offsetHeight;
      el.style.width = `${h}px`;
      el.style.height = `${h}px`;
    }

    recalc();
    window.addEventListener('resize', recalc);
    const ro = new ResizeObserver(recalc);
    ro.observe(el);
    return () => {
      window.removeEventListener('resize', recalc);
      ro.disconnect();
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden px-6 py-12 text-stone-900 sm:px-10">

      <p className="mx-auto w-fit rounded-full border border-stone-900/15 bg-gray-200 px-3 py-1 text-lg font-semibold uppercase tracking-[0.18em] text-stone-700">
        Lights Out
      </p>
      <section ref={sectionRef} className="relative mx-auto flex w-full max-w-5xl flex-col gap-8 rounded-3xl border border-stone-900/10 bg-white/70 p-8 backdrop-blur-md sm:p-10">
        
  

        <p className="mx-auto max-w-2xl text-center text-base text-stone-700 sm:text-lg">
          A simple implementation of the classic "Lights Out" puzzle game, built with ReactTS and Tailwind CSS.
        </p>
      </section>
    </main>
  )
}

export default App
