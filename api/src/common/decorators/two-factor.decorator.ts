import { applyDecorators, UseGuards } from '@nestjs/common'

import { TwoFactorGuard } from '~/common/guards/two-factor.guard'

export const TwoFactor = () => applyDecorators(UseGuards(TwoFactorGuard))
