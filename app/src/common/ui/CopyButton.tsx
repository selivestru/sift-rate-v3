import { Check, Copy } from 'reicon-react'

import { useCopy } from '../hooks/useCopy'
import { Button, type ButtonProps } from './Button'

type CopyButtonProps = ButtonProps & {
  text: string
}

export const CopyButton = ({ text, ...props }: CopyButtonProps) => {
  const { copy, copied } = useCopy()

  const handleCopy = async () => {
    await copy(text)
  }

  return (
    <Button
      isIconOnly
      type="button"
      variant="outline"
      size="sm"
      aria-label={copied ? 'Copied' : 'Copy secret key'}
      onClick={handleCopy}
      {...props}
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
    </Button>
  )
}
