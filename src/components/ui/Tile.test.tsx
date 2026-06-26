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
		expect(tile).toHaveAttribute('data-highlighted', 'false');
	});

	it('renders with highlight when highlighted is true', () => {
		setup({ highlighted: true });
		const tile = screen.getByRole('button');
		expect(tile).toHaveAttribute('data-highlighted', 'true');
	});

	it('renders with suggested highlight when suggested is true', () => {
		setup({ suggested: true });
		const tile = screen.getByRole('button');
		expect(tile.querySelector('span')).toBeInTheDocument();
	});

	it('renders with the correct colors when isTurnedOn is true', () => {
		setup({ isTurnedOn: true });
		const tile = screen.getByRole('button');
		expect(tile).toHaveAttribute('data-lit', 'true');
	});

	it('renders with the correct colors when isTurnedOn is false', () => {
		setup({ isTurnedOn: false });
		const tile = screen.getByRole('button');
		expect(tile).toHaveAttribute('data-lit', 'false');
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
