interface AuthFormHeaderProps {
  title: string
  subtitle: string
}

export const AuthFormHeader = ({ title, subtitle }: AuthFormHeaderProps) => {
  return (
    <div className="space-y-1.5">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="text-muted-foreground text-sm leading-relaxed">{subtitle}</p>
    </div>
  )
}
