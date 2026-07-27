import { useEffect, useRef, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

// "Tapping a cross-ref opens that move in a bottom sheet/modal so the user
// doesn't lose their place" — SPEC §7. Sheet on mobile, centered dialog at
// md+ (same component, just repositioned via breakpoint). Also used at md+
// for the primary move-detail view itself (see MoveDetailPage) — a 3rd
// side-by-side pane next to the category grid + move list read too
// cramped, so the detail floats on top instead, wider than the cross-ref
// peek's modal (maxWidthClassName).
export function BottomSheet({
  onClose,
  children,
  maxWidthClassName = 'md:max-w-lg',
  zIndexClassName = 'z-20',
}: {
  onClose: () => void
  children: ReactNode
  maxWidthClassName?: string
  zIndexClassName?: string
}) {
  const { t } = useTranslation()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    closeButtonRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable =
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      previouslyFocused?.focus()
    }
  }, [onClose])

  return (
    <div
      className={`fixed inset-0 ${zIndexClassName} flex items-end justify-center md:items-center`}
    >
      <button
        type="button"
        aria-label={t('bottomSheet.close')}
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        className={`relative max-h-[85vh] w-full overflow-y-auto rounded-t-xl border border-border bg-bg p-4 shadow-lg md:rounded-xl ${maxWidthClassName}`}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="mb-2 text-sm text-ink-muted"
        >
          {t('bottomSheet.close')}
        </button>
        {children}
      </div>
    </div>
  )
}
