import { useState } from 'react'
import { FileUpload } from '@/components/FileUpload'
import { ReadmeList } from '@/components/ReadmeList'
import { ReadmeViewer } from '@/components/ReadmeViewer'
import { TableOfContents } from '@/components/TableOfContents'
import { SearchBar } from '@/components/SearchBar'
import { Button } from '@/components/ui/button'
import { ArrowLeft, BookOpen } from 'lucide-react'
import type { Readme } from '@/lib/db'

type ViewMode = 'list' | 'reader'

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedReadme, setSelectedReadme] = useState<Readme | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [searchResults, setSearchResults] = useState<Readme[]>([])

  const handleSelectReadme = (readme: Readme) => {
    setSelectedReadme(readme)
    setViewMode('reader')
  }

  const handleBackToList = () => {
    setViewMode('list')
    setSelectedReadme(null)
    setSearchResults([])
  }

  const handleUploadComplete = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  const handleSearchResults = (results: Readme[]) => {
    setSearchResults(results)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-primary" />
              <h1 className="text-xl sm:text-2xl font-bold">README Learning</h1>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              {viewMode === 'list' && (
                <>
                  <div className="flex-1 sm:flex-initial">
                    <SearchBar
                      onSearchResults={handleSearchResults}
                      onSelectReadme={handleSelectReadme}
                    />
                  </div>
                  <FileUpload onUploadComplete={handleUploadComplete} />
                </>
              )}
              {viewMode === 'reader' && (
                <Button
                  variant="outline"
                  onClick={handleBackToList}
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to List
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto min-h-[calc(100vh-73px)]">
        {viewMode === 'list' && (
          <div>
            {searchResults.length > 0 ? (
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">
                  Search Results ({searchResults.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map((readme) => (
                    <div
                      key={readme.id}
                      onClick={() => handleSelectReadme(readme)}
                      className="p-4 border border-border rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-semibold mb-2">{readme.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {readme.content.substring(0, 150)}...
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <ReadmeList
                onSelectReadme={handleSelectReadme}
                refreshTrigger={refreshTrigger}
              />
            )}
          </div>
        )}

        {viewMode === 'reader' && selectedReadme && (
          <div className="flex">
            <TableOfContents readme={selectedReadme} />
            <div className="flex-1 min-w-0 max-w-4xl mx-auto">
              <div className="border-b border-border bg-card px-6 py-6">
                <h2 className="text-2xl font-semibold mb-2">{selectedReadme.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedReadme.uploadedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <ReadmeViewer readme={selectedReadme} />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
