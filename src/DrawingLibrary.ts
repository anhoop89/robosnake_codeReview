/* eslint-disable @typescript-eslint/no-implied-eval */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

let timeoutId: number | null = null;
export function scheduleNextUpdate(milliseconds: number, update: () => any): void {
  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = setTimeout(<TimerHandler> update, milliseconds);
}

export const canvas: CanvasRenderingContext2D =
  (<HTMLCanvasElement> document.getElementById("gameScreen")).getContext("2d")!;

export function resetCanvas(): void {
  if (timeoutId) clearTimeout(timeoutId);
  canvas.scale(1, 1);
  canvas.fillStyle = "white";
  canvas.fillRect(0, 0, 500, 500);
}

const CELL_SIZE = 10;

export function fillCell(
  color: string,
  left: number,
  top: number
): void {
  canvas.fillStyle = color;
  canvas.fillRect(left*CELL_SIZE, top*CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

// function to update "lost" status for players
export function updateLost(
  player: "A" | "B" | "C" | "D",
  lost: boolean
): void {
  document.getElementById("lost" + player)!.innerText = lost.toString();
}

// function to update the number of apples that players currently have
export function updateApples(
  player: "A" | "B" | "C" | "D",
  apples: number
): void {
  document.getElementById("apples" + player)!.innerText = apples.toString();
}