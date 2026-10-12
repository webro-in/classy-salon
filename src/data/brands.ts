import raw from '@content/brands.json'
import { parseContent } from '@/lib/content'
import { brandsSchema } from '@/types/content'

const data = parseContent('brands', brandsSchema, raw)

export const brandsHeading = data.heading
export const brands = data.brands
export const logoBrands = brands.filter((b) => b.kind === 'logo')
export const nameBrands = brands.filter((b) => b.kind === 'name')
