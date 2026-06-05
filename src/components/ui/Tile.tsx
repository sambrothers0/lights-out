import React from 'react';

interface TileProps {
  children?: React.ReactNode;
  className?: string;
}

export const Tile: React.FC<TileProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      {children}
    </div>
  );
};

export default Tile;
