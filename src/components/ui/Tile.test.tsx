/*
- each tile has the following properties:
  isTurnedOn: boolean;
  number?: number;
  className?: string;
  highlighted: boolean;
  animationDelay: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
- tile renders with the correct background color and text color based on the isTurnedOn property
- tile applies the highlighted class when the highlighted property is true
- tile calls the onMouseEnter handler and the css property updates correctly when the mouse enters the tile
- tile calls the onMouseLeave handler and the css property updates correctly when the mouse leaves the tile
- tile calls the onClick handler when the tile is clicked, this handler toggles the state and changes the background color
 onMouseLeave, and onClick handlers when the respective events occur
*/


import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import Tile from "./Tile";

const motionProps: Record<string, unknown> = {};
vi.mock("motion/react", () => ({
  motion: {
    button: ({ initial, animate, exit, transition, children, ...rest }: any) => {
      Object.assign(motionProps, { initial, animate, exit, transition });
      return <button {...rest}>{children}</button>;
    },
  },
}));

const setup = (props = {}) => {
  const defaultProps = {
    index: 0,
    isTurnedOn: false,
    highlighted: false,
    suggested: false,
    row: 0,
    col: 0,
    animationDelay: 0,
    onMouseEnter: vi.fn(),
    onMouseLeave: vi.fn(),
    onClick: vi.fn(),
  };

  const utils = render(<Tile {...defaultProps} {...props} />);

  return {
    ...utils,
    // re-render the same tile with some props changed
    update: (newProps = {}) =>
      utils.rerender(<Tile {...defaultProps} {...props} {...newProps} />),
  };
};

describe("Tile", () => {
	it('renders with no highlight by default', () => {
		setup();
		const tile = screen.getByRole('button');
		expect(tile).toHaveClass('border-transparent');
	});

	it('renders with highlight when highlighted is true', () => {
		setup({ highlighted: true });
		const tile = screen.getByRole('button');
		expect(tile).not.toHaveClass('border-transparent');
	});

	it('renders with suggested highlight when suggested is true', () => {
		setup({ suggested: true });
		const tile = screen.getByRole('button');
		expect(tile.querySelector('span')).toBeInTheDocument();
	});

	it('renders with the correct colors when isTurnedOn is true', () => {
		setup({ isTurnedOn: true });
		const tile = screen.getByRole('button');
		expect(tile).toHaveClass('bg-amber-300 text-amber-950');
	});

	it('renders with the correct colors when isTurnedOn is false', () => {
		setup({ isTurnedOn: false });
		const tile = screen.getByRole('button');
		expect(tile).toHaveClass('bg-stone-700 text-stone-100');
	});

	// we just want to verify that the motion component recieves some initial
	// animation props, so the actual animation can be tweaked without breaking tests
	it('animates entering when rendered', () => {
		setup();
		expect(motionProps.initial).toBeDefined();
		expect(motionProps.animate).toBeDefined();
		expect(motionProps.initial).not.toEqual(motionProps.animate);
	});

	// same idea for exiting
	it('animates exiting when unmounted', () => {
		const { unmount } = setup();
		unmount();
		expect(motionProps.animate).toBeDefined();
		expect(motionProps.exit).toBeDefined();
		expect(motionProps.exit).not.toEqual(motionProps.animate);
	});

	it('transitions rotateY when updated from on to off', () => {
		const { update } = setup({ isTurnedOn: true });

		expect((motionProps.animate as any).rotateY).toBe(180);

		update({ isTurnedOn: false });

		expect((motionProps.animate as any).rotateY).toBe(0);
		expect((motionProps.transition as any).rotateY).toBeDefined();
	});

	it('transitions rotateY when updated from off to on', () => {
		const { update } = setup({ isTurnedOn: false });

		expect((motionProps.animate as any).rotateY).toBe(0);

		update({ isTurnedOn: true });

		expect((motionProps.animate as any).rotateY).toBe(180);
		expect((motionProps.transition as any).rotateY).toBeDefined();
	});
});
