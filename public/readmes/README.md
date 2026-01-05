# README Files

Place your README markdown files in this folder.

## How to Add READMEs

1. **Add your markdown files** to this folder (`public/readmes/`)
2. **Update `manifest.json`** to include your filenames:
   ```json
   {
     "files": [
       "your-readme-file.md",
       "another-readme.md"
     ]
   }
   ```

The app will automatically load all files listed in `manifest.json` when it starts.

## File Format

- Supported extensions: `.md`, `.markdown`, `.txt`
- The app will extract the title from the first H1 heading (`# Title`)
- If no H1 is found, it will use the filename (without extension) as the title

