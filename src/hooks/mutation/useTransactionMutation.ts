
import { useSupabase } from "../useSupabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTransaction, deleteTransaction, NewTransaction, Transaction } from "@/lib/api/transactions";
import { useUser } from "@clerk/expo";


export function useDeleteTransactionMutation() {
  const { user } = useUser()
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tx: Pick<Transaction, "account_id" | "id" | "amount" | "type">) => {
      return deleteTransaction(
        supabase,
        tx.id,
        tx.account_id,
        tx.amount,
        tx.type
      )
    },
    onSuccess: (result) => {
      if (result.error) return;
      queryClient.invalidateQueries({ queryKey: ["transactions", user!.id] })
      queryClient.invalidateQueries({ queryKey: ["accounts", user!.id] })
    }
  })
}




export function useCreateTransactionMutation() {
  const supabase = useSupabase();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: NewTransaction) => {
      return createTransaction(supabase, payload)
    },
    onSuccess: (result) => {
      if (result.error) return;
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
    }
  })
}