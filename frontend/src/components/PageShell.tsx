type PageShellSize = 'sm' | 'md' | 'lg' | 'xl' | 'screen'

const sizeCls: Record<PageShellSize, string> = {
  sm: 'max-w-2xl',
  md: 'max-w-3xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  screen: 'max-w-screen-xl',
}

export function PageShell({
  children,
  size = 'lg',
  className,
  containerClassName,
  py = 'py-12',
  px = 'px-5',
}: {
  children: React.ReactNode
  size?: PageShellSize
  className?: string
  containerClassName?: string
  py?: string
  px?: string
}) {
  return (
    <div className={`min-h-screen text-white ${className ?? ''}`}>
      <div className={`relative mx-auto ${sizeCls[size]} ${px} ${py} ${containerClassName ?? ''}`}>{children}</div>
    </div>
  )
}