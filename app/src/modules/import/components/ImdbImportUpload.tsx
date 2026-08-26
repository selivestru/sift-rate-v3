import { useRef, useState } from 'react'
import { FileText, Upload, X } from 'reicon-react'

import { Alert, AlertDescription } from '~/common/ui/Alert'
import { Button } from '~/common/ui/Button'
import { cn } from '~/common/utils/cn'

import {
  IMDB_IMPORT_ACCEPT,
  IMDB_IMPORT_MAX_FILE_BYTES,
  IMDB_IMPORT_MAX_ROWS,
} from '../constants/imdb-import'

const MAX_FILE_MB = IMDB_IMPORT_MAX_FILE_BYTES / (1024 * 1024)

type ImdbImportUploadProps = {
  isUploading: boolean
  onUpload: (file: File) => void
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const validateFile = (file: File): string | null => {
  const isCsv = file.name.toLowerCase().endsWith('.csv') || file.type === 'text/csv'
  if (!isCsv) {
    return 'Only CSV files are accepted. Export your ratings from IMDb as a CSV file.'
  }
  if (file.size > IMDB_IMPORT_MAX_FILE_BYTES) {
    return `This file is ${formatFileSize(file.size)}. The maximum size is ${MAX_FILE_MB} MB.`
  }
  return null
}

export const ImdbImportUpload = ({ isUploading, onUpload }: ImdbImportUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const selectFile = (next: File | null) => {
    if (!next) return

    const validationError = validateFile(next)
    if (validationError) {
      setFile(null)
      setError(validationError)
      return
    }

    setError(null)
    setFile(next)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    selectFile(event.target.files?.[0] ?? null)
    event.target.value = ''
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragging(false)
    if (isUploading) return
    selectFile(event.dataTransfer.files?.[0] ?? null)
  }

  const handleClear = () => {
    setFile(null)
    setError(null)
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        role="group"
        aria-label="IMDb ratings CSV dropzone"
        onDragOver={(event) => {
          event.preventDefault()
          if (!isUploading) setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          'border-border bg-background flex flex-col items-center gap-3 rounded-xl border border-dashed px-4 py-10 text-center transition-colors duration-200',
          isDragging && 'border-ring bg-accent',
        )}
      >
        <span className="bg-accent text-primary flex size-11 items-center justify-center rounded-lg">
          <Upload className="size-5" aria-hidden />
        </span>
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">Drop your ratings CSV here</p>
          <p className="text-muted-foreground text-xs leading-relaxed">
            CSV up to {MAX_FILE_MB} MB, at most {IMDB_IMPORT_MAX_ROWS.toLocaleString('en-US')} rows
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          isDisabled={isUploading}
        >
          Choose file
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept={IMDB_IMPORT_ACCEPT}
          className="sr-only"
          aria-label="Choose IMDb ratings CSV file"
          onChange={handleInputChange}
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {file && (
        <div className="border-border bg-card flex items-center gap-3 rounded-xl border px-4 py-3">
          <span className="bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-lg">
            <FileText className="size-4" aria-hidden />
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-muted-foreground text-xs">{formatFileSize(file.size)}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            isIconOnly
            aria-label="Remove selected file"
            onClick={handleClear}
            isDisabled={isUploading}
          >
            <X aria-hidden />
          </Button>
        </div>
      )}

      <Button
        type="button"
        fullWidth
        isLoading={isUploading}
        isDisabled={!file}
        startIcon={<Upload aria-hidden />}
        onClick={() => file && onUpload(file)}
      >
        Start import
      </Button>
    </div>
  )
}
