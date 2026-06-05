import React from 'react';

interface TileProps {
  state: boolean;
  number: number;
  className?: string;
  onClick: () => void;
}

export const Tile: React.FC<TileProps> = ({ state, number, className = '', onClick }) => {
  const stateClassName = state
    ? 'bg-amber-100 text-amber-950 border-amber-200'
    : 'bg-stone-700 text-stone-100 border-stone-800';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full aspect-square items-center justify-center rounded-sm border text-xl font-semibold shadow-sm transition-shadow hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 ${stateClassName} ${className}`}
    >
      {number}
    </button>
  );
};

export default Tile;
