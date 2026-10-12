import type { MouseEventHandler, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { cx } from '@/lib/cx'
import { Icon, type IconName } from '@/components/icons/Icon'

/**
 * The only button/link-button primitive.
 * - solid:   charcoal fill (inverts on dark tone), brass underline slides in on hover
 * - outline: hairline border, fills from the bottom on hover
 * - text:    underlined label
 * Internal paths render <Link>; external/protocol URLs render <a>; no `to` renders <button>.
 */
export type ButtonVariant = 'solid' | 'outline' | 'text'

interface ButtonProps {
  children: ReactNode
  variant?: ButtonVariant
  to?: string
  icon?: IconName
  iconPosition?: 'start' | 'end'
  external?: boolean
  type?: 'button' | 'submit'
  onClick?: MouseEventHandler<HTMLElement>
  className?: string
  ariaLabel?: string
  fullWidth?: boolean
  /** Disclosure buttons only (no `to`). */
  ariaExpanded?: boolean
  ariaControls?: string
}

const base =
  'group relative inline-flex min-h-[3.25rem] items-center justify-center gap-3 px-7 label transition-colors duration-(--duration-ui) ease-(--ease-out) focus-visible:outline-offset-4'

const variants: Record<ButtonVariant, string> = {
  solid: 'bg-fg text-tone hover:bg-fg/90',
  outline:
    'isolate overflow-hidden border border-fg text-fg before:absolute before:inset-0 before:-z-10 before:origin-bottom before:scale-y-0 before:bg-fg before:transition-transform before:duration-(--duration-ui) before:ease-(--ease-out) hover:text-tone hover:before:scale-y-100',
  text: 'min-h-11 px-0 text-fg underline decoration-rule underline-offset-[0.45em] hover:decoration-fg',
}

function Content({ children, icon, iconPosition, variant }: Pick<ButtonProps, 'children' | 'icon' | 'iconPosition' | 'variant'>) {
  return (
    <>
      {icon && iconPosition === 'start' && <Icon name={icon} size={18} />}
      <span>{children}</span>
      {icon && iconPosition === 'end' && (
        <Icon name={icon} size={18} className="transition-transform duration-(--duration-ui) ease-(--ease-out) group-hover:translate-x-0.5" />
      )}
      {variant === 'solid' && (
        <span
          aria-hidden="true"
          className="absolute inset-x-7 bottom-2.5 h-px origin-left scale-x-0 bg-accent transition-transform duration-(--duration-ui) ease-(--ease-out) group-hover:scale-x-100"
        />
      )}
    </>
  )
}

export function Button({
  children,
  variant = 'solid',
  to,
  icon,
  iconPosition = 'start',
  external,
  type = 'button',
  onClick,
  className,
  ariaLabel,
  fullWidth,
  ariaExpanded,
  ariaControls,
}: ButtonProps) {
  const classes = cx(base, variants[variant], fullWidth && 'w-full', className)
  const content = <Content icon={icon} iconPosition={iconPosition} variant={variant}>{children}</Content>

  if (to && !external && to.startsWith('/')) {
    return (
      <Link to={to} className={classes} onClick={onClick} aria-label={ariaLabel}>
        {content}
      </Link>
    )
  }
  if (to) {
    const newTab = external || /^https?:/.test(to)
    return (
      <a href={to} className={classes} onClick={onClick} aria-label={ariaLabel} {...(newTab && { target: '_blank', rel: 'noopener noreferrer' })}>
        {content}
        {newTab && <span className="sr-only"> (opens in a new tab)</span>}
      </a>
    )
  }
  return (
    <button type={type} className={classes} onClick={onClick} aria-label={ariaLabel} aria-expanded={ariaExpanded} aria-controls={ariaControls}>
      {content}
    </button>
  )
}
