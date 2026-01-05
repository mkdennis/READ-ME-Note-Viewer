export interface TocItem {
  id: string
  level: number
  text: string
}

/**
 * Generate a URL-friendly ID from a heading text
 */
export function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

/**
 * Extract table of contents from markdown content
 * Parses headings (H1-H6) and generates IDs for anchor links
 */
export function extractToc(content: string): TocItem[] {
  const toc: TocItem[] = []
  const lines = content.split('\n')
  
  for (const line of lines) {
    // Match markdown headings: # Heading, ## Heading, etc.
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
    
    if (headingMatch) {
      const level = headingMatch[1].length
      const text = headingMatch[2].trim()
      const id = generateHeadingId(text)
      
      toc.push({
        id,
        level,
        text,
      })
    }
  }
  
  return toc
}

/**
 * Add IDs to headings in markdown content
 * This modifies the markdown to include anchor IDs
 */
export function addHeadingIds(content: string): string {
  const lines = content.split('\n')
  const modifiedLines: string[] = []
  
  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
    
    if (headingMatch) {
      const level = headingMatch[1].length
      const text = headingMatch[2].trim()
      const id = generateHeadingId(text)
      
      // Add ID as HTML anchor (will be rendered by react-markdown)
      modifiedLines.push(`${headingMatch[1]} <span id="${id}">${text}</span>`)
    } else {
      modifiedLines.push(line)
    }
  }
  
  return modifiedLines.join('\n')
}

/**
 * Scroll to a heading by ID
 */
export function scrollToHeading(id: string): void {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

