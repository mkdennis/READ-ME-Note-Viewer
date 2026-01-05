import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { addReadme } from '@/lib/db'
import { Upload } from 'lucide-react'

interface FileUploadProps {
  onUploadComplete?: () => void
}

export function FileUpload({ onUploadComplete }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const extractTitle = (content: string, filename: string): string => {
    // Try to extract title from first H1 heading
    const h1Match = content.match(/^#\s+(.+)$/m)
    if (h1Match) {
      return h1Match[1].trim()
    }
    
    // Fallback to filename without extension
    return filename.replace(/\.(md|markdown|txt)$/i, '')
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      const content = await file.text()
      const title = extractTitle(content, file.name)
      
      await addReadme(title, content)
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
      onUploadComplete?.()
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Failed to upload file. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="flex items-center gap-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown,.txt"
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button
        onClick={handleButtonClick}
        disabled={isUploading}
        className="flex items-center gap-2"
      >
        <Upload className="h-4 w-4" />
        {isUploading ? 'Uploading...' : 'Upload README'}
      </Button>
    </div>
  )
}

