import React from 'react';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import 'prismjs/themes/prism-tomorrow.css';

interface MarkdownRendererProps {
    content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    const renderContent = () => {
        if (!content) return null;

        const parts = content.split(/(```[\s\S]*?```)/g);

        return parts.map((part, index) => {
            if (part.startsWith('```')) {
                const lang = part.match(/^```(\w+)\n/)?.[1] || 'markup';
                const code = part.replace(/^```\w*\n|```$/g, '');
                const language = languages[lang] || languages.markup;
                
                try {
                    const highlighted = highlight(code, language, lang);
                    return (
                        <pre key={index} className="bg-gray-800 text-white p-4 rounded-md text-sm my-2 overflow-x-auto">
                            <code dangerouslySetInnerHTML={{ __html: highlighted }} />
                        </pre>
                    );
                } catch (e) {
                    // Fallback for unsupported languages
                     return (
                        <pre key={index} className="bg-gray-800 text-white p-4 rounded-md text-sm my-2 overflow-x-auto">
                            <code>{code}</code>
                        </pre>
                    );
                }
            }

            let html = part
                .replace(/</g, '&lt;') // Basic XSS protection
                .replace(/>/g, '&gt;')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-700 rounded-sm px-1 py-0.5 font-mono text-sm">$1</code>')
                .replace(/^- (.*$)/gm, '<li>$1</li>')
                .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mt-2">$1</h3>')
                .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-3">$1</h2>')
                .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-4">$1</h1>')
                .replace(/\n/g, '<br />'); // Convert newlines to <br>

            if (/<li>/.test(html)) {
                html = `<ul>${html.replace(/<br \/>/g, '')}</ul>`.replace(/<\/ul><ul>/gm, '');
            }

            return <div key={index} dangerouslySetInnerHTML={{ __html: html }} className="prose prose-sm max-w-none dark:prose-invert" />;
        });
    };

    return <div className="space-y-2">{renderContent()}</div>;
};

export default MarkdownRenderer;
