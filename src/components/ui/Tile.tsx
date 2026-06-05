import React from 'react';

interface TileProps {
  state: "on" | "off";
  number?: number;
  children?: React.ReactNode;
  className?: string;
}

export const Tile: React.FC<TileProps> = ({ number, children, className = '' }) => {
  return (
    <div
      className={`flex w-full aspect-square items-center justify-center rounded-lg border border-stone-900/50 bg-white text-xl font-semibold text-stone-800 shadow-sm transition-shadow hover:shadow-md ${className}`}
    >
      {children ?? number}
    </div>
  );
};

export default Tile;
