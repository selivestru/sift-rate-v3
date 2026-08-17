import { Content } from '~/common/decorators/content.decorator'

export class UpdatePostDto {
  @Content({ optional: true })
  content?: string
}
