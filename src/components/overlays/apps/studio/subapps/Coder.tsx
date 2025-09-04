import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import 'prismjs/themes/prism-tomorrow.css';
import { useQuery } from '@tanstack/react-query';
// FIX: Import correct API function for Studio data
import { getStudioCodeProjects } from '@/api/appModulesApi';
import { Loader2, Folder, FileText, Bug, Save } from 'lucide-react';

const FileTree: React.FC<{ node: any; path: string }> = ({ node, path }) => (
    <ul className="pl-4 text-xs">
        {Object.entries(node).map(([name, content]) => {
            const currentPath = `${path}${name}`;
            const isDirectory = name.endsWith('/');
            if (isDirectory) {
                return (
                    <li key={currentPath}>
                        <div className="flex items-center gap-2 py-1"><Folder className="w-4 h-4 text-yellow-500" /><span>{name.replace('/', '')}</span></div>
                        <FileTree node={content} path={currentPath} />
                    </li>
                );
            }
            return (
                 <li key={currentPath} className="flex items-center gap-2 py-1"><FileText className="w-4 h-4 text-gray-400" /><span>{name}</span></li>
            )
        })}
    </ul>
);

const Coder: React.FC = () => {
    const { data: fileSystem, isLoading } = useQuery({ queryKey: ['studioCodeProjects'], queryFn: getStudioCodeProjects });
    const sampleCode = `function helloWorld() {\n  console.log("Hello from the Studio Coder!");\n}`;

    return (
        <div className="h-full flex">
            <aside className="w-1/4 bg-gray-800 text-white p-4 overflow-y-auto">
                <h3 className="font-bold mb-2">Projects</h3>
                {isLoading ? <Loader2 className="animate-spin" /> : fileSystem && <FileTree node={fileSystem['/']} path="/" />}
            </aside>
            <main className="w-3/4 flex flex-col">
                <div className="p-2 bg-[#2d2d2d] border-b border-white/10 flex justify-between items-center text-white">
                    <span className="text-sm font-mono">/school-website/index.html</span>
                    <div className="flex gap-2">
                        <button className="px-2 py-1 text-xs bg-white/10 rounded-md flex items-center gap-1"><Bug className="w-3 h-3"/> AI Debug</button>
                        <button className="px-2 py-1 text-xs bg-brand-primary rounded-md flex items-center gap-1"><Save className="w-3 h-3"/> Save</button>
                    </div>
                </div>
                <div className="flex-1 overflow-auto font-mono text-sm bg-[#2d2d2d]">
                     <Editor
                        value={sampleCode}
                        onValueChange={() => {}}
                        highlight={c => highlight(c, languages.js, 'javascript')}
                        padding={10}
                        style={{ fontFamily: '"Fira Code", "Fira Mono", monospace', fontSize: 14 }}
                    />
                </div>
            </main>
        </div>
    );
};

export default Coder;