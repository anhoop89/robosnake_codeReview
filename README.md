```
Course: Code Review
Instructor: Katie Casamento
Submission by Anh Ho
November 18, 2022
```
# Robosnake

Welcome to Robosnake, a 4-player Snake game where each player is controlled by different AI agents. Users can program clever AI bots to compete against others. This repository contains prototype code that functions as intended, but has been refactored for improved readability, maintainability, and extensibility.

## Gameplay

- **No User Input:** All players are controlled by AI agents.
- **Turn-Based Movement:** Players move in a set order (A, B, C, D).
- **Board and Cells:** The game board is a square grid; each cell can be taken by a player or contain an apple.
- **Losing Conditions:** Players lose if they move into a taken cell or outside the board.
- **Winning:** The game ends when all players have lost. The winner is the player with the most apples.

## Agents

- **Restricted Vision:** Agents can only "see" a 5x5 region centered around their position.
- **Private State:** Each agent can maintain its own state.
- **Modular Code:** Agents are modularized for easy addition and modification.

## Refactoring Goals

### Extensibility
- Users can easily add new AI agents without modifying existing code.
- Change the AI agent for any player by modifying a single line of code per player.

### Readability and Maintainability
- Reduced code repetition and improved naming conventions.
- Abstracted repeated logic into reusable functions.

### Documentation
- Added TypeDoc comments for public parts of the code.
- Documentation on how to create and change AI agents is provided.

## Getting Started

1. **Clone the repository:**
   ```sh
   git clone https://github.com/anhoop89/robosnake.git
   cd robosnake
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Run the game:**
   ```sh
   npm start
   ```

4. **Generate documentation:**
   ```sh
   npm run docs
   ```

## How to Create a New Agent

1. Create a new agent file in the `src/agents` directory.
2. Implement the `agentMove` function according to the provided template.
3. Update the player configuration in `src/GameRunner.ts` to use the new agent.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
