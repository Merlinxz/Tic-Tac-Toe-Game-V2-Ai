const board = document.getElementById('board');
const turnIndicator = document.getElementById('turnIndicator');
const statusBar = document.getElementById('statusBar');
const resetButton = document.getElementById('resetButton');
const toggleModeButton = document.getElementById('toggleModeButton');

const PLAYER_X = 'X';
const PLAYER_O = 'O';
let currentPlayer = PLAYER_X;
let gameBoard = Array(9).fill(null);
let isAITurn = false;
let playWithAI = false;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const aiResponses = [
    "I'm making my move!",
    "Thinking...",
    "Your turn!",
    "Hmm, interesting.",
    "Let's see what you got."
];

function createBoard() {
    board.innerHTML = '';
    gameBoard.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.dataset.index = index;
        cellElement.addEventListener('click', handleCellClick);
        board.appendChild(cellElement);
    });
}

function handleCellClick(event) {
    const index = event.target.dataset.index;
    if (gameBoard[index] || (playWithAI && isAITurn)) {
        return;
    }

    makeMove(index, currentPlayer);
    if (checkWinner(currentPlayer)) {
        setTimeout(() => alert(`${currentPlayer} wins!`), 10);
        resetGame();
        return;
    }

    if (gameBoard.every(cell => cell)) {
        setTimeout(() => alert('Draw!'), 10);
        resetGame();
        return;
    }

    switchPlayer();
    if (playWithAI && currentPlayer === PLAYER_O) {
        isAITurn = true;
        setTimeout(() => {
            const aiMove = getBestMove();
            makeMove(aiMove, PLAYER_O);
            if (checkWinner(PLAYER_O)) {
                setTimeout(() => alert(`AI wins!`), 10);
                resetGame();
                return;
            }
            if (gameBoard.every(cell => cell)) {
                setTimeout(() => alert('Draw!'), 10);
                resetGame();
                return;
            }
            switchPlayer();
            isAITurn = false;
        }, 500);
    }
}

function makeMove(index, player) {
    gameBoard[index] = player;
    document.querySelectorAll('.cell')[index].textContent = player;
}

function switchPlayer() {
    currentPlayer = currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X;
    turnIndicator.textContent = `Turn: ${currentPlayer}`;
    if (playWithAI && currentPlayer === PLAYER_O) {
        statusBar.textContent = "Mode: Play with AI (AI's turn)";
        textAIResponse();
    } else if (playWithAI) {
        statusBar.textContent = "Mode: Play with AI (Your turn)";
    }
}

function checkWinner(player) {
    return winningCombinations.some(combination => {
        return combination.every(index => gameBoard[index] === player);
    });
}

function resetGame() {
    gameBoard.fill(null);
    currentPlayer = PLAYER_X;
    isAITurn = false;
    createBoard();
    turnIndicator.textContent = `Turn: ${currentPlayer}`;
}

function toggleMode() {
    playWithAI = !playWithAI;
    statusBar.textContent = playWithAI ? "Mode: Play with AI" : "Mode: Play with Friend";
    resetGame();
}

function getBestMove() {
    let bestScore = -Infinity;
    let move;
    gameBoard.forEach((cell, index) => {
        if (!cell) {
            gameBoard[index] = PLAYER_O;
            let score = minimax(gameBoard, 0, false, -Infinity, Infinity);
            gameBoard[index] = null;
            if (score > bestScore) {
                bestScore = score;
                move = index;
            }
        }
    });
    return move;
}

const scores = {
    X: -1,
    O: 1,
    tie: 0
};

function minimax(board, depth, isMaximizing, alpha, beta) {
    let winner = checkWinner(PLAYER_X) ? PLAYER_X : checkWinner(PLAYER_O) ? PLAYER_O : null;
    if (winner) return scores[winner];
    if (board.every(cell => cell)) return scores['tie'];

    if (isMaximizing) {
        let maxEval = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = PLAYER_O;
                let eval = minimax(board, depth + 1, false, alpha, beta);
                board[i] = null;
                maxEval = Math.max(maxEval, eval);
                alpha = Math.max(alpha, eval);
                if (beta <= alpha) break;
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = PLAYER_X;
                let eval = minimax(board, depth + 1, true, alpha, beta);
                board[i] = null;
                minEval = Math.min(minEval, eval);
                beta = Math.min(beta, eval);
                if (beta <= alpha) break;
            }
        }
        return minEval;
    }
}

function textAIResponse() {
    const randomIndex = Math.floor(Math.random() * aiResponses.length);
    Swal.fire({
        text: aiResponses[randomIndex],
        timer: 1000,
        showConfirmButton: false,
        position: 'top',
        toast: true
    });
}

resetButton.addEventListener('click', resetGame);
toggleModeButton.addEventListener('click', toggleMode);

createBoard();
turnIndicator.textContent = `Turn: ${currentPlayer}`;