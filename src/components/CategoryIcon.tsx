import { createElement } from 'react'
import { CATEGORY_ICONS, getCategoryIconKey } from './categoryIconMap'

// createElement (not JSX) deliberately — picking a component out of a map at
// render time is exactly the "component created during render" shape
// react-hooks/static-components flags for JSX usage; this is a real static
// component being *selected*, not created, and createElement sidesteps the
// false positive.
export function CategoryIcon({
  categoryId,
  className,
}: {
  categoryId: string
  className?: string
}) {
  const icon = CATEGORY_ICONS[getCategoryIconKey(categoryId)]
  return icon ? createElement(icon, { className }) : null
}
