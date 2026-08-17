import { Trim } from './trim.decorator'
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export const POST_MAX_LENGTH = 1000

export interface ContentOptions {
  optional?: boolean
}

export function Content(options: ContentOptions = {}): PropertyDecorator {
  const rules: PropertyDecorator[] = [Trim(), IsString(), MaxLength(POST_MAX_LENGTH)]

  if (options.optional) {
    rules.push(IsOptional())
  } else {
    rules.push(MinLength(1))
  }

  return (target: object, propertyKey: string | symbol) => {
    for (const rule of rules) {
      rule(target, propertyKey)
    }
  }
}
