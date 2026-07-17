import { Separator } from '@heroui/react'

export const AuthDivider = () => {
  return (
    <div className="flex items-center gap-3">
      <Separator className="flex-1" />
      <span className="text-muted shrink-0 text-xs">or continue with email</span>
      <Separator className="flex-1" />
    </div>
  )
}
