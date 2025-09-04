import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2 } from 'lucide-react';

const predefinedTasks = [
    "Study for Math test",
    "Read Chapter 5 of History book",
    "Work on science project",
    "Prepare for presentation",
    "Review class notes for English",
    "Finish lab report",
    "Practice Spanish vocabulary",
];

interface Task {
    id: number;
    text: string;
    completed: boolean;
}

const PersonalTodoList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        if (inputValue) {
            const filtered = predefinedTasks.filter(task =>
                task.toLowerCase().includes(inputValue.toLowerCase()) && task.toLowerCase() !== inputValue.toLowerCase()
            );
            setSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setShowSuggestions(false);
        }
    }, [inputValue]);

    const handleAddTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            setTasks(prev => [...prev, { id: Date.now(), text: inputValue.trim(), completed: false }]);
            setInputValue('');
            setShowSuggestions(false);
        }
    };

    const handleToggleTask = (id: number) => {
        setTasks(prev =>
            prev.map(task =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };
    
    const handleSuggestionClick = (suggestion: string) => {
        setInputValue(suggestion);
        setShowSuggestions(false);
    };

    const handleClearCompleted = () => {
        setTasks(prev => prev.filter(task => !task.completed));
    };

    const hasCompletedTasks = tasks.some(task => task.completed);

    return (
        <div className="bg-brand-surface border border-brand-border rounded-lg p-4 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-brand-text">Personal To-Do List</h3>
                {hasCompletedTasks && (
                     <button
                        onClick={handleClearCompleted}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                        aria-label="Clear all completed tasks"
                    >
                        <Trash2 className="w-3 h-3" />
                        Clear Completed
                    </button>
                )}
            </div>
            <form onSubmit={handleAddTask} className="relative mb-4">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onFocus={() => inputValue && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} // Delay to allow click
                    placeholder="Add a new task..."
                    className="w-full p-2 pr-10 border border-brand-border rounded-md text-sm"
                    aria-label="New to-do task input"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-brand-primary hover:bg-brand-surface-alt rounded-full" aria-label="Add task">
                    <Plus className="w-5 h-5" />
                </button>
                {showSuggestions && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-brand-surface border border-brand-border rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
                        {suggestions.map((suggestion, index) => (
                            <div
                                key={index}
                                onMouseDown={() => handleSuggestionClick(suggestion)} // use onMouseDown to fire before blur
                                className="p-2 text-sm hover:bg-brand-surface-alt cursor-pointer"
                            >
                                {suggestion}
                            </div>
                        ))}
                    </div>
                )}
            </form>
            <ul className="space-y-2 flex-1 overflow-y-auto pr-2 min-h-[100px]">
                {tasks.map(task => (
                    <li key={task.id} className="flex items-center gap-3">
                        <button
                            onClick={() => handleToggleTask(task.id)}
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${task.completed ? 'border-brand-accent bg-brand-accent' : 'border-brand-border'}`}
                            aria-label={`Mark task ${task.text} as ${task.completed ? 'incomplete' : 'complete'}`}
                        >
                            {task.completed && <Check className="w-3 h-3 text-white" />}
                        </button>
                        <span className={`flex-1 text-sm ${task.completed ? 'line-through text-brand-text-alt' : 'text-brand-text'}`}>
                            {task.text}
                        </span>
                    </li>
                ))}
                 {tasks.length === 0 && <p className="text-sm text-brand-text-alt text-center py-4">No tasks yet. Add one above!</p>}
            </ul>
        </div>
    );
};

export default PersonalTodoList;