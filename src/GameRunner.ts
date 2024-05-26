import { AILearningMove, Motion, agentMove, Player } from "./Agent";
import { scheduleNextUpdate, updateApples, updateLost } from "./DrawingLibrary";
import { Cell, draw, GameScreen } from "./GameScreen";

// a MaybeCell is either a Cell or the string "outside"
export type MaybeCell = Cell | "outside";

// a ScreenPart is a 5x5 array of MaybeCell arrays
export type ScreenPart = MaybeCell[][];

export class Point {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
// SnakeState class keeps track of # of apples and status of snake
// it's derived from Point class which has x and y coordinates for location.
export class SnakeState extends Point {
  public apples: number;
  public lost: boolean;

  constructor(x: number, y: number) {
    super(x, y); // call Point constructor to set x and y
    this.apples = 0;
    this.lost = false;
  }

  public setPoint(p: Point): void {
    this.x = p.x;
    this.y = p.y;
  }
}

// x and y are the left and top coordinate of a 5x5 square region.
// cells outside the bounds of the board are represented with "outside"
export function getScreenPart(screen: GameScreen, s: SnakeState): ScreenPart {
  const part: ScreenPart = new Array<MaybeCell[]>(5);
  for (let j = 0; j < 5; j++) {
    part[j] = new Array<MaybeCell>(5);
    for (let i = 0; i < 5; i++) {
      //  outside of the boundry
      //  checking part of the screen
      if (
        s.x + i - 2 >= 0 && // snake head horiotional + i is between 0 and 4 - center to the right of left side of region
        s.y - 2 + j >= 0 &&
        s.x - 2 + i < screen.length &&
        s.y - 2 + j < screen.length
      )
        part[j][i] = screen[s.y + j - 2][s.x + i - 2];
      else part[j][i] = "outside";
    }
  }
  return part;
}

//   *********This "RUN" is to start the game!************
export function run(
  //   StepTime is a number of milliseconds
  stepTime: number,
  newApplesEachStep: number,
  screen: GameScreen
): void {
  //  Allocate memory for each object of AI for player
  //  It helps them run sperately and doesn't have to conflicts or share data like cIndex
  //  Avoid global data members as much as possible
  //  create AI brains which can learn move options provided from AILearningMove Class
  const AIForPlayerA = new AILearningMove();
  const AIForPlayerB = new AILearningMove();
  const AIForPlayerC = new AILearningMove();
  const AIForPlayerD = new AILearningMove();
  //  Player initial positions
  const a = new SnakeState(0, 0);
  const b = new SnakeState(screen.length - 1, 0);
  const c = new SnakeState(0, screen.length - 1);
  const d = new SnakeState(screen.length - 1, screen.length - 1);

  //  Draw starting screen
  screen[a.y][a.x] = "A";
  screen[b.y][b.x] = "B";
  screen[c.y][c.x] = "C";
  screen[d.y][d.x] = "D";
  draw(screen);

  // this will wait for stepTime milliseconds and then call step with these arguments
  scheduleNextUpdate(stepTime, () =>
    step(
      stepTime,
      newApplesEachStep,
      screen,
      a, b, c, d,
      AIForPlayerA,
      AIForPlayerB,
      AIForPlayerC,
      AIForPlayerD
    )
  );
  // the "() =>" part is important!
  // without it, step will get called immediately instead of waiting
}

function locationAfterMotion(motion: Motion, snake: SnakeState): Point {
  switch (motion) {
    case "left":
      return new Point(snake.x - 1, snake.y);
    case "right":
      return new Point(snake.x + 1, snake.y);
    case "up":
      return new Point(snake.x, snake.y - 1);
    case "down":
      return new Point(snake.x, snake.y + 1);
  }
}

//  checking whether snake hits the edge or not
function hittingEdgeOrNot(newPosition: Point, screen: GameScreen): boolean {
  // hit the edge of the screen
  if (
    newPosition.x < 0 ||
    newPosition.y < 0 ||
    newPosition.x >= screen.length ||
    newPosition.y >= screen.length
  )
    return true; //   hit the edge
  return false; //   Don't hit the edge
}

function updatingStatusEatingApples(
  snake: SnakeState,
  newPosition: Point,
  player: Player,
  screen: GameScreen
): SnakeState {
  switch (screen[newPosition.y][newPosition.x]) {
    case "empty": {
      // make the move
      snake.setPoint(newPosition);
      screen[newPosition.y][newPosition.x] = player;
      break;
    }
    case "apple": {
      // make the move and eat the apple
      snake.setPoint(newPosition);
      snake.apples++;
      screen[newPosition.y][newPosition.x] = player;
      break;
    }
    default: {
      // lose
      snake.lost = true;
      break;
    }
  }
  return snake;
}

//  checkingMoveForSnake is a function to check a new move position of a snake
//  it will update "lose" status and "eating apples" status.
function checkingMoveForSnake(
  snake: SnakeState,
  player: Player,
  screen: GameScreen,
  AIForPlayerA: AILearningMove,
  AIForPlayerB: AILearningMove,
  AIForPlayerC: AILearningMove,
  AIForPlayerD: AILearningMove
): SnakeState {
  // checking border of the screen surrond for 5x5
  const checkingScreenBorder = getScreenPart(screen, snake);
  //  AI will use their brain to determine which option move they want to execute for snake in a 5x5 area
  const AIchooseAMove = agentMove(
    player,
    checkingScreenBorder,
    AIForPlayerA,
    AIForPlayerB,
    AIForPlayerC,
    AIForPlayerD
  );
  //  newPosition is a new position applied on the current snake's position.
  const newPosition = locationAfterMotion(AIchooseAMove, snake);

  if (hittingEdgeOrNot(newPosition, screen))
    //  hit the edge of the screen - the snake will lose
    snake.lost = true;
  //  it will update "lose" status and "eating apples" status.
  else snake = updatingStatusEatingApples(snake, newPosition, player, screen);
  return snake;
}

// Generate Apples On Screen
function generateAppleOnScreen(
  newApplesEachStep: number,
  screen: GameScreen
): void {
  // generate new apples
  for (let i = 0; i < newApplesEachStep; i++) {
    // random integers in the closed range [0, screen.length]
    const x = Math.floor(Math.random() * screen.length);
    const y = Math.floor(Math.random() * screen.length);
    // if we generated coordinates that aren't empty, skip this apple
    if (screen[y][x] == "empty") screen[y][x] = "apple";
  }
}

// it will check the area of the screen and generate appples
// step function to check which moves for a snake
// the move of each snake will be executed from AI brain(agents)
// Since we have 4 snakes, there should 4 AIs to be responsible for each snake's move.
export function step(
  stepTime: number,
  newApplesEachStep: number,
  screen: GameScreen,
  snakeA: SnakeState,
  snakeB: SnakeState,
  snakeC: SnakeState,
  snakeD: SnakeState,
  AIForPlayerA: AILearningMove,
  AIForPlayerB: AILearningMove,
  AIForPlayerC: AILearningMove,
  AIForPlayerD: AILearningMove
): void {
  // Generate Apples On Screen
  generateAppleOnScreen(newApplesEachStep, screen);

  // players take turns in order: A -> B -> C -> D -> A -> B -> C -> D -> ...
  // note: newPosition is a new position after making a move.
  // checking move when it's not lost
  // Write a function to handle for checking a move for each snake

  // if the snake is alive, we are going to check their move.
  if (!snakeA.lost) {
    snakeA = checkingMoveForSnake(
      snakeA, "A",screen,
      AIForPlayerA,
      AIForPlayerB,
      AIForPlayerC,
      AIForPlayerD
    );
  }

  if (!snakeB.lost) {
    snakeB = checkingMoveForSnake(
      snakeB, "B", screen,
      AIForPlayerA,
      AIForPlayerB,
      AIForPlayerC,
      AIForPlayerD
    );
  }

  if (!snakeC.lost) {
    snakeC = checkingMoveForSnake(
      snakeC,"C", screen,
      AIForPlayerA,
      AIForPlayerB,
      AIForPlayerC,
      AIForPlayerD
    );
  }

  if (!snakeD.lost) {
    snakeD = checkingMoveForSnake(
      snakeD, "D", screen,
      AIForPlayerA,
      AIForPlayerB,
      AIForPlayerC,
      AIForPlayerD
    );
  }

  // update game screen
  draw(screen);

  // update snake statistics - status of snake "lost" return true.
  // update how many apples each snake ate.
  updateLost("A", snakeA.lost);
  updateApples("A", snakeA.apples);
  updateLost("B", snakeB.lost);
  updateApples("B", snakeB.apples);
  updateLost("C", snakeC.lost);
  updateApples("C", snakeC.apples);
  updateLost("D", snakeD.lost);
  updateApples("D", snakeD.apples);

  // run again unless everyone has lost
  if (!snakeA.lost || !snakeB.lost || !snakeC.lost || !snakeD.lost)
    scheduleNextUpdate(stepTime, () =>
      step(
        stepTime,
        newApplesEachStep,
        screen,
        snakeA,
        snakeB,
        snakeC,
        snakeD,
        AIForPlayerA,
        AIForPlayerB,
        AIForPlayerC,
        AIForPlayerD
      )
    );
}
