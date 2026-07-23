import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { X } from 'reicon-react'

import { Button } from '~/common/ui/Button'
import { cn } from '~/common/utils/cn'

export const Dialog = ({ ...props }: DialogPrimitive.Root.Props) => {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

export const DialogTrigger = ({ ...props }: DialogPrimitive.Trigger.Props) => {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

export const DialogPortal = ({ ...props }: DialogPrimitive.Portal.Props) => {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

export const DialogClose = ({ ...props }: DialogPrimitive.Close.Props) => {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

export const DialogOverlay = ({ className, ...props }: DialogPrimitive.Backdrop.Props) => {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        'data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0 fixed inset-0 isolate z-50 bg-black/40 duration-200 supports-backdrop-filter:backdrop-blur-sm',
        className,
      )}
      {...props}
    />
  )
}

export const DialogContent = ({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
}) => {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          'bg-popover text-popover-foreground border-border data-open:animate-blur-morph-in data-closed:animate-blur-morph-out fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-6 rounded-xl border p-6 text-sm shadow-lg outline-none sm:max-w-md',
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button isIconOnly variant="ghost" className="absolute top-4 right-4" size="sm" />
            }
          >
            <X />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

export const DialogHeader = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div data-slot="dialog-header" className={cn('flex flex-col gap-1.5', className)} {...props} />
  )
}

export const DialogFooter = ({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  showCloseButton?: boolean
}) => {
  return (
    <div
      data-slot="dialog-footer"
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>Close</DialogPrimitive.Close>
      )}
    </div>
  )
}

export const DialogTitle = ({ className, ...props }: DialogPrimitive.Title.Props) => {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('text-base leading-none font-medium', className)}
      {...props}
    />
  )
}

export const DialogDescription = ({ className, ...props }: DialogPrimitive.Description.Props) => {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        'text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground',
        className,
      )}
      {...props}
    />
  )
}
