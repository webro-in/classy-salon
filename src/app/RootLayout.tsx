import { Outlet } from 'react-router-dom'
import { Head } from 'vite-react-ssg'
import displayFont from '@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2?url'
import bodyFont from '@fontsource-variable/hanken-grotesk/files/hanken-grotesk-latin-wght-normal.woff2?url'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/navigation/Header'
import { MobileActionBar } from '@/components/navigation/MobileActionBar'
import { SkipLink } from '@/components/navigation/SkipLink'
import { ScrollManager } from './ScrollManager'
import '@/styles/index.css'

export function RootLayout() {
  return (
    <>
      <Head>
        <link rel="preload" href={displayFont} as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href={bodyFont} as="font" type="font/woff2" crossOrigin="anonymous" />
      </Head>
      <ScrollManager />
      <SkipLink />
      <Header />
      <main id="main" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <Footer />
      <MobileActionBar />
    </>
  )
}
