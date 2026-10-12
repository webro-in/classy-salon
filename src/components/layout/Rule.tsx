import { cx } from '@/lib/cx'

/** Hairline divider. Decorative: hidden from assistive tech. */
export function Rule({ vertical = false, className }: { vertical?: boolean; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cx('block bg-rule', vertical ? 'w-px self-stretch' : 'h-px w-full', className)}
    />
  )
}
