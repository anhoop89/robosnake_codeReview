import { resetCanvas, updateApples, updateLost } from "./DrawingLibrary";
import { run } from "./GameRunner";
import { initialize } from "./GameScreen";

export function play(): void {
  // clean screen
  resetCanvas();
  // initialize players status and intial number of apples each player has
  updateLost("A", false); updateApples("A", 0);
  updateLost("B", false); updateApples("B", 0);
  updateLost("C", false); updateApples("C", 0);
  updateLost("D", false); updateApples("D", 0);
  const screen = initialize(50);
  //start the game
  run(1000, 10, screen);
}