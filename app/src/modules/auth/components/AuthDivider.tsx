import { Separator } from '~/common/ui/Separator'

export const AuthDivider = () => {
  return (
    <div className="flex items-center gap-3">
      <Separator className="flex-1" />
      <span className="text-muted-foreground shrink-0 text-xs">or continue with email</span>
      <Separator className="flex-1" />
    </div>
  )
}
