import { cn } from '~/common/utils/cn'

const PARTICLES = [
  { id: 'p1', left: '12%', top: '18%', size: 3, duration: '4.2s', delay: '0s', soft: false },
  { id: 'p2', left: '28%', top: '62%', size: 2, duration: '5.5s', delay: '0.8s', soft: false },
  { id: 'p3', left: '48%', top: '28%', size: 4, duration: '6.1s', delay: '1.4s', soft: true },
  { id: 'p4', left: '66%', top: '72%', size: 2, duration: '4.8s', delay: '0.3s', soft: false },
  { id: 'p5', left: '82%', top: '22%', size: 3, duration: '5.9s', delay: '2.1s', soft: false },
  { id: 'p6', left: '18%', top: '78%', size: 2, duration: '6.4s', delay: '1.1s', soft: false },
  { id: 'p7', left: '55%', top: '48%', size: 5, duration: '7s', delay: '0.5s', soft: true },
  { id: 'p8', left: '74%', top: '42%', size: 2, duration: '4.5s', delay: '2.6s', soft: false },
  { id: 'p9', left: '38%', top: '12%', size: 3, duration: '5.2s', delay: '1.8s', soft: false },
  { id: 'p10', left: '90%', top: '58%', size: 2, duration: '6.8s', delay: '3.2s', soft: false },
  { id: 'p11', left: '8%', top: '42%', size: 2, duration: '5s', delay: '2.4s', soft: false },
  { id: 'p12', left: '60%', top: '88%', size: 3, duration: '4.6s', delay: '1.6s', soft: false },
] as const

export const PerfectStardust = () => {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 z-0 overflow-hidden',
        'opacity-70 transition-opacity duration-500 group-hover/card:opacity-100',
      )}
      aria-hidden
    >
      {PARTICLES.map((particle) => (
        <span
          key={particle.id}
          className={cn(
            'animate-perfect-stardust absolute bg-rating',
            particle.soft ? 'rounded-sm rotate-45 blur-[1px]' : 'rounded-full',
          )}
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            boxShadow:
              particle.size >= 4
                ? '0 0 8px color-mix(in oklab, var(--rating) 55%, transparent)'
                : '0 0 4px color-mix(in oklab, var(--rating) 40%, transparent)',
            '--stardust-duration': particle.duration,
            '--stardust-delay': particle.delay,
          }}
        />
      ))}
    </div>
  )
}
