import z from 'zod'

import { contentRequiredSchema } from '~/common/schema/content.schema'

export const createPostSchema = z.object({
  content: contentRequiredSchema,
})

export type CreatePostInput = z.infer<typeof createPostSchema>
