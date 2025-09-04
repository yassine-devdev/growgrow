import React, { useState, useMemo } from 'react';
import type { Board } from './sudoku-utils';

interface SudokuBoardProps {
    puzzle: Board;
    playerBoard: Board;
    onCellChange: (row: number, col: number, value: number | null) => void;
    isSolved: boolean;
}

const SudokuBoard: React.FC<SudokuBoardProps> = ({ puzzle, playerBoard, onCellChange, isSolved }) => {
    const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);

    const conflicts = useMemo(() => {
        const conflictSet = new Set<string>();
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                const val = playerBoard[r][c];
                if (val === null) continue;

                // Check row and column
                for (let i = 0; i < 9; i++) {
                    if (i !== c && playerBoard[r][i] === val) conflictSet.add(`${r}-${c}`);
                    if (i !== r && playerBoard[i][c] === val) conflictSet.add(`${r}-${c}`);
                }

                // Check 3x3 box
                const startRow = r - (r % 3);
                const startCol = c - (c % 3);
                for (let i = 0; i < 3; i++) {
                    for (let j = 0; j < 3; j++) {
                        if ((startRow + i !== r || startCol + j !== c) && playerBoard[startRow + i][startCol + j] === val) {
                            conflictSet.add(`${r}-${c}`);
                        }
                    }
                }
            }
        }
        return conflictSet;
    }, [playerBoard]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, row: number, col: number) => {
        const value = e.target.value;
        if (/^[1-9]$/.test(value)) {
            onCellChange(row, col, parseInt(value, 10));
        } else if (value === '') {
            onCellChange(row, col, null);
        }
    };
    
    return (
        <div className="grid grid-cols-9 aspect-square w-full max-w-md bg-brand-border dark:bg-dark-border border-2 border-brand-border dark:border-dark-border rounded-lg overflow-hidden shadow-lg">
            {playerBoard.map((row, r) =>
                row.map((cell, c) => {
                    const isGiven = puzzle[r][c] !== null;
                    const isSelected = selectedCell?.row === r && selectedCell?.col === c;
                    const isInGroup = selectedCell && (selectedCell.row === r || selectedCell.col === c || (Math.floor(selectedCell.row / 3) === Math.floor(r / 3) && Math.floor(selectedCell.col / 3) === Math.floor(c / 3)));
                    const hasConflict = conflicts.has(`${r}-${c}`);

                    const borderRight = (c === 2 || c === 5) ? 'border-r-2 border-r-brand-border dark:border-r-dark-border' : '';
                    const borderBottom = (r === 2 || r === 5) ? 'border-b-2 border-b-brand-border dark:border-b-dark-border' : '';

                    return (
                        <div key={`${r}-${c}`} className={`aspect-square flex items-center justify-center text-xl md:text-2xl font-semibold border-brand-surface-alt dark:border-dark-surface-alt border ${borderRight} ${borderBottom} transition-colors duration-150
                            ${isSelected ? 'bg-brand-primary/30' : isInGroup ? 'bg-brand-primary/10' : 'bg-brand-surface dark:bg-dark-surface'}`}
                        >
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[1-9]"
                                maxLength={1}
                                value={cell || ''}
                                onChange={(e) => handleInputChange(e, r, c)}
                                onFocus={() => setSelectedCell({ row: r, col: c })}
                                readOnly={isGiven || isSolved}
                                className={`w-full h-full text-center bg-transparent focus:outline-none 
                                    ${isGiven ? 'text-brand-text dark:text-dark-text' : 'text-brand-primary'}
                                    ${hasConflict && !isSolved ? 'text-red-500' : ''}
                                    ${isSolved ? 'text-green-600' : ''}`}
                                aria-label={`Cell at row ${r + 1}, column ${c + 1}`}
                            />
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default SudokuBoard;
