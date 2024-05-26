# Robosnake

This is an implementation of a 4-player [Snake](https://en.wikipedia.org/wiki/Snake_(video_game_genre)) game, where each player is controlled by a different piece of AI code.

(The AI code is very, **very** basic! You will be able to understand this codebase even if you've never studied AI.)

You are a developer at an organization that wants to ship this game to users. People will "play" the game by trying to program clever AI agents (or "bots") to compete against other people's AI agents.

This repository currently contains prototype code which works as intended, but the code is not very readable or maintainable. Your job is to refactor the codebase so that it's easier to extend with new features.


## Gameplay

There is no user input in the game: the keyboard and mouse do not do anything. All four players are controlled by AI agent code. The "Run game" button starts the game.

The game board is a square grid of square cells, drawn below the "Statistics" table. The cells on the grid are the "pixels" on the "screen" that displays the game.

Each player is represented by a different color on the board: A is green, B is blue, C is orange, and D is purple.

Each player starts in a different corner of the game board. On a player's turn, they are allowed to move into any cell adjacent to their current position.

The players take turns in order: A moves first, then B, C, D, and then A again (and so on). The game screen updates the position of every player simultaneously, but if two players try to move into the same cell, the "tie" is broken by turn order.

When a player moves into a cell, the player takes that cell. To indicate this, the cell changes to display the color of the player.

A cell may contain an apple, which is indicated by the color red. In the "Statistics" table, each player has a counter of how many apples they've taken. After each round of turns, new apples are added to the board in random unoccupied cells.

A player loses if they try to move into a cell that has already been taken, or if they try to move outside the boundaries of the game board. This includes if an AI agent tries to move "backwards" (in the opposite direction as its previous move).

The game is over when all players have lost. The "winner" is the player with the highest apples counter at the end of the game.


## Agents

The AI agents cannot "see" the entire board: on their turn, they can only "see" a 5x5 region of cells centered around their current position.

This restriction is implemented in the type of the `agentMove` function, which controls the AI's behavior on each move. This function is not given access to the data of the whole board: it's only given access to the data of the 5x5 region that the current player should be able to "see".

When users are playing the game by writing agents, each agent can do whatever it wants with the region that it can "see": it may run any kind of algorithm over the data structure, or even ignore it altogether.

Each agent should be able to keep its own "private" state, but this is currently not implemented: the hard-coded behavior for C depends on some global variables.


## The codebase

The codebase is organized into multiple modules within the `src` folder:
- `DrawingLibrary.ts` is a library which is used by the rest of the code. You **should not modify** this file: it's owned by a different team of developers.
- `GameScreen.ts` defines the `Cell` and `GameScreen` types, which represent "pixels" on the "game board".
- `GameRunner.ts` defines the rules of the game, but **not** the behavior of the AI players.
- `Agent.ts` defines the behavior of each AI player.


## Requirements

You **may** change any file in any way, **except**:
- `DrawingLibrary.ts`, `Main.ts`, and `index.html` which are owned by different teams in this organization. Your refactored code must work with exactly the provided versions of these files.
- `.eslintignore`, `.eslintrc.js`, and the `.vscode` folder, which are the settings that our whole organization uses. For the same reason, you should not add `eslint-ignore` comments in any files.
- `package.json`, `tsconfig.json`, `webpack.config.js`, which are the build settings that this whole project uses.

All of the other files in the codebase are your responsibility. Except for the files listed above, you can change any of the code, and you can add, rename, move, or delete any files and folders.

You **must not** change the rules of the game: your code should "play" the same as the original provided code, when using the original AI agent logic.

You may organize your refactored code however you want, as long as you can argue that it makes the codebase extensible, readable, and maintainable. You are not required to use object-oriented techniques, but they may be a good fit for some parts of your code.

You **should not** need any features of TypeScript except the ones that we've covered in lecture, but you **may** use any TypeScript features that you want.


## Goals

### Extensibility

We want to make it as easy as possible for people to create new AI agents in this codebase. Ideally, users should be able to **add** new kinds of AI players into the game just by **adding new** code: they should not have to modify any of the existing code.

To **change** the AI agent that controls an individual player, the user should have to **change exactly one line** of existing code. (They may have to change up to four lines in order to change the agents for all four players.) This is a firm requirement, so try to plan your refactoring with this requirement in mind.

These are the primary goals of your refactoring. These changes will make the code more extensible, so that users can "play" the game more easily.

Right now, there are four AI agents implemented in the code: players `A`, `B`, `C`, and `D` are each hard-coded to have unique behavior.

Your first task should be to separate these four AI agents into reusable pieces of code, so that it's easy to change which AI agent controls each player. Your code should also support running the game using a single AI agent for more than one player, with a separate state for each player that it controls.

For example, the provided agent code for `C` will not work correctly if it's used for two different players at once, because both copies of the code will modify the same global `cIndex` variable. In your refactoring, you should make it easier to write a version of the `C` code that works correctly when used for two different players.

### Readability and maintainability

The provided code has some definite readability and maintainability issues: there is a lot of repeated code that should be abstracted, and a lot of the naming is not very clear.

While you're refactoring the code, you should try to address these issues. In general, you should try to "clean up" this codebase in any way that you can think of. Your refactoring will be the basis of this codebase as we grow it with more features in the future.

### Documentation

The provided code has some comments, which are written to help **you** and the other developers in this organization.

Remember that the users of this game will be writing code themselves, to program AI agents. The provided code does not come with any comments designed to help these users.

Specifically, the user will need documentation to know how to create a new agent, and how they can change the agent that controls a player.

(The goal is not teach the user how to **win** at the game, just how to **play** the game: you should not try to explain how to write good AI code, just explain how to extend the code that you're providing.)

The user **will not read your code** directly: they will only read the HTML pages generated by `npm run docs`, in their web browser starting from `docs/index.html`.

You should provide TypeDoc comments for any public parts of your code that are not self-documenting on these HTML pages. You can assume that the user already knows TypeScript well, and that they will read all of your documentation (not just one part).