import { useEffect, useState, useMemo } from 'react'
import { extractToc, scrollToHeading, type TocItem } from '@/lib/markdown'
import { cn } from '@/lib/utils'
import type { Readme } from '@/lib/db'

interface TableOfContentsProps {
  readme: Readme
}

export function TableOfContents({ readme }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const toc = useMemo(() => extractToc(readme.content), [readme.content])

  useEffect(() => {
    if (toc.length === 0) return

    const handleScroll = () => {
      const headings = toc.map(item => ({
        id: item.id,
        element: document.getElementById(item.id),
      })).filter(h => h.element !== null) as Array<{ id: string; element: HTMLElement }>

      if (headings.length === 0) return

      // Find the heading that's currently in view
      const scrollPosition = window.scrollY + 100 // Offset for better UX

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i]
        if (heading.element.offsetTop <= scrollPosition) {
          setActiveId(heading.id)
          return
        }
      }

      // If scrolled to top, highlight first heading
      if (window.scrollY < 100) {
        setActiveId(headings[0].id)
      }
    }

    // Set initial active heading
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [toc])

  const handleClick = (id: string) => {
    scrollToHeading(id)
    setActiveId(id)
  }

  if (toc.length === 0) {
    return null
  }

  return (
    <div className="hidden lg:block w-64 border-r border-border bg-muted/30 p-6 overflow-y-auto sticky top-0 h-screen">
      <h2 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">
        Table of Contents
      </h2>
      <nav className="space-y-1">
        {toc.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item.id)}
            className={cn(
              "block w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              activeId === item.id
                ? "bg-accent text-accent-foreground font-medium"
                : "text-muted-foreground",
              item.level === 1 && "font-semibold",
              item.level === 2 && "ml-4",
              item.level === 3 && "ml-8",
              item.level === 4 && "ml-12",
              item.level === 5 && "ml-16",
              item.level === 6 && "ml-20"
            )}
          >
            {item.text}
          </button>
        ))}
      </nav>
    </div>
  )
}

