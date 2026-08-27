import { useRef, useState } from 'react'
import { useIntlayer } from 'react-intlayer'
import { FileText, Upload, X } from 'reicon-react'

import { getCurrentLocale } from '~/common/i18n'
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

export const ImdbImportUpload = ({ isUploading, onUpload }: ImdbImportUploadProps) => {
  const content = useIntlayer('imdb-import-upload')
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return content.fileSizeKb({ size: Math.max(1, Math.round(bytes / 1024)) }).value
    }
    return content.fileSizeMb({ size: (bytes / (1024 * 1024)).toFixed(1) }).value
  }

  const validateFile = (next: File): string | null => {
    const isCsv = next.name.toLowerCase().endsWith('.csv') || next.type === 'text/csv'
    if (!isCsv) return content.onlyCsv.value
    if (next.size > IMDB_IMPORT_MAX_FILE_BYTES) {
      return content.fileTooLarge({ size: formatFileSize(next.size), maxSize: MAX_FILE_MB }).value
    }
    return null
  }

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
        aria-label={content.dropzoneLabel.value}
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
          <p className="text-sm font-medium">{content.dropTitle.value}</p>
          <p className="text-muted-foreground text-xs leading-relaxed">
            {
              content.dropDescription({
                size: MAX_FILE_MB,
                rows: IMDB_IMPORT_MAX_ROWS.toLocaleString(getCurrentLocale()),
              }).value
            }
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => inputRef.current?.click()}
          isDisabled={isUploading}
        >
          {content.chooseFile.value}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept={IMDB_IMPORT_ACCEPT}
          className="sr-only"
          aria-label={content.chooseFileAria.value}
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
          <div className="flex flex-1 flex-col">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-muted-foreground text-xs">{formatFileSize(file.size)}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            isIconOnly
            aria-label={content.removeSelectedFile.value}
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
        {content.startImport.value}
      </Button>
    </div>
  )
}
