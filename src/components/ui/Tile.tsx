import React from 'react';

interface TileProps {
  state: boolean;
  number?: number;
  className?: string;
  highlighted: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

export const Tile: React.FC<TileProps> = ({ state, number, className = '', highlighted, onMouseEnter, onMouseLeave, onClick }) => {
  const stateClassName = state
    ? 'bg-amber-300 text-amber-950'
    : 'bg-stone-700 text-stone-100';

  const borderClassName = highlighted
    ? 'border-2 border-white'
    : 'border-2 border-transparent';

  return (
    <button
      type="button"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={`flex
        w-full aspect-square items-center justify-center rounded-sm border-7 text-xl font-semibold transition-[background-color,color] ${stateClassName} ${borderClassName} ${className}`}
    >
      {number}
    </button>
  );
};

export default Tile;
