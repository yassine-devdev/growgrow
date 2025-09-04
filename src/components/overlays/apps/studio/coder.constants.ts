// This file defines a mock file system structure for the Studio Coder tab.

interface File {
    content: string;
}

interface Directory {
    [key: string]: File | Directory;
}

export const mockFileSystem: Directory = {
    '/': {
        'index.html': {
            content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My App</title>
    <link rel="stylesheet" href="styles/style.css">
</head>
<body>
    <h1>Hello, World!</h1>
    <script src="scripts/main.js"></script>
</body>
</html>`
        },
        'styles/': {
            'style.css': {
                content: `body {
    font-family: sans-serif;
    background-color: #f0f2f5;
    color: #111827;
}`
            }
        },
        'scripts/': {
            'main.js': {
                content: `console.log("Script loaded!");`
            }
        },
        'README.md': {
            content: `# My Project
Welcome to the Coder app within the SaaS Super App!`
        }
    }
};
