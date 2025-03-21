import { axiosInstance } from '@/api/axios-config.ts'
import { ENDPOINTS } from '@/constants/endpoints.ts'
import { useUserQuery } from '@/hooks/use-auth'
import { notify } from '@/lib/notify.ts'
import { ActiveShiftResponse } from '@/types/shifts-query.types.ts'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const shiftKeys = {
  all: ['shifts'] as const,
  active: (userId: string) => [...shiftKeys.all, 'active', userId] as const,
}

export const useActiveShiftQuery = () => {
  const { userId } = useUserQuery()

  return useQuery({
    queryKey: shiftKeys.active(userId),
    queryFn: async () => axiosInstance.get<ActiveShiftResponse>(
      ENDPOINTS.SHIFTS.ACTIVE(userId || '')
    ),
    enabled: !!userId,
    select: (response) => response.data,
  })
}

type StartShiftMutationVariables = {
  userId: string
  storeId: string
}

export const useStartShiftMutation = (
  args: {
    onSuccess?: () => void
  } | void
) => {
  const client = useQueryClient()

  const { onSuccess } = args || {}

  return useMutation({
    mutationFn: async (variables: StartShiftMutationVariables) =>
      axiosInstance.post(ENDPOINTS.SHIFTS.START, variables),
    onSuccess: (_, variables) => {
      onSuccess?.()
      client.invalidateQueries({ queryKey: shiftKeys.active(variables.userId) })
      notify({ message: 'Shift successfully started!' })
    },
    onError: (error) => {
      notify({
        type: 'error',
        message: error?.message || 'Something went wrong',
      })
    },
  })
}

export const useCloseShiftMutation = (
  args: {
    onSuccess?: () => void
  } | void
) => {
  const client = useQueryClient()

  const { onSuccess } = args || {}

  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) =>
      axiosInstance.post(ENDPOINTS.SHIFTS.CLOSE, { userId }),
    onSuccess: (_, variables) => {
      onSuccess?.()
      client.invalidateQueries({ queryKey: shiftKeys.active(variables.userId) })
      notify({ message: 'Shift successfully ended!' })
    },
    onError: (error) => {
      notify({
        type: 'error',
        message: error?.message || 'Something went wrong',
      })
    },
  })
}
