import React, { useState, useEffect, useRef } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-markup";
import "prismjs/themes/prism-tomorrow.css";
import { Loader2, Save, X } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { mockFileSystem } from "./coder.constants";
import FileExplorer from "./FileExplorer";

// Helper to get file content from path
const getFileContent = (path: string, fs: any): string | null => {
  const parts = path.split("/").filter((p) => p);
  let current = fs;
  for (const part of parts) {
    if (current[part]) {
      current = current[part];
    } else {
      return null; // Not found
    }
  }
  return typeof current.content === "string" ? current.content : null;
};

import safeStringify from "@/utils/safeStringify";

// Helper to update file content
const updateFileContent = (path: string, newContent: string, fs: any): any => {
  // Use safe stringify/parse to deep clone without throwing on circular refs
  const newFs = JSON.parse(safeStringify(fs));
  const parts = path.split("/").filter((p) => p);
  let current = newFs;
  for (let i = 0; i < parts.length - 1; i++) {
    current = current[parts[i]];
  }
  const fileName = parts[parts.length - 1];
  if (current[fileName]) {
    current[fileName].content = newContent;
  }
  return newFs;
};

const CoderTab: React.FC = () => {
  const addToast = useAppStore((s) => s.addToast);
  const [fileSystem, setFileSystem] = useState(mockFileSystem);
  const [openFiles, setOpenFiles] = useState<string[]>(["/index.html"]);
  const [activeFile, setActiveFile] = useState<string>("/index.html");
  const [isSaving, setIsSaving] = useState(false);
  const tabRefs = useRef<(HTMLDivElement | null)[]>([]);

  const activeFileContent = getFileContent(activeFile, fileSystem) ?? "";
  const activeFileExtension = activeFile.split(".").pop() || "";

  useEffect(() => {
    tabRefs.current = tabRefs.current.slice(0, openFiles.length);
  }, [openFiles]);

  const handleCodeChange = (newCode: string) => {
    setFileSystem((fs) => updateFileContent(activeFile, newCode, fs));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addToast({ message: `Saved ${activeFile}`, type: "success" });
    }, 1000);
  };

  const handleSelectFile = (path: string) => {
    if (!openFiles.includes(path)) {
      setOpenFiles((prev) => [...prev, path]);
    }
    setActiveFile(path);
  };

  const handleCloseTab = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    const index = openFiles.findIndex((f) => f === path);
    const newOpenFiles = openFiles.filter((f) => f !== path);
    setOpenFiles(newOpenFiles);

    if (activeFile === path) {
      if (newOpenFiles.length > 0) {
        const newIndex = Math.max(0, index - 1);
        const newActiveFile = newOpenFiles[newIndex];
        setActiveFile(newActiveFile);
        setTimeout(() => tabRefs.current[newIndex]?.focus(), 0);
      } else {
        setActiveFile("");
      }
    }
  };

  const handleTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    let newIndex = index;
    if (e.key === "ArrowRight") {
      newIndex = (index + 1) % openFiles.length;
    } else if (e.key === "ArrowLeft") {
      newIndex = (index - 1 + openFiles.length) % openFiles.length;
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActiveFile(openFiles[index]);
    }

    if (newIndex !== index) {
      e.preventDefault();
      tabRefs.current[newIndex]?.focus();
    }
  };

  const getPrismLanguage = (ext: string) => {
    switch (ext) {
      case "js":
        return languages.js;
      case "css":
        return languages.css;
      case "html":
        return languages.markup;
      default:
        return languages.clike;
    }
  };

  return (
    <div className="w-full h-full flex font-mono bg-[#2d2d2d]">
      <FileExplorer
        fileSystem={fileSystem}
        onSelectFile={handleSelectFile}
        activeFile={activeFile}
      />
      <div className="flex-1 flex flex-col">
        <div className="p-2 bg-brand-surface border-b border-brand-border flex items-center justify-between">
          <div
            role="tablist"
            aria-label="Open files"
            className="flex items-center gap-1"
          >
            {openFiles.map((path, index) => (
              <div
                key={path}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                id={`file-tab-${index}`}
                role="tab"
                aria-selected={activeFile === path}
                aria-controls="code-editor-panel"
                tabIndex={0}
                onClick={() => setActiveFile(path)}
                onKeyDown={(e) => handleTabKeyDown(e, index)}
                className={`flex items-center justify-between pl-3 pr-1 py-1 text-sm rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-primary ${activeFile === path ? "bg-brand-primary/20 text-brand-primary" : "text-brand-text-alt hover:bg-brand-surface-alt"}`}
              >
                <span>{path.split("/").pop()}</span>
                <button
                  aria-label={`Close tab for ${path.split("/").pop()}`}
                  onClick={(e) => handleCloseTab(e, path)}
                  className="p-1 rounded-full hover:bg-black/10"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving || !activeFile}
            className="px-3 py-1 bg-brand-primary text-white text-sm rounded-md flex items-center gap-2 disabled:bg-brand-text-alt"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
        <div
          id="code-editor-panel"
          role="tabpanel"
          hidden={!activeFile}
          aria-labelledby={
            openFiles.length > 0 && activeFile
              ? `file-tab-${openFiles.indexOf(activeFile)}`
              : undefined
          }
          className="flex-1 overflow-auto"
        >
          {activeFile ? (
            <Editor
              value={activeFileContent}
              onValueChange={handleCodeChange}
              highlight={(c) =>
                highlight(
                  c,
                  getPrismLanguage(activeFileExtension),
                  activeFileExtension
                )
              }
              padding={10}
              className="text-sm"
              style={{
                fontFamily: '"Fira Code", "Fira Mono", monospace',
                fontSize: 14,
                minHeight: "100%",
              }}
            />
          ) : (
            <div className="p-4 text-center text-gray-400">
              Select a file to begin editing.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoderTab;
