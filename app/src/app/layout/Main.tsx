import { Sidebar } from './Sidebar'

export const Main = ({ children }: React.PropsWithChildren) => {
  return (
    <main className="app-container mx-auto grid w-full flex-1 grid-cols-[250px_1fr] gap-2 max-md:grid-cols-1 max-md:gap-0">
      <Sidebar />
      <div className="border-border bg-card overflow-hidden rounded-2xl border max-md:rounded-none max-md:border-none">
        {children}
      </div>
    </main>
  )
}
