import { Header } from './Header'
import { Main } from './Main'

export const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="flex min-h-dvh flex-col gap-2 px-4 py-2 max-md:gap-0 max-md:p-0">
      <Header />
      <Main>{children}</Main>
    </div>
  )
}
