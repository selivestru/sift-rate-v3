export const AppBackdrop = () => {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="bg-body absolute inset-0" />
      <div className="bg-surface-secondary/25 absolute inset-0" />

      <div className="absolute inset-0 bg-[linear-gradient(165deg,oklch(54.09%_0.2471_299.89/0.07)_0%,transparent_42%,oklch(54.09%_0.16_280/0.05)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_10%,oklch(54.09%_0.2471_299.89/0.16),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_10%_90%,oklch(54.09%_0.18_320/0.14),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(65%_0.12_280/0.06),transparent_65%)]" />

      <div
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.22]"
        style={{
          backgroundImage: 'radial-gradient(oklch(54.09% 0.08 299.89 / 0.45) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />

      <div className="auth-blob absolute -top-24 right-[-10%] size-88 rounded-full bg-[oklch(54.09%_0.2471_299.89/0.22)] blur-3xl" />
      <div className="auth-blob auth-blob-delay absolute top-[38%] left-[-18%] size-72 rounded-full bg-[oklch(54.09%_0.2_320/0.16)] blur-3xl" />
      <div className="auth-blob auth-blob-delay-2 absolute -right-16 bottom-[-8%] size-80 rounded-full bg-[oklch(62%_0.14_280/0.14)] blur-3xl" />

      <div className="absolute top-[18%] right-[12%] size-28 rounded-full border border-[oklch(54.09%_0.2_299.89/0.14)] opacity-70" />
      <div className="absolute top-[22%] right-[16%] size-16 rounded-full border border-[oklch(54.09%_0.18_320/0.12)] opacity-50" />
      <div className="absolute bottom-[16%] left-[10%] size-20 rotate-12 rounded-2xl border border-[oklch(54.09%_0.15_299.89/0.12)] opacity-60" />
    </div>
  )
}
