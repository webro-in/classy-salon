/**
 * Minimal functional icon set (inline SVG, 1.25px stroke, currentColor).
 * Icons are always paired with visible text or an aria-label; they are not decoration.
 */
export type IconName = 'whatsapp' | 'phone' | 'mail' | 'pin' | 'instagram' | 'plus' | 'close' | 'menu' | 'arrow' | 'arrow-up-right' | 'star' | 'pause' | 'play'

const paths: Record<IconName, string> = {
  whatsapp:
    'M12 3.2a8.8 8.8 0 0 0-7.6 13.2L3.2 20.8l4.5-1.2A8.8 8.8 0 1 0 12 3.2Zm4.6 12.3c-.2.6-1.1 1.1-1.6 1.2-.4 0-.9.1-2.9-.7-2.4-1-4-3.4-4.1-3.6-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.1.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.1.3.6 1.1 1.4 1.8 1 .9 1.8 1.1 2.1 1.3.3.1.4.1.6-.1l.8-1c.2-.3.4-.2.6-.1l1.8.9c.3.1.4.2.5.3.1.1.1.7-.1 1.3Z',
  phone: 'M7.2 3.5h2.6l1.3 4.2-1.9 1.5a11 11 0 0 0 5.6 5.6l1.5-1.9 4.2 1.3v2.6a1.8 1.8 0 0 1-1.9 1.8A15.3 15.3 0 0 1 5.4 5.4a1.8 1.8 0 0 1 1.8-1.9Z',
  mail: 'M3.5 6h17v12h-17V6Zm0 .5 8.5 6.5 8.5-6.5',
  pin: 'M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 1 1 13 0c0 5.4-6.5 11-6.5 11Zm0-8.6a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z',
  instagram: 'M4 8a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Zm8 7.6a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2ZM17.2 6.8h.01',
  plus: 'M12 4v16M4 12h16',
  close: 'M5.5 5.5l13 13M18.5 5.5l-13 13',
  menu: 'M3.5 8h17M3.5 16h17',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  'arrow-up-right': 'M7 17 17 7M9 7h8v8',
  pause: 'M9 6v12M15 6v12',
  play: 'M8 5.5v13l10-6.5-10-6.5Z',
  star: 'm12 3.6 2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8L12 3.6Z',
}

const filled: ReadonlySet<IconName> = new Set(['whatsapp', 'star'])

interface IconProps {
  name: IconName
  size?: number
  className?: string
  /** Provide only when the icon is the sole content of a control. */
  label?: string
}

export function Icon({ name, size = 20, className, label }: IconProps) {
  const isFilled = filled.has(name)
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      fill={isFilled ? 'currentColor' : 'none'}
      stroke={isFilled ? 'none' : 'currentColor'}
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <path d={paths[name]} />
    </svg>
  )
}
