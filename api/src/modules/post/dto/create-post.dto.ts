import { Content } from '~/common/decorators/content.decorator'

export class CreatePostDto {
  @Content()
  content!: string
}
