"use client";

import { useMutation, useQueryClient, QueryKey, UseMutationResult } from "@tanstack/react-query";

/**
 * A reusable hook for performing optimistic updates with React Query.
 * Automatically handles canceling outgoing queries, snapshotting current cache state,
 * performing the optimistic update, rolling back on error, and invalidating on settle.
 *
 * @param mutationFn           – The async function that performs the network request.
 * @param queryKeyToInvalidate – The cache query key to update and eventually invalidate.
 * @param updateFn             – Pure function defining how to apply the variables to the cached data.
 *
 * @example
 *   const mutation = useOptimisticMutation(
 *     updateProjectApi,
 *     ["PROJECTS", projectId],
 *     (oldProject, updatedFields) => ({ ...oldProject, ...updatedFields })
 *   );
 */
export function useOptimisticMutation<TData = any, TError = Error, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  queryKeyToInvalidate: QueryKey,
  updateFn: (oldData: any, newVariables: TVariables) => any
): UseMutationResult<TData, TError, TVariables, { previousData: any }> {
  const queryClient = useQueryClient();

  return useMutation<TData, TError, TVariables, { previousData: any }>({
    mutationFn,
    // Step 1: On initiate, perform optimistic update
    onMutate: async (newVariables: TVariables) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic state
      await queryClient.cancelQueries({ queryKey: queryKeyToInvalidate });

      // Snapshot the previous value for rollbacks
      const previousData = queryClient.getQueryData(queryKeyToInvalidate);

      // Optimistically update to the new value in the cache
      queryClient.setQueryData(queryKeyToInvalidate, (old: any) => {
        if (old === undefined || old === null) return old;
        return updateFn(old, newVariables);
      });

      // Return context with snapshotted value to onError
      return { previousData };
    },
    // Step 2: If the mutation fails, rollback cache to snapshot
    onError: (err, newVariables, context) => {
      if (context?.previousData !== undefined) {
        queryClient.setQueryData(queryKeyToInvalidate, context.previousData);
      }
    },
    // Step 3: Always refetch after success or error to sync with the server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
    },
  });
}

export default useOptimisticMutation;
