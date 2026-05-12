interface EmptyStateProps {
  message: string
  ctaLabel?: string
  onCta?: () => void
}

export default function EmptyState({ message, ctaLabel, onCta }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <p className="text-gray-500 text-sm">{message}</p>
      {ctaLabel && onCta && (
        <button
          onClick={onCta}
          className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  )
}
