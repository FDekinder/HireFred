'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, User } from './api'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ['user'],
    queryFn: () => api.getMe(),
    retry: false,
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('token'),
  })

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      api.login(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
      router.push('/app')
    },
  })

  const registerMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      api.register(email, password),
    onSuccess: () => {
      router.push('/login')
    },
  })

  const logout = () => {
    api.logout()
    queryClient.clear()
    router.push('/')
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    login: loginMutation.mutate,
    loginError: loginMutation.error,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    registerError: registerMutation.error,
    isRegistering: registerMutation.isPending,
    logout,
  }
}
