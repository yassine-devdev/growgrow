import React, { useState, useMemo, useRef } from 'react';
import { Folder, FileText, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FileExplorerProps {
    fileSystem: any;
    onSelectFile: (path: string) => void;
    activeFile: string;
}

// Helper to search the file system recursively
const searchFileSystem = (node: any, path: string, searchTerm: string, results: { path: string; name: string }[]) => {
    for (const [name, content] of Object.entries(node)) {
        const currentPath = `${path}${name}`;
        const isDirectory = name.endsWith('/');

        if (isDirectory) {
            searchFileSystem(content as any, currentPath, searchTerm, results);
        } else {
            if (name.toLowerCase().includes(searchTerm)) {
                results.push({ path: currentPath, name });
            }
        }
    }
};

const FileTree: React.FC<{ node: any; onSelectFile: (path: string) => void; path: string; activeFile: string; }> = ({ node, onSelectFile, path, activeFile }) => {
    return (
        <ul className="pl-4">
            {Object.entries(node).map(([name, content]) => {
                const currentPath = `${path}${name}`;
                const isDirectory = name.endsWith('/');
                
                if (isDirectory) {
                    return (
                        <li key={currentPath}>
                            <div className="flex items-center gap-2 py-1">
                                <Folder className="w-4 h-4 text-yellow-500" />
                                <span>{name.replace('/', '')}</span>
                            </div>
                            <FileTree node={content} onSelectFile={onSelectFile} path={currentPath} activeFile={activeFile} />
                        </li>
                    );
                } else {
                    return (
                        <li key={currentPath}>
                            <button
                                data-file-path={currentPath}
                                onClick={() => onSelectFile(currentPath)}
                                className={`w-full text-left flex items-center gap-2 py-1 px-2 rounded-md ${activeFile === currentPath ? 'bg-brand-primary/20' : 'hover:bg-white/10'}`}
                            >
                                <FileText className="w-4 h-4 text-gray-400" />
                                <span>{name}</span>
                            </button>
                        </li>
                    )
                }
            })}
        </ul>
    );
};

const SearchResults: React.FC<{ results: { path: string; name: string }[]; onSelectFile: (path: string) => void; activeFile: string; }> = ({ results, onSelectFile, activeFile }) => {
    if (results.length === 0) {
        return <div className="p-2 text-xs text-gray-400 text-center">No files found.</div>;
    }

    return (
        <ul className="space-y-1">
            {results.map(({ path, name }) => (
                <li key={path}>
                    <button
                        data-file-path={path}
                        onClick={() => onSelectFile(path)}
                        className={`w-full text-left flex items-center gap-2 py-1 px-2 rounded-md ${activeFile === path ? 'bg-brand-primary/20' : 'hover:bg-white/10'}`}
                    >
                        <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                        <div className="truncate">
                            <span className="truncate" title={path}>{name}</span>
                            <span className="text-xs text-gray-500 block truncate">{path.substring(0, path.lastIndexOf('/') + 1)}</span>
                        </div>
                    </button>
                </li>
            ))}
        </ul>
    );
};


const FileExplorer: React.FC<FileExplorerProps> = ({ fileSystem, onSelectFile, activeFile }) => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const explorerRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
        
        e.preventDefault();
    
        const focusable = Array.from(
            explorerRef.current?.querySelectorAll<HTMLButtonElement>('button[data-file-path]')
        ) || [];
    
        const currentIndex = focusable.findIndex(el => el === document.activeElement);
    
        let nextIndex = -1;
        if (e.key === 'ArrowDown') {
            nextIndex = currentIndex >= 0 ? (currentIndex + 1) % focusable.length : 0;
        } else { // ArrowUp
            nextIndex = currentIndex > 0 ? currentIndex - 1 : focusable.length - 1;
        }
        
        if (nextIndex !== -1) {
            focusable[nextIndex]?.focus();
        }
    };

    const searchResults = useMemo(() => {
        if (!searchTerm.trim()) return [];
        const results: { path: string; name: string }[] = [];
        searchFileSystem(fileSystem['/'], '/', searchTerm.toLowerCase(), results);
        return results;
    }, [searchTerm, fileSystem]);

    return (
        <nav aria-label={t('views.studio.coder.fileExplorer')} className="w-56 bg-gray-800/50 text-white p-2 flex flex-col shrink-0">
            <h3 className="text-sm font-bold mb-2 px-2">{t('views.studio.coder.fileExplorer')}</h3>
             <div className="relative mb-2">
                <input
                    type="text"
                    placeholder="Search files..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-700 text-white text-sm rounded-md pl-8 pr-2 py-1 focus:outline-none focus:ring-1 focus:ring-brand-primary"
                    aria-label="Search files in project"
                />
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <div ref={explorerRef} onKeyDown={handleKeyDown} className="flex-1 overflow-y-auto text-sm">
                 {searchTerm.trim() ? (
                    <SearchResults results={searchResults} onSelectFile={onSelectFile} activeFile={activeFile} />
                ) : (
                    <FileTree node={fileSystem['/']} onSelectFile={onSelectFile} path="/" activeFile={activeFile} />
                )}
            </div>
        </nav>
    );
};

export default FileExplorer;