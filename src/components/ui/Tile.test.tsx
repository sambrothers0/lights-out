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