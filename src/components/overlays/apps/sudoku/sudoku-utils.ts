export type Board = (number | null)[][];
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

// A valid, complete Sudoku board to serve as a base
const BASE_SOLUTION: Board = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
];

const copyBoard = (board: Board): Board => board.map(row => [...row]);

// Shuffling functions to create puzzle variations
const shuffleArray = <T>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const transpose = (board: Board): Board => {
    return board[0].map((_, colIndex) => board.map(row => row[colIndex]));
};

const swapRows = (board: Board, r1: number, r2: number): Board => {
    [board[r1], board[r2]] = [board[r2], board[r1]];
    return board;
};

const swapCols = (board: Board, c1: number, c2: number): Board => {
    return transpose(swapRows(transpose(board), c1, c2));
};

const generateSolvedBoard = (): Board => {
    let board = copyBoard(BASE_SOLUTION);
    // Shuffle numbers
    const numbers = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    board = board.map(row => row.map(cell => numbers[cell! - 1]));
    
    // Shuffle rows within 3x3 blocks
    for (let block = 0; block < 3; block++) {
        const rows = shuffleArray([0, 1, 2]);
        board = swapRows(board, block * 3 + rows[0], block * 3 + rows[1]);
        board = swapRows(board, block * 3 + rows[1], block * 3 + rows[2]);
    }

    // Shuffle columns within 3x3 blocks
     for (let block = 0; block < 3; block++) {
        const cols = shuffleArray([0, 1, 2]);
        board = swapCols(board, block * 3 + cols[0], block * 3 + cols[1]);
        board = swapCols(board, block * 3 + cols[1], block * 3 + cols[2]);
    }
    return board;
};


const difficultySettings = {
    Easy: 36,   // Number of cells to remove
    Medium: 46,
    Hard: 51,
};

export const generatePuzzle = (difficulty: Difficulty): { puzzle: Board, solution: Board } => {
    const solution = generateSolvedBoard();
    const puzzle = copyBoard(solution);

    const cellsToRemove = difficultySettings[difficulty];
    let removed = 0;
    while (removed < cellsToRemove) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (puzzle[row][col] !== null) {
            puzzle[row][col] = null;
            removed++;
        }
    }

    return { puzzle, solution };
};

export const checkSolution = (playerBoard: Board, solution: Board): boolean => {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (playerBoard[r][c] !== solution[r][c]) {
                return false;
            }
        }
    }
    return true;
};
