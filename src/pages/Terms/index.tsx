import { PATHS } from '@/app/paths'
import { Seo } from '@/components/seo/Seo'
import { termsAndConditions } from '@/data/legal'
import { LegalPage } from '@/sections/legal/LegalPage'

/** Terms & Conditions (draft for client/legal review; no invented policies). */
export function Component() {
  return (
    <>
      <Seo route="terms" />
      <LegalPage doc={termsAndConditions} trail={[{ name: 'Home', path: PATHS.home }, { name: 'Terms & Conditions', path: PATHS.terms }]} />
    </>
  )
}
