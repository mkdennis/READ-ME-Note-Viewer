import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getAllReadmes, deleteReadme, type Readme } from '@/lib/db'
import { Trash2, FileText } from 'lucide-react'

interface ReadmeListProps {
  onSelectReadme: (readme: Readme) => void
  refreshTrigger?: number
}

export function ReadmeList({ onSelectReadme, refreshTrigger }: ReadmeListProps) {
  const [readmes, setReadmes] = useState<Readme[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadReadmes = async () => {
    setIsLoading(true)
    try {
      const allReadmes = await getAllReadmes()
      setReadmes(allReadmes)
    } catch (error) {
      console.error('Error loading readmes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadReadmes()
  }, [refreshTrigger])

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this README?')) {
      try {
        await deleteReadme(id)
        await loadReadmes()
      } catch (error) {
        console.error('Error deleting readme:', error)
        alert('Failed to delete README')
      }
    }
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getPreview = (content: string, maxLength: number = 150) => {
    const plainText = content.replace(/[#*`\[\]]/g, '').trim()
    if (plainText.length <= maxLength) return plainText
    return plainText.substring(0, maxLength) + '...'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (readmes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <FileText className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-lg">No READMEs yet</p>
        <p className="text-muted-foreground text-sm mt-2">Upload your first README to get started</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-6">
      {readmes.map((readme) => (
        <Card
          key={readme.id}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onSelectReadme(readme)}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="line-clamp-2">{readme.title}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={(e) => handleDelete(readme.id, e)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              {formatDate(readme.uploadedAt)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {getPreview(readme.content)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

