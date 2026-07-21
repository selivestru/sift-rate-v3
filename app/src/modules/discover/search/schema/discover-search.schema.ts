import z from 'zod'

export const discoverSearchSchema = z.object({
  q: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
})

export type DiscoverSearch = z.infer<typeof discoverSearchSchema>

export const validateDiscoverSearch = (search: Record<string, unknown>): DiscoverSearch => {
  return discoverSearchSchema.parse(search)
}
