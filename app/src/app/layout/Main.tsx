import { Sidebar } from './Sidebar'

export const Main = ({ children }: React.PropsWithChildren) => {
  return (
    <main className="mx-auto grid w-full max-w-5xl flex-1 grid-cols-[250px_1fr] gap-2 max-md:grid-cols-1 max-md:gap-0">
      <Sidebar />
      <div className="border-border bg-block/50 overflow-clip rounded-3xl border backdrop-blur-2xl max-md:rounded-none max-md:border-none">
        {children}
      </div>
    </main>
  )
}
