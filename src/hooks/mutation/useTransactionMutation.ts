
import { useSupabase } from "../useSupabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTransaction, Transaction } from "@/lib/api/transactions";
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
      if(result.error) return;
      queryClient.invalidateQueries({queryKey: ["transactions", user!.id]})
      queryClient.invalidateQueries({queryKey: ["accounts", user!.id]})
    }
  })
}