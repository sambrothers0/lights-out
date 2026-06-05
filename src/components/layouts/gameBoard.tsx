import Tile from "@/components/ui/Tile";
// import Model from "@/model/Model";

const BOARD_SIZE = 5;
const ROWS = Array.from({ length: BOARD_SIZE }, (_, row) => row);
const COLS = Array.from({ length: BOARD_SIZE }, (_, col) => col);

interface TileData {
  number: number;
  row: number;
  col: number;
}

const TILES: TileData[] = ROWS.flatMap((row) =>
  COLS.map((col) => ({
    number: row * BOARD_SIZE + col + 1,
    row,
    col,
  }))
);

interface GameBoardProps {
  className?: string;
}

export const GameBoard = ({ className = '' }: GameBoardProps) => {
  return (
    <div className={`grid grid-cols-5 gap-4 w-full h-full ${className}`}>
      {TILES.map((tile) => (
        <Tile key={tile.number} state="off" number={tile.number}/>
      ))}
    </div>
  );
};

export default GameBoard;
