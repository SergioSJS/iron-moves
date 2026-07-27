export function SearchBar({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <input
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      // Search is a dedicated tab destination (not embedded in a longer
      // flow), so autofocus matches SPEC §1's "≤2 taps" lookup goal.
      autoFocus
      className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-base text-ink placeholder:text-ink-muted"
    />
  )
}
