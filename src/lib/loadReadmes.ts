import { addReadme, getAllReadmes, clearAllReadmes } from './db'

/**
 * Extract title from markdown content
 */
function extractTitle(content: string, filename: string): string {
  // Try to extract title from first H1 heading
  const h1Match = content.match(/^#\s+(.+)$/m)
  if (h1Match) {
    return h1Match[1].trim()
  }
  
  // Fallback to filename without extension
  return filename.replace(/\.(md|markdown|txt)$/i, '').replace(/[-_]/g, ' ')
}

/**
 * Load README files from the public/readmes folder and add them to IndexedDB
 * This runs once on app initialization
 * 
 * The app looks for a manifest.json file in /readmes/ that lists all README files,
 * or you can manually add filenames to the README_FILES array below.
 */
const README_FILES: string[] = [
  // Manually add README filenames here if not using manifest.json:
  // 'learning-summary.md',
]

/**
 * Load README files from the public/readmes folder and add them to IndexedDB
 */
export async function loadReadmesFromFolder(forceReload = false): Promise<void> {
  try {
    // Check if we already have READMEs in the database
    const existingReadmes = await getAllReadmes()
    
    // If force reload is requested, clear existing READMEs
    if (forceReload && existingReadmes.length > 0) {
      console.log('Force reload requested, clearing existing READMEs...')
      await clearAllReadmes()
    }
    
    // If we already have READMEs and not force reloading, don't reload (to avoid duplicates)
    if (existingReadmes.length > 0 && !forceReload) {
      console.log('READMEs already loaded. Use forceReload=true to reload.')
      return
    }

    // Try to load manifest.json first
    let filesToLoad: string[] = [...README_FILES]
    
    try {
      const manifestResponse = await fetch('/readmes/manifest.json')
      if (manifestResponse.ok) {
        const manifest = await manifestResponse.json()
        if (manifest.files && Array.isArray(manifest.files)) {
          filesToLoad = [...new Set([...filesToLoad, ...manifest.files])] // Merge and deduplicate
        }
      }
    } catch (e) {
      // Manifest not found, use manual list
      console.log('No manifest.json found, using manual file list')
    }

    if (filesToLoad.length === 0) {
      console.log('No README files to load. Add files to public/readmes/ and update manifest.json or README_FILES array')
      return
    }

    // Load all README files from public/readmes folder
    const loadPromises = filesToLoad.map(async (filename) => {
      try {
        let content: string | null = null
        let actualFilename = filename
        
        // Check if filename already has an extension
        const hasExtension = /\.(md|markdown|txt)$/i.test(filename)
        
        if (hasExtension) {
          // Filename already has extension, fetch directly
          const filePath = `/readmes/${filename}`
          try {
            const response = await fetch(filePath)
            if (response.ok) {
              content = await response.text()
              actualFilename = filename
            }
          } catch (e) {
            console.error(`Error fetching ${filePath}:`, e)
          }
        } else {
          // Try different extensions
          const extensions = ['.md', '.markdown', '.txt']
          for (const ext of extensions) {
            const filePath = `/readmes/${filename}${ext}`
            try {
              const response = await fetch(filePath)
              if (response.ok) {
                content = await response.text()
                actualFilename = `${filename}${ext}`
                break
              }
            } catch (e) {
              // Try next extension
              continue
            }
          }
        }

        if (!content) {
          console.warn(`Could not load README file: ${filename}`)
          return
        }

        const title = extractTitle(content, actualFilename)
        
        // Check if this README already exists (by title)
        const existing = existingReadmes.find(r => r.title === title)
        if (!existing) {
          await addReadme(title, content)
          console.log(`Loaded README: ${title}`)
        }
      } catch (error) {
        console.error(`Error loading README file ${filename}:`, error)
      }
    })

    await Promise.all(loadPromises)
  } catch (error) {
    console.error('Error loading READMEs from folder:', error)
  }
}

