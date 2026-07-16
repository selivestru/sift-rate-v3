import { Button, toast } from '@heroui/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <Button onPress={() => toast('Simple message')}>Show toast</Button>
    </div>
  )
}
