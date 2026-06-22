import type { TileProps } from "@/components/ui/Tile";

// Reconstruct the board's TileProps[] from the rendered tile elements so it can
// be fed back into solveBoard. Tiles render in row-major order, and a lit tile
// carries the `bg-amber-300` class; that's everything solveBoard reads.
export const readBoard = (tileEls: HTMLElement[]): TileProps[] => {
  const size = Math.round(Math.sqrt(tileEls.length));
  return tileEls.map((el, index) => ({
    index,
    isTurnedOn: el.dataset.lit === "true",
    highlighted: false,
    suggested: false,
    row: Math.floor(index / size),
    col: index % size,
    animationDelay: 0,
    onMouseEnter: () => {},
    onMouseLeave: () => {},
    onClick: () => {},
  }));
};

export default readBoard;
