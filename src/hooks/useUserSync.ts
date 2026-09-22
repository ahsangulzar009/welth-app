import { useUserStore } from "@/store/userStore";
import { useUser } from "@clerk/expo";
import { useSupabase } from "./useSupabase";
import { useEffect } from "react";

export const useUserSync = () => {
  const { user } = useUser()
  const setCurrency = useUserStore((state) => state.setCurrency)
  const setNeedsOnboarding = useUserStore((state) => state.setNeedsOnboarding);
  const authSupabase = useSupabase();

  useEffect(() => {
    if (!user) return;

    async function syncUser() {
      try {
        const { data: existingUser, error: fetchError } = await authSupabase
          .from("users")
          .select("clerk_id, currency")
          .eq("clerk_id", user?.id)
          .single()

        if (fetchError && fetchError.code !== "PGRST116") {
          console.error("Error fetch user", fetchError)
          setNeedsOnboarding(true);
          return;
        }

        if (existingUser) {
          setCurrency(existingUser.currency ?? "PKR")
          setNeedsOnboarding(!existingUser.currency)
          return;
        }

        const email = user?.emailAddresses[0].emailAddress;
        const { data: newUser, error: insertError } = await authSupabase
          .from("users")
          .upsert(
            {
              clerk_id: user?.id,
              email,
              name: `${user?.firstName ?? ""} ${user?.lastName}`.trim(),
              image_url: user?.imageUrl
            },
            { onConflict: "clerk_id", ignoreDuplicates: false }
          )
          .select("currency")
          .single();

        if (insertError) {
          console.error("Error upserting user", insertError)
          setNeedsOnboarding(true);
          return;
        }

        setCurrency(newUser.currency ?? "PKR")
        setNeedsOnboarding(!newUser.currency);

        const { error: accountError } = await authSupabase
          .from("accounts")
          .insert({
            user_id: user?.id,
            name: "Cash",
            type: "CASH",
            balance: 0,
            is_default: true
          })

        if (accountError) {
          console.error("Error creating default account", accountError)
        }

      } catch (error) {
        console.error("Unexpected sync error", error)
        setNeedsOnboarding(true)
      }
    }

    syncUser()
  }, [user?.id])
}