import type { CopyField, Field, Pending } from '@/types/content'

export function isVerified<T>(field: Field<T>): field is { status: 'verified'; value: T } {
  return field.status === 'verified'
}

export function valueOf<T>(field: Field<T>): T | null {
  return field.status === 'verified' ? field.value : null
}

/** Copy that may ship: verified or WEBRO draft (draft is listed by content:check for client review). */
export function copyOf(field: CopyField): string | null {
  return field.status === 'pending' ? null : field.value
}

export function isPending(field: { status: string }): field is Pending {
  return field.status === 'pending'
}

/** Parses JSON content with a zod schema and gives a readable build error on failure. */
export function parseContent<T>(name: string, schema: { safeParse: (d: unknown) => { success: true; data: T } | { success: false; error: { issues: { path: PropertyKey[]; message: string }[] } } }, data: unknown): T {
  const result = schema.safeParse(data)
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  • ${i.path.join('.')}: ${i.message}`).join('\n')
    throw new Error(`Invalid content in content/${name}.json\n${issues}`)
  }
  return result.data
}
