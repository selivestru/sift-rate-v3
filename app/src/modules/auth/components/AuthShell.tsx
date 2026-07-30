export const AuthShell = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="relative grid min-h-dvh w-full place-items-center">
      <div className="bg-card sm:border-border relative w-full p-6 sm:my-4 sm:max-w-105 sm:rounded-xl sm:border sm:p-8">
        {children}
      </div>
    </div>
  )
}
