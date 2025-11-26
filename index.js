import express from "express";

const app = express();
const PORT = 3455;


const gameStates = new Map();


const newGame = () => {
    return {
        board: Array(9).fill(' '),
        currentPlayer: 'X',
        isNewGame: true,
        totalMoves: 0
    }
}



const logger = (req, res, next) => {
    console.log('---HTTP REQUEST---');
    console.log('Method: ' + req.method);
    console.log('Headers: ' + req.headers["content-type"]);
    console.log('Move: ' + req.body.move);
    console.log('ID: ' + req.params.id);
    console.log('------------------------');
    next();
}

// CORS 
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');

    // If the browser is asking "Can I connect?", say YES (200 OK) immediately.
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});


app.use(express.json());
app.use(logger);




const winningCases = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [0, 4, 8]
]

function checkWinner(board) {
    for (const [a, b, c] of winningCases) {
        if (
            board[a] !== ' ' &&
            board[a] === board[b] &&
            board[b] === board[c]
        ) {
            return board[a];
        }
    }
    return null;
}

function validMoves(req, res, next) {
    const { id } = req.params;
    const { move } = req.body;

    if (id == undefined || id == null || move == undefined || move == null) {
        return res.status(400).json({ error: "Enter the id and move" });
    }

    if (typeof id !== 'string' || typeof move !== 'number') {
        return res.status(400).json({ error: "Invalid DataTypes for ID and Move, should be number" });
    }

    // check if the id has been created  or not 
    if (!gameStates.has(id)) {
        gameStates.set(id, newGame());
    }

    if (gameStates.get(id).isNewGame) {
        gameStates.set(id, newGame());
    }

    gameStates.get(id).isNewGame = false;

    if (move < 0 || move > 8 || gameStates.get(id).board[move] !== ' ') {
        return res.status(400).json({ error: "Invalid " });
    }

    next();
}


app.post('/tic_tac_toe/:id', validMoves, async (req, res) => {
    const { id } = req.params;
    const { move } = req.body;

    const currentGame = gameStates.get(id);


    currentGame.board[move] = currentGame.currentPlayer;
    currentGame.totalMoves++;
    currentGame.currentPlayer = (currentGame.currentPlayer === 'X') ? 'O' : 'X';

    let winner = checkWinner(currentGame.board);


    if (winner !== null) {
        currentGame.isNewGame = true;
        return res.status(200).json({
            board: gameStates.get(id).board,
            winner: winner,
        })
    }

    if (currentGame.totalMoves === 9) {
        currentGame.isNewGame = true;
        return res.status(200).json({
            board: currentGame.board,
            winner: 'Draw'
        })
    }


    return res.status(200).json({
        board: currentGame.board,
        winner: winner
    })
})





app.listen(PORT, '0.0.0.0', () => {
    console.log(`APP Running at http://localhost:` + PORT);
})


