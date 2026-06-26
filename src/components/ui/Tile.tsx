import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

export interface TileProps {
  index: number;
  isTurnedOn: boolean;
  highlighted: boolean;
  suggested: boolean;
  row: number;
  col: number;
  className?: string;
  animationDelay: number;
  reduceMotion?: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

export const Tile: React.FC<TileProps> = ({ isTurnedOn, className = '', highlighted, suggested = false, animationDelay, reduceMotion = false, onMouseEnter, onMouseLeave, onClick }) => {
  return (
    <motion.button
      type="button"
      data-testid="tile"
      data-lit={isTurnedOn}
      data-highlighted={highlighted}
      data-suggested={suggested}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      className={cn(
        'flex w-full aspect-square items-center justify-center rounded-sm text-xl font-semibold',
        !reduceMotion && 'transition-[background-color]',
        isTurnedOn ? 'bg-amber-300 text-amber-950' : 'bg-stone-700 text-stone-100',
        'border-[0.6vmin]',
        (highlighted && !reduceMotion) ? 'border-white' : 'border-transparent',
        className
      )}
      initial={{ x: 100, opacity: 0, rotateY: isTurnedOn ? 180 : 0 }}
      animate={{ rotateY: isTurnedOn ? 180 : 0, opacity: 1, x: 0 }}
      exit={{ x: -100, opacity: 0 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : {
              rotateY: { duration: 0.2, ease: 'easeOut' },
              x: { duration: 0.15, ease: 'easeInOut', delay: animationDelay },
              opacity: { duration: 0.15, ease: 'easeInOut', delay: animationDelay },
            }
      }
    >
      {suggested && <span className="block w-[25%] aspect-square rounded-full bg-red-500" />}
    </motion.button>
  );
};

export default Tile;
