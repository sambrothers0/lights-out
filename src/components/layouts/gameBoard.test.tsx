import { solveBoard } from "@/util/solveBoard";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GameBoard from "./gameBoard";
import { readBoard } from "@/util/readBoard";
import { BOARD_SIZES, WIN_SCREEN_DELAY} from "@/constants";

const setup = () => {
  render(<GameBoard/>);
};

const tileCount = (difficulty: keyof typeof BOARD_SIZES) =>
  BOARD_SIZES[difficulty] ** 2;

describe("GameBoard", () => {
  it("renders the game board in the DOM", () => {
    setup();
    expect(screen.getByTestId("game-board")).toBeInTheDocument();
  });

  it(`difficulty button renders with the correct text,
    pressing it changes the board size and resets a new board`, async () => {
    setup();
    const user = userEvent.setup();

    // the board is wrapped in <AnimatePresence mode="wait">, so the new board
    // only mounts once the old one finishes its exit animation — wait for it.
    const expectBoard = (difficulty: keyof typeof BOARD_SIZES) => {
      expect(screen.getByTestId(/difficulty/i)).toHaveTextContent(
        new RegExp(difficulty, "i")
      );
      return waitFor(() =>
        expect(screen.getAllByTestId("tile")).toHaveLength(tileCount(difficulty))
      );
    };

    await expectBoard("Normal");

    await user.click(screen.getByTestId(/difficulty/i));
    await expectBoard("Hard");

    await user.click(screen.getByTestId(/difficulty/i));
    await expectBoard("Easy");

    // check that a full cycle returns to the original state
    await user.click(screen.getByTestId(/difficulty/i));
    await expectBoard("Normal");
  });

  it(`reset button renders with the correct text
    pressing it resets the board to a new random state`, async () => {
    setup();
    const user = userEvent.setup();
    const litPattern = () =>
      screen.getAllByTestId("tile").map(tile => tile.dataset.lit).join("");
    const initialPattern = litPattern();

    expect(screen.getByTestId(/reset/i)).toBeInTheDocument();
    await user.click(screen.getByTestId(/reset/i));
    // the new board only mounts after the old one's exit animation completes
    await waitFor(() => expect(litPattern()).not.toEqual(initialPattern));

    const moveCount = screen.getByTestId("move-count");
    expect(moveCount).toHaveTextContent(/0/i);
  });

  it(`solution button highlights the buttons with the fewest possible
    moves to solve the board, clicking a suggested or non suggested tile
    updates suggested correctly`, async () => {
    setup();
    const user = userEvent.setup();

    // check that there are no red markers or outlines in the tile to start
    const tiles = screen.getAllByTestId("tile")
    expect(tiles.every(tile => tile.dataset.suggested === "false")).toBe(true);

    expect(screen.getByTestId(/solution/i)).toBeInTheDocument();
    await user.click(screen.getByTestId(/solution/i));

    // suggested must always equal solveBoard's answer for the current board
    const expectSuggestedToMatchSolution = () => {
      const tiles = screen.getAllByTestId("tile");
      const size = Math.round(Math.sqrt(tiles.length));
      const solutionIndices = new Set(
        [...solveBoard(readBoard(tiles))].map(move => move.r * size + move.c)
      );
      const suggestedIndices = tiles.flatMap((tile, i) =>
        tile.dataset.suggested === "true" ? [i] : []
      );
      expect(suggestedIndices.length).toEqual(solutionIndices.size);
      expect(suggestedIndices.every(i => solutionIndices.has(i))).toBe(true);
    };

    // every suggested tile matches the solution
    expectSuggestedToMatchSolution();

    // clicking a random suggested tile updates suggested to the new solution
    const suggestedIndices = screen
      .getAllByTestId("tile")
      .flatMap((tile, i) => (tile.dataset.suggested === "true" ? [i] : []));
    const randomSuggested = suggestedIndices[Math.floor(Math.random() * suggestedIndices.length)];
    await user.click(screen.getAllByTestId("tile")[randomSuggested]);
    expectSuggestedToMatchSolution();

    // clicking a random non-suggested tile updates suggested to the new solution
    const stillSuggested = new Set(
      screen.getAllByTestId("tile").flatMap((tile, i) =>
        tile.dataset.suggested === "true" ? [i] : []
      )
    );
    const nonSuggestedIndices = screen
      .getAllByTestId("tile")
      .flatMap((_, i) => (stillSuggested.has(i) ? [] : [i]));
    const randomNonSuggested = nonSuggestedIndices[Math.floor(Math.random() * nonSuggestedIndices.length)];
    await user.click(screen.getAllByTestId("tile")[randomNonSuggested]);
    expectSuggestedToMatchSolution();
  });

  it(`the move counter correctly tracks the 
    number of times some tile has been clicked`, async () => {
    setup();
    const user = userEvent.setup();
    const moveCount = screen.getByTestId("move-count");
    expect(moveCount).toHaveTextContent(/0/i);

    const n = Math.floor(Math.random() * 10) + 1;
    const tiles = screen.getAllByTestId("tile");
    for (let i = 0; i < n; i++) {
      const randomTile = tiles[Math.floor(Math.random() * tiles.length)];
      await user.click(randomTile);
    }
    expect(moveCount).toHaveTextContent(new RegExp(n.toString()));
  });

  it(`highlights the appropriate tiles when any of the corner tiles are hovered/unhovered`, async () => {
    setup();
    const user = userEvent.setup();
    const tiles = screen.getAllByTestId("tile");
    const size = Math.round(Math.sqrt(tiles.length));

    const corners = [0, size - 1, size * (size - 1), size * size - 1];
    for (const corner of corners) {
      await user.hover(tiles[corner]);
      const highlighted = tiles.filter(tile => tile.dataset.highlighted === "true");
      expect(highlighted).toHaveLength(3);
      expect(highlighted).toContain(tiles[corner]);
      if (corner === 0) { // top left
        expect(highlighted).toContain(tiles[1]);
        expect(highlighted).toContain(tiles[size]);
      } else if (corner === size - 1) { // top right
        expect(highlighted).toContain(tiles[size - 2]);
        expect(highlighted).toContain(tiles[2 * size - 1]);
      } else if (corner === size * (size - 1)) { // bottom left
        expect(highlighted).toContain(tiles[size * (size - 2)]);
        expect(highlighted).toContain(tiles[size * (size - 1) + 1]);
      } else if (corner === size * size - 1) { // bottom right
        expect(highlighted).toContain(tiles[size * (size - 1) - 1]);
        expect(highlighted).toContain(tiles[size * size - 2]);
      }
      await user.unhover(tiles[corner]);
      expect(tiles.every(tile => tile.dataset.highlighted === "false")).toBe(true);
    }
  });

  it(`highlights the appropriate tiles when any of the edge (non-corner) tiles are hovered/unhovered`, async () => {
    setup();
    const user = userEvent.setup();
    const tiles = screen.getAllByTestId("tile");
    const size = Math.round(Math.sqrt(tiles.length));

    // hover each edge (non-corner) tile and check highlights
    for (let i = 0; i < tiles.length; i++) {
      const row = Math.floor(i / size);
      const col = i % size;
      if (row === 0 || row === size - 1 || col === 0 || col === size - 1) { // edge tile
        if (i !== 0 && i !== size - 1 && i !== size * (size - 1) && i !== size * size - 1) { // not corner
          await user.hover(tiles[i]);
          const highlighted = tiles.filter(tile => tile.dataset.highlighted === "true");
          expect(highlighted).toHaveLength(4);
          expect(highlighted).toContain(tiles[i]);
          if (row === 0) { // top edge
            expect(highlighted).toContain(tiles[i - 1]);
            expect(highlighted).toContain(tiles[i + 1]);
            expect(highlighted).toContain(tiles[i + size]);
          } else if (row === size - 1) { // bottom edge
            expect(highlighted).toContain(tiles[i - 1]);
            expect(highlighted).toContain(tiles[i + 1]);
            expect(highlighted).toContain(tiles[i - size]);
          } else if (col === 0) { // left edge
            expect(highlighted).toContain(tiles[i - size]);
            expect(highlighted).toContain(tiles[i + size]);
            expect(highlighted).toContain(tiles[i + 1]);
          } else if (col === size - 1) { // right edge
            expect(highlighted).toContain(tiles[i - size]);
            expect(highlighted).toContain(tiles[i + size]);
            expect(highlighted).toContain(tiles[i - 1]);
          }
          await user.unhover(tiles[i]);
          expect(tiles.every(tile => tile.dataset.highlighted === "false")).toBe(true);
        }
      }
    }
  });

  it(`highlights the appropriate tiles when any of the inner (non-edge) tiles are hovered/unhovered`, async () => {
    setup();
    const user = userEvent.setup();
    const tiles = screen.getAllByTestId("tile");
    const size = Math.round(Math.sqrt(tiles.length));

    // hover each inner (non-edge) tile and check highlights
    for (let i = 0; i < tiles.length; i++) {
      const row = Math.floor(i / size);
      const col = i % size;
      if (row > 0 && row < size - 1 && col > 0 && col < size - 1) { // inner tile
        await user.hover(tiles[i]);
        const highlighted = tiles.filter(tile => tile.dataset.highlighted === "true");
        expect(highlighted).toHaveLength(5);
        expect(highlighted).toContain(tiles[i]);
        expect(highlighted).toContain(tiles[i - size]); // above
        expect(highlighted).toContain(tiles[i + size]); // below
        expect(highlighted).toContain(tiles[i - 1]); // left
        expect(highlighted).toContain(tiles[i + 1]); // right
        await user.unhover(tiles[i]);
        expect(tiles.every(tile => tile.dataset.highlighted === "false")).toBe(true);
      }
    }
  });

  it(`when all tiles are turned off, the win screen appears.
    then play again button is clicked, the popup disappears,
    the board resets to a new random state, waits for a timeout
    until its exit animation has finished on de-render, and then
    the move counter resets to 0`, async () => {
    setup();
    const user = userEvent.setup();

    // win the game by playing the solver's moves (this also bumps the counter)
    const tiles = screen.getAllByTestId("tile");
    const size = Math.round(Math.sqrt(tiles.length));
    const solution = solveBoard(readBoard(tiles));
    for (const move of solution) {
      await user.click(tiles[move.r * size + move.c]);
    }

    const playAgain = await screen.findByRole(
      "button",
      { name: /play again/i },
      { timeout: WIN_SCREEN_DELAY + 1000 }
    );
    // the board is solved, so every tile is off right before resetting
    expect(
      screen.getAllByTestId("tile").every(tile => tile.dataset.lit === "false")
    ).toBe(true);

    await user.click(playAgain);

    // the "You Win" popup disappears
    await waitFor(() =>
      expect(screen.queryByText(/you win/i)).not.toBeInTheDocument()
    );

    // the board resets to a new, non-solved random state
    await waitFor(() =>
      expect(
        screen.getAllByTestId("tile").some(tile => tile.dataset.lit === "true")
      ).toBe(true)
    );

    // after the reset timeout the move counter returns to 0
    await waitFor(() =>
      expect(screen.getByTestId("move-count")).toHaveTextContent(/moves - 0/i)
    );
  });
})