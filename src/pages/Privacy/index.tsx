import { PATHS } from '@/app/paths'
import { Seo } from '@/components/seo/Seo'
import { privacyPolicy } from '@/data/legal'
import { LegalPage } from '@/sections/legal/LegalPage'

/** Privacy Policy (draft for client/legal review; describes only what the site actually does). */
export function Component() {
  return (
    <>
      <Seo route="privacy" />
      <LegalPage doc={privacyPolicy} trail={[{ name: 'Home', path: PATHS.home }, { name: 'Privacy Policy', path: PATHS.privacy }]} />
    </>
  )
}
