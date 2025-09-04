import React, { useState, useRef } from 'react';
import OfficeToolbar from './OfficeToolbar';

const OfficeTab: React.FC = () => {
    const editorRef = useRef<HTMLDivElement>(null);
    
    // In a real app, this would be a more complex state object (e.g., a Slate.js value).
    // For this implementation, we rely on the browser's contentEditable capabilities.

    const handleFormat = (command: string, value?: string) => {
        if (editorRef.current) {
            editorRef.current.focus();
            document.execCommand(command, false, value);
        }
    };


    return (
        <div className="w-full h-full flex flex-col bg-white">
            <OfficeToolbar onFormat={handleFormat} />
            <div className="flex-1 p-4 overflow-y-auto">
                <div
                    ref={editorRef}
                    contentEditable={true}
                    className="w-full h-full prose max-w-none focus:outline-none text-brand-text"
                    // Use dangerouslySetInnerHTML for initial content if needed, but be cautious.
                    // For this example, we'll let the user type from scratch.
                />
            </div>
        </div>
    );
};

export default OfficeTab;