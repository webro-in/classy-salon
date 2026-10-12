import { createBrowserRouter, type RouteObject } from 'react-router-dom'
import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './app/routes'

declare global {
  interface Window {
    __staticRouterHydrationData?: Parameters<typeof createBrowserRouter>[1] extends infer O
      ? O extends { hydrationData?: infer H }
        ? H
        : never
      : never
  }
}

/**
 * vite-react-ssg's default client router (a) ignores the hydration data the
 * server embeds and (b) injects a static-data `loader` into every route. The
 * router then starts "uninitialised" and races a JSON fetch against React's
 * hydration; when the fetch loses, the first client render differs from the
 * prerendered HTML and the app can mount twice.
 *
 * This site uses no loaders, so we strip the injected ones and initialise the
 * router synchronously from the server's hydration data. The first client
 * render then always matches the static HTML.
 */
function withoutLoaders(list: RouteObject[]): RouteObject[] {
  return list.map((route) => {
    const { loader: _loader, children, ...rest } = route
    void _loader
    return (children ? { ...rest, children: withoutLoaders(children) } : rest) as RouteObject
  })
}

/**
 * Entry for both the static build (vite-react-ssg renders every route to HTML)
 * and the browser (hydrates the prerendered HTML).
 */
export const createRoot = ViteReactSSG({
  routes,
  basename: import.meta.env.BASE_URL,
  customCreateRouter: (dataRoutes, options) =>
    createBrowserRouter(withoutLoaders(dataRoutes as RouteObject[]), {
      ...options,
      hydrationData: window.__staticRouterHydrationData,
    }),
  future: {
    v7_relativeSplatPath: true,
    v7_startTransition: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_skipActionErrorRevalidation: true,
  },
})
