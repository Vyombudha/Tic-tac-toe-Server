# Tic-Tac-Toe Game Server

A simple Express.js backend server for playing Tic-Tac-Toe games with state management.

## Overview

This server manages multiple concurrent Tic-Tac-Toe games, each identified by a unique game ID. It handles move validation, win detection, and automatic game resets.

## Getting Started

Install dependencies and start the server:

```bash
npm install express
node index.js
```

The server runs on port 3455 at `http://localhost:3455`.

## API Endpoint

**POST** `/tic_tac_toe/:id`

Make a move in a game identified by `:id`.

### Request Body

```json
{
  "move": 0
}
```

The `move` field should be a number from 0 to 8, representing board positions:

```
0 | 1 | 2
---------
3 | 4 | 5
---------
6 | 7 | 8
```

### Response

```json
{
  "board": ["X", " ", " ", " ", "O", " ", " ", " ", " "],
  "winner": null
}
```

The `winner` field returns `"X"`, `"O"`, `"Draw"`, or `null` if the game continues.

## Game Rules

- Player X always starts first
- Players alternate turns automatically
- The server validates moves and prevents invalid placements
- Games automatically reset after a win or draw
- Each game ID maintains its own independent state

## CORS

The server accepts requests from any origin with appropriate CORS headers configured.
