export const AuthShell = ({ children }: React.PropsWithChildren) => {
  return (
    <div className="relative grid min-h-dvh w-full place-items-center">
      <div className="bg-card border-border relative w-full max-w-105 rounded-xl border p-6 sm:p-8">
        {children}
      </div>
    </div>
  )
}
