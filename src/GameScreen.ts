import { Player } from "./Agent";
import { fillCell } from "./DrawingLibrary";

// a Cell is either a Player or the string "empty" or "apple"
export type Cell = Player | "empty" | "apple";

// a GameScreen is an array of Cell arrays
export type GameScreen = Cell[][]; // row-major order, should always have square dimensions

export function initialize(size: number): GameScreen {
  const screen = new Array<Cell[]>(size);
  for (let i = 0; i < size; i++)
    screen[i] = new Array<Cell>(size).fill("empty");
  return screen;
}

// draw objects on screen based on colors through x y coordinates.
export function draw(screen: GameScreen): void {
  for (let y = 0; y < screen.length; y++) {
    for (let x = 0; x < screen.length; x++) {
      switch (screen[y][x]) {
        case "empty":
          fillCell("white", x, y);
          break;

        case "apple":
          fillCell("red", x, y);
          break;

        case "A":
          fillCell("green", x, y);
          break;

        case "B":
          fillCell("blue", x, y);
          break;

        case "C":
          fillCell("orange", x, y);
          break;

        case "D":
          fillCell("purple", x, y);
          break;
      }
    }
  }
}