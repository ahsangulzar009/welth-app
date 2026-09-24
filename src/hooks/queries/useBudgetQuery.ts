import { useUser } from "@clerk/expo";
import { useSupabase } from "../useSupabase";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query/keys";
import { getBudget } from "@/lib/api/budgets";


export function useBudgetQuery() {
  const { user } = useUser()
  const supabase = useSupabase();

  return useQuery({
    queryKey: queryKeys.budget(user?.id),
    queryFn: () => getBudget(supabase, user!.id),
    enabled: !!user
  })
}