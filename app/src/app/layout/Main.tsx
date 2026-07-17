import { Sidebar } from './Sidebar'

export const Main = ({ children }: React.PropsWithChildren) => {
  return (
    <main className="mx-auto grid w-full max-w-5xl flex-1 grid-cols-[250px_1fr] gap-2 rounded-2xl max-md:grid-cols-1 max-md:gap-0">
      <Sidebar />
      <div className="border-border bg-block rounded-3xl border max-md:rounded-none max-md:border-none">
        {children}
      </div>
    </main>
  )
}
