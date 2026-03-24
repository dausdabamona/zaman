interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-2',
  lg: 'h-12 w-12 border-4',
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  return (
    <div
      className={`animate-spin rounded-full border-slate-600 border-t-blue-500 ${sizes[size]} ${className}`}
      role="status"
      aria-label="Memuat..."
    />
  )
}

export function LoadingPage() {
  return (
    <div className="flex flex-1 items-center justify-center min-h-[200px]">
      <LoadingSpinner size="lg" />
    </div>
  )
}
