/*
- gameboard begins in an initial state that is solvable
- gameboard mounts in the correct shape and size based on the difficulty
    - easy: 4x4
    - normal: 5x5
    - hard: 7x7
- gameboard is an array of tile objects with the correct properties
- hovering over a tile highlights the correct tiles
- clicking a tile toggles the correct tiles
- winning the game does the following:
    - triggers the win state in the parent component
    - disables hovering and clicking on the gameboard

*/

import { render, screen } from "@testing-library/react";
import GameBoard from "./gameBoard";

beforeEach(() => {
  render(<GameBoard />);
});

describe("GameBoard", () => {
  it("renders the game board in the DOM", () => {
    expect(screen.getByTestId("game-board")).toBeInTheDocument();
  });
});
