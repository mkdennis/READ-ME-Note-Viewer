# README Learning Website

A minimal, readable website to upload, view, search, and navigate through learning README files with beautiful markdown rendering and interactive table of contents.

## Features

- 📤 **Upload READMEs** - Upload markdown files through a simple file picker
- 📚 **View All READMEs** - Browse all your learning notes in a clean card grid
- 🔍 **Search** - Full-text search across all READMEs with highlighting
- 📖 **Beautiful Reading** - Markdown rendering with syntax highlighting
- 📑 **Table of Contents** - Auto-generated, interactive TOC with scroll highlighting
- 💾 **Persistent Storage** - All data stored in IndexedDB (survives browser refresh)
- 🎨 **Minimal Design** - Clean, readable interface focused on content

## Tech Stack

- **React 19** + **TypeScript** + **Vite** - Core framework
- **shadcn/ui** - UI component library
- **Tailwind CSS** - Styling
- **react-markdown** - Markdown rendering
- **react-syntax-highlighter** - Code syntax highlighting
- **IndexedDB** (via `idb`) - Client-side storage

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

## Usage

1. **Upload a README**: Click the "Upload README" button and select a markdown file
2. **Browse READMEs**: View all your uploaded READMEs in the card grid
3. **Search**: Use the search bar to find specific content across all READMEs
4. **Read**: Click any README card to open it in the reader view
5. **Navigate**: Use the table of contents sidebar to jump to sections
6. **Delete**: Click the trash icon on any README card to remove it

## Project Structure

```
src/
  ├── components/
  │   ├── ui/              # shadcn/ui components
  │   ├── FileUpload.tsx   # File upload component
  │   ├── ReadmeList.tsx   # List of all READMEs
  │   ├── ReadmeViewer.tsx # Markdown renderer with TOC
  │   ├── SearchBar.tsx    # Search input component
  │   └── TableOfContents.tsx # Interactive TOC sidebar
  ├── lib/
  │   ├── db.ts            # IndexedDB operations
  │   ├── utils.ts         # Utility functions
  │   └── markdown.ts      # Markdown parsing utilities
  ├── App.tsx              # Main app component
  ├── main.tsx             # Entry point
  └── index.css            # Global styles + Tailwind
```

## License

MIT
