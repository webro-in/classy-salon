import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Media } from '@/components/media/Media'

describe('<Media>', () => {
  it('renders a ratio-correct placeholder for unsupplied slots', () => {
    const { container } = render(<Media slot="beforeAfter01" />)
    const box = container.firstElementChild as HTMLElement
    expect(box.style.getPropertyValue('--ar')).toBe('4 / 5')
    expect(container.querySelector('[data-media-placeholder="beforeAfter01"]')).toBeInTheDocument()
    expect(container.querySelector('img')).toBeNull()
  })

  it('renders supplied photos with an art-directed mobile source', () => {
    const { container } = render(<Media slot="heroSlideHair" />)
    const box = container.firstElementChild as HTMLElement
    expect(box.style.getPropertyValue('--ar')).toBe('16 / 9')
    expect(box.style.getPropertyValue('--ar-m')).toBe('4 / 5')
    expect(container.querySelector('img')?.getAttribute('src')).toBe('/media/photos/heroSlideHair.jpg')
    expect(container.querySelector('source')?.getAttribute('srcset')).toBe('/media/photos/heroSlideHair-m.jpg')
  })

  it('applies the arched mask', () => {
    const { container } = render(<Media slot="introPortrait" shape="arch" />)
    expect(container.firstElementChild).toHaveClass('arch')
  })
  it('fill mode is absolutely positioned and never also relative', () => {
    const { container } = render(<Media slot="heroSlideHair" fit="fill" />)
    const box = container.firstElementChild as HTMLElement
    expect(box).toHaveClass('absolute', 'inset-0')
    expect(box).not.toHaveClass('relative')
  })
})
