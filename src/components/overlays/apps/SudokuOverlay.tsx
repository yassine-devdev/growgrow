import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePuzzle, checkSolution } from './sudoku/sudoku-utils';
import SudokuBoard from './sudoku/SudokuBoard';
import type { Board, Difficulty } from './sudoku/sudoku-utils';
import { RefreshCw, Check, Brain, PartyPopper, Undo2, Redo2, Save, Download } from 'lucide-react';
import Dialog from '@/components/ui/Dialog';
import { useAppStore } from '@/store/useAppStore';

type GameState = 'selecting' | 'playing' | 'solved';

const SudokuOverlay: React.FC = () => {
    const { t } = useTranslation();
    const addToast = useAppStore(s => s.addToast);
    const [gameState, setGameState] = useState<GameState>('selecting');
    const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
    const [puzzle, setPuzzle] = useState<Board | null>(null);
    const [solution, setSolution] = useState<Board | null>(null);
    const [playerBoard, setPlayerBoard] = useState<Board | null>(null);
    const [isNewGameConfirmOpen, setIsNewGameConfirmOpen] = useState(false);
    const [history, setHistory] = useState<Board[]>([]);
    const [redoStack, setRedoStack] = useState<Board[]>([]);
    const [hasSavedGame, setHasSavedGame] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('sudokuGameState')) {
            setHasSavedGame(true);
        }
    }, []);

    const startNewGame = useCallback((level: Difficulty) => {
        const { puzzle: newPuzzle, solution: newSolution } = generatePuzzle(level);
        setDifficulty(level);
        setPuzzle(newPuzzle);
        setSolution(newSolution);
        setPlayerBoard(newPuzzle);
        setGameState('playing');
        setHistory([]);
        setRedoStack([]);
    }, []);

    const handleCellChange = (row: number, col: number, value: number | null) => {
        if (!playerBoard) return;
        setHistory(prev => [...prev, playerBoard]);
        setRedoStack([]); // Clear redo stack on a new move
        const newBoard = playerBoard.map(r => [...r]);
        newBoard[row][col] = value;
        setPlayerBoard(newBoard);
    };

    const handleCheck = () => {
        if (!playerBoard || !solution) return;
        if (checkSolution(playerBoard, solution)) {
            setGameState('solved');
            addToast({ message: t('sudoku.solved'), type: 'success' });
        } else {
            addToast({ message: t('sudoku.unsolved'), type: 'error' });
        }
    };

    const handleSolve = () => {
        if (!playerBoard || !solution) return;
        setHistory(prev => [...prev, playerBoard]);
        setRedoStack([]);
        setPlayerBoard(solution);
        setGameState('solved');
    };
    
    const handleNewGameClick = () => {
        if (gameState === 'playing') {
            setIsNewGameConfirmOpen(true);
        } else {
            setGameState('selecting');
        }
    };
    
    const confirmNewGame = () => {
        setIsNewGameConfirmOpen(false);
        setGameState('selecting');
    };

    const handleUndo = () => {
        if (history.length === 0 || !playerBoard) return;

        const lastState = history[history.length - 1];
        const newHistory = history.slice(0, -1);

        setRedoStack(prev => [playerBoard, ...prev]);
        setHistory(newHistory);
        setPlayerBoard(lastState);
    };

    const handleRedo = () => {
        if (redoStack.length === 0 || !playerBoard) return;

        const nextState = redoStack[0];
        const newRedoStack = redoStack.slice(1);

        setHistory(prev => [...prev, playerBoard]);
        setRedoStack(newRedoStack);
        setPlayerBoard(nextState);
    };

    const handleSaveGame = () => {
        if (!playerBoard || !puzzle || !difficulty || gameState !== 'playing') {
            addToast({ message: 'No active game to save.', type: 'error' });
            return;
        }
        const gameStateToSave = {
            puzzle,
            playerBoard,
            difficulty,
            history,
            redoStack,
        };
        localStorage.setItem('sudokuGameState', JSON.stringify(gameStateToSave));
        setHasSavedGame(true);
        addToast({ message: 'Game saved successfully!', type: 'success' });
    };

    const handleLoadGame = () => {
        const savedStateJSON = localStorage.getItem('sudokuGameState');
        if (savedStateJSON) {
            try {
                const savedState = JSON.parse(savedStateJSON);
                if (savedState.puzzle && savedState.playerBoard && savedState.difficulty) {
                    setPuzzle(savedState.puzzle);
                    setPlayerBoard(savedState.playerBoard);
                    setDifficulty(savedState.difficulty);
                    setHistory(savedState.history || []);
                    setRedoStack(savedState.redoStack || []);
                    setGameState('playing');
                    addToast({ message: 'Saved game loaded!', type: 'success' });
                } else {
                    throw new Error("Invalid save data structure.");
                }
            } catch (error) {
                addToast({ message: 'Failed to load saved game. Data may be corrupted.', type: 'error' });
                localStorage.removeItem('sudokuGameState');
                setHasSavedGame(false);
            }
        } else {
            addToast({ message: 'No saved game found.', type: 'info' });
        }
    };

    if (gameState === 'selecting') {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-brand-surface-alt">
                <h2 className="text-2xl font-bold mb-6">{t('sudoku.selectDifficulty')}</h2>
                <div className="flex flex-col gap-4 w-full max-w-xs">
                    <button onClick={() => startNewGame('Easy')} className="px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-primary-hover">{t('sudoku.easy')}</button>
                    <button onClick={() => startNewGame('Medium')} className="px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-primary-hover">{t('sudoku.medium')}</button>
                    <button onClick={() => startNewGame('Hard')} className="px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-primary-hover">{t('sudoku.hard')}</button>
                    {hasSavedGame && (
                        <button onClick={handleLoadGame} className="mt-4 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 flex items-center justify-center gap-2">
                            <Download className="w-5 h-5" /> Load Saved Game
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-4 bg-brand-surface-alt">
             {gameState === 'solved' && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-white text-center animate-fade-in">
                    <PartyPopper className="w-16 h-16 text-yellow-300 mb-4" />
                    <h2 className="text-3xl font-bold">{t('sudoku.solved')}</h2>
                </div>
            )}
            <div className="flex justify-between w-full max-w-md items-center flex-wrap gap-2">
                <span className="font-semibold text-brand-text">{difficulty}</span>
                <div className="flex gap-2 flex-wrap justify-end">
                    <button onClick={handleUndo} disabled={history.length === 0} className="px-3 py-2 text-sm bg-brand-surface rounded-md flex items-center gap-2 hover:bg-brand-border disabled:opacity-50 disabled:cursor-not-allowed"><Undo2 className="w-4 h-4" /> Undo</button>
                    <button onClick={handleRedo} disabled={redoStack.length === 0} className="px-3 py-2 text-sm bg-brand-surface rounded-md flex items-center gap-2 hover:bg-brand-border disabled:opacity-50 disabled:cursor-not-allowed"><Redo2 className="w-4 h-4" /> Redo</button>
                    <button onClick={handleSaveGame} className="px-3 py-2 text-sm bg-brand-surface rounded-md flex items-center gap-2 hover:bg-brand-border"><Save className="w-4 h-4" /> Save</button>
                    <button onClick={handleNewGameClick} className="px-3 py-2 text-sm bg-brand-surface rounded-md flex items-center gap-2 hover:bg-brand-border"><RefreshCw className="w-4 h-4" /> {t('sudoku.newGame')}</button>
                    <button onClick={handleCheck} className="px-3 py-2 text-sm bg-brand-surface rounded-md flex items-center gap-2 hover:bg-brand-border"><Check className="w-4 h-4" /> {t('sudoku.check')}</button>
                    <button onClick={handleSolve} className="px-3 py-2 text-sm bg-brand-surface rounded-md flex items-center gap-2 hover:bg-brand-border"><Brain className="w-4 h-4" /> {t('sudoku.solve')}</button>
                </div>
            </div>
            {puzzle && playerBoard && (
                <SudokuBoard
                    puzzle={puzzle}
                    playerBoard={playerBoard}
                    onCellChange={handleCellChange}
                    isSolved={gameState === 'solved'}
                />
            )}
            <Dialog 
                isOpen={isNewGameConfirmOpen}
                onClose={() => setIsNewGameConfirmOpen(false)}
                onConfirm={confirmNewGame}
                title="Start New Game?"
                description={t('sudoku.confirmNewGame')}
                confirmText="Yes, start new"
                confirmVariant="destructive"
            />
        </div>
    );
};

export default SudokuOverlay;
