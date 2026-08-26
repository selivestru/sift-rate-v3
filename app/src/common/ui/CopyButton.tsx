import { useIntlayer } from 'react-intlayer'
import { Check, Copy } from 'reicon-react'

import { useCopy } from '../hooks/useCopy'
import { Button, type ButtonProps } from './Button'

type CopyButtonProps = ButtonProps & {
  text: string
}

export const CopyButton = ({ text, ...props }: CopyButtonProps) => {
  const shared = useIntlayer('shared')
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
      aria-label={copied ? shared.copied.value : shared.copySecretKey.value}
      onClick={handleCopy}
      {...props}
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
    </Button>
  )
}
