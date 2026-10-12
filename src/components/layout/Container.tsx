import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'

type ContainerTag = 'div' | 'section' | 'header' | 'footer' | 'article' | 'nav'

export function Container({ as: Tag = 'div', className, children }: { as?: ContainerTag; className?: string; children: ReactNode }) {
  return <Tag className={cx('container-page', className)}>{children}</Tag>
}
