import { useEffect, type ReactNode } from 'react'

// "Tapping a cross-ref opens that move in a bottom sheet/modal so the user
// doesn't lose their place" — SPEC §7. Sheet on mobile, centered dialog at
// md+ (same component, just repositioned via breakpoint).
export function BottomSheet({
  onClose,
  children,
}: {
  onClose: () => void
  children: ReactNode
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-20 flex items-end justify-center md:items-center">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative max-h-[85vh] w-full overflow-y-auto rounded-t-xl border border-border bg-bg p-4 shadow-lg md:max-w-lg md:rounded-xl"
      >
        <button type="button" onClick={onClose} className="mb-2 text-sm text-ink-muted">
          Close
        </button>
        {children}
      </div>
    </div>
  )
}
