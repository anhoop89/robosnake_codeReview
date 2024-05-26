import { MaybeCell, ScreenPart } from "./GameRunner";

export type Player = "A" | "B" | "C" | "D";

export type Motion = "up" | "down" | "left" | "right";

/* ---------------------------------------------------------------------/
 Created a class for AILearningMove. 
 Purpose: 
 1/   It helps the user could add or modify move options easily. 
 2/   In the agentMove, AIagent needs to pick which move option to do 
      by calling a function from this class.
      Example: 
      SnakeA wants to play the move like AI provides for snake B. That's
      AI knows in the 2nd move option. 
      **It calls:     AIForPlayerA.secondMoveOption(screenPart);
 3/   AI can switch move option. AI can call the same move option for
      two different players. 
 4/   Each object will handle their own data.
/-----------------------------------------------------------------------*/
export class AILearningMove {
  // C uses these moves in order, repeatedly
  private providedDirection: Motion[] = ["up", "up", "right", "down", "right"];
  // initialize trackingMotionIndex to keep them run from 0 to 4 to get a move from providedDirection
  private trackingMotionIndex: number = 0;

  //  First Move Option for AI
  public firstMoveOption(): Motion {
    //  Always move right
    return "right";
  }

  //  Second Move Option for AI
  public secondMoveOption(screenPart: ScreenPart): Motion {
    //  Always random move
    return randomMotion(screenPart);
  }

  //  Third Move Option for AI
  public thirdMoveOption(): Motion {
    //  theNextMove based on trackingMotionIden run through providedDirection
    const theNextMove: Motion =
      this.providedDirection[this.trackingMotionIndex];
    this.trackingMotionIndex++;
    this.trackingMotionIndex =
      this.trackingMotionIndex % this.providedDirection.length; // keep trackingMotionIndex in range of [0,4]
    return theNextMove;
  }

  //  Fourth Move Option for AI
  public fourthMoveOption(screenPart: ScreenPart): Motion {
    //  Go for any nearby apple, otherwise random move
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (screenPart[j][i] == "apple") {
          if (i > 3) return "right";
          else if (i < 3) return "left";
          else if (j > 3) return "down";
          else if (j < 3) return "up";
        }
      }
    }
    return randomMotion(screenPart);
  }
}

// screenPart is a 5x5 window with the agent in the center
// agentMove is a function to let AI help players for a move
// Each player will have their own AI.
// AI will have a collection of AI Learning Move, from there
//      AI could choose which move they decide to take a action.
export function agentMove(
  player: Player,
  screenPart: ScreenPart,
  AIForPlayerA: AILearningMove,
  AIForPlayerB: AILearningMove,
  AIForPlayerC: AILearningMove,
  AIForPlayerD: AILearningMove
): Motion {
  switch (player) {
    case "A": {
      return AIForPlayerA.firstMoveOption();
    }
    case "B": {
      return AIForPlayerB.secondMoveOption(screenPart);
    }
    case "C": {
      return AIForPlayerC.thirdMoveOption();
    }
    case "D": {
      return AIForPlayerD.fourthMoveOption(screenPart);
    }
  }
}

// function to check if the move's snake avoid to hit apples
function avoidHittingObstacle(x: Motion, part: ScreenPart): Motion {
  // try not to hit anything in a 5x5 window
  if (tryMove(x, part) != "apple" && tryMove(x, part) != "empty") {
    switch (x) {
      case "up":
        return "down";
      case "right":
        return "left";
      case "down":
        return "up";
      case "left":
        return "right";
    }
  }
  return x;
}

// we have 4 directions: up | down | left | right
// generate a random number with a condition to pick a random direction.
export function randomMotion(part: ScreenPart): Motion {
  const rnd: number = Math.random() * 4; // random float in the half-open range [0, 4)
  let x: Motion;
  if (rnd < 1) x = "up";
  else if (rnd < 2) x = "down";
  else if (rnd < 3) x = "left";
  else x = "right";
  return avoidHittingObstacle(x, part);
}

// coordinate each move based on left, right, up, down
function tryMove(m: Motion, p: ScreenPart): MaybeCell {
  // the snake is positioned in the center at p[2][2]
  switch (m) {
    case "left":
      return p[2][1];
    case "right":
      return p[2][3];
    case "up":
      return p[1][2];
    case "down":
      return p[3][2];
  }
}
