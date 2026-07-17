import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { registerSchema, type RegisterInput } from '../schema/auth.schema'
import { useRegisterMutation } from './useRegisterMutation'

export const useRegisterForm = () => {
  const mutation = useRegisterMutation()

  const { handleSubmit, ...form } = useForm<RegisterInput>({
    defaultValues: {
      email: '',
      username: '',
      password: '',
    },
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = handleSubmit(async (data) => {
    console.log(data)
  })

  return {
    ...form,
    onSubmit,
    isLoading: mutation.isPending,
  }
}
