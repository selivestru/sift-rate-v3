import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { loginSchema, type LoginInput } from '../schema/auth.schema'
import { useAuthStore } from '../store/auth.store'
import { useLoginMutation } from './useLoginMutation'

export const useLoginForm = () => {
  const mutation = useLoginMutation()
  const setUser = useAuthStore((state) => state.setUser)

  const { handleSubmit, ...form } = useForm<LoginInput>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await mutation.mutateAsync(data)

      setUser(response.user)
    } catch (err) {}
  })

  return {
    ...form,
    onSubmit,
    isLoading: mutation.isPending,
  }
}
