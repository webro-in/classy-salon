import { fireEvent, render } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

// Simulate a supplied asset whose file fails to load.
vi.mock('@/data/media', () => ({
  getSlot: () => ({ id: 'heroSlideHair', kind: 'image', purpose: 'test', ratio: '16:9', size: '2400×1350', alt: 'Hair styling', src: '/media/hero/missing.jpg', status: 'supplied' }),
}))
const track = vi.fn()
vi.mock('@/lib/analytics', () => ({ trackEvent: (...args: unknown[]) => track(...args) }))

const { Media } = await import('@/components/media/Media')

describe('<Media> failure handling', () => {
  it('renders the real image with alt text, lazy by default', () => {
    const { getByAltText } = render(<Media slot="heroSlideHair" />)
    const img = getByAltText('Hair styling')
    expect(img).toHaveAttribute('loading', 'lazy')
  })

  it('swaps to a placeholder and reports media_error when the file fails', () => {
    const { container, getByAltText } = render(<Media slot="heroSlideHair" priority />)
    fireEvent.error(getByAltText('Hair styling'))
    expect(container.querySelector('img')).toBeNull()
    expect(container.querySelector('[data-media-placeholder]')).toHaveTextContent('MEDIA FAILED')
    expect(track).toHaveBeenCalledWith('media_error', { slot: 'heroSlideHair' })
  })
})
