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
import userEvent from "@testing-library/user-event";
import GameBoard, { boardSizes } from "./gameBoard";
import ParseBoard from "@/util/parseBoard";

const setup = () => {
  render(<GameBoard/>);
};

const tileCount = (difficulty: keyof typeof boardSizes) =>
  boardSizes[difficulty] ** 2;

describe("GameBoard", () => {
  it("renders the game board in the DOM", () => {
    setup();
    expect(screen.getByTestId("game-board")).toBeInTheDocument();
  });

  it(`difficulty button renders with the correct text,
    pressing it changes the board size and resets a new board`, () => {
    setup();
    const user = userEvent.setup();

    expect(screen.getByTestId(/difficulty/i)).toHaveTextContent(/normal/i);
    expect(screen.getAllByTestId("tile")).toHaveLength(tileCount("Normal"));

    user.click(screen.getByTestId(/difficulty/i));
    expect(screen.getByTestId(/difficulty/i)).toHaveTextContent(/hard/i);
    expect(screen.getAllByTestId("tile")).toHaveLength(tileCount("Hard"));

    user.click(screen.getByTestId(/difficulty/i));
    expect(screen.getByTestId(/difficulty/i)).toHaveTextContent(/easy/i);
    expect(screen.getAllByTestId("tile")).toHaveLength(tileCount("Easy"));

    // check that a full cycle returns to the original state
    user.click(screen.getByTestId(/difficulty/i));
    expect(screen.getByTestId(/difficulty/i)).toHaveTextContent(/normal/i);
    expect(screen.getAllByTestId("tile")).toHaveLength(tileCount("Normal"));
  });

  // it(`reset button renders with the correct text
  //   pressing it resets the board to a new random state`, () => {
    
  // })
})
