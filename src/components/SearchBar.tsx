import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { searchReadmes, type Readme } from '@/lib/db'

interface SearchBarProps {
  onSearchResults: (results: Readme[]) => void
  onSelectReadme: (readme: Readme) => void
}

export function SearchBar({ onSearchResults, onSelectReadme }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Readme[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const debounceTimerRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    if (!query.trim()) {
      setResults([])
      onSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)
    
    // Debounce search
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const searchResults = await searchReadmes(query)
        setResults(searchResults)
        onSearchResults(searchResults)
      } catch (error) {
        console.error('Error searching:', error)
      } finally {
        setIsSearching(false)
      }
    }, 300) // 300ms debounce

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]) // onSearchResults is stable via useCallback, but we exclude it to avoid issues

  const handleClear = () => {
    setQuery('')
    setResults([])
    onSearchResults([])
  }

  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text
    
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'))
    return parts.map((part, index) => 
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-900">
          {part}
        </mark>
      ) : (
        part
      )
    )
  }

  return (
    <div className="relative w-full max-w-2xl min-w-0">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search READMEs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-background border border-border rounded-md shadow-lg max-h-96 overflow-y-auto">
          {results.map((readme) => (
            <button
              key={readme.id}
              onClick={() => {
                onSelectReadme(readme)
                handleClear()
              }}
              className="w-full text-left px-4 py-3 hover:bg-accent transition-colors border-b border-border last:border-b-0"
            >
              <div className="font-medium text-sm mb-1">
                {highlightText(readme.title, query)}
              </div>
              <div className="text-xs text-muted-foreground line-clamp-2">
                {highlightText(readme.content.substring(0, 150), query)}
              </div>
            </button>
          ))}
        </div>
      )}

      {isSearching && query && (
        <div className="absolute z-50 w-full mt-2 bg-background border border-border rounded-md shadow-lg p-4 text-center text-sm text-muted-foreground">
          Searching...
        </div>
      )}
    </div>
  )
}

