import type { RouteRecord } from 'vite-react-ssg'
import { PATHS } from './paths'
import { RootLayout } from './RootLayout'

/**
 * Route table. Each page is code-split via `lazy` and prerendered to static
 * HTML at build time (paths listed in src/app/prerender.ts).
 */
export const routes: RouteRecord[] = [
  {
    path: PATHS.home,
    element: <RootLayout />,
    entry: 'src/app/RootLayout.tsx',
    children: [
      { index: true, lazy: () => import('@/pages/Home') },
      { path: PATHS.about.slice(1), lazy: () => import('@/pages/About') },
      { path: PATHS.services.slice(1), lazy: () => import('@/pages/Services') },
      { path: PATHS.gallery.slice(1), lazy: () => import('@/pages/Gallery') },
      { path: PATHS.reviews.slice(1), lazy: () => import('@/pages/Reviews') },
      { path: PATHS.contact.slice(1), lazy: () => import('@/pages/Contact') },
      { path: PATHS.privacy.slice(1), lazy: () => import('@/pages/Privacy') },
      { path: PATHS.terms.slice(1), lazy: () => import('@/pages/Terms') },
      { path: PATHS.styleguide.slice(1), lazy: () => import('@/pages/Styleguide') },
      { path: '*', lazy: () => import('@/pages/NotFound') },
    ],
  },
]
