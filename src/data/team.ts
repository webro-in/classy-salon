import raw from '@content/team.json'
import { parseContent } from '@/lib/content'
import { teamSchema } from '@/types/content'

/** Approved people only (schema enforces approved + consent). Empty → no team section. */
export const teamMembers = parseContent('team', teamSchema, raw).members
