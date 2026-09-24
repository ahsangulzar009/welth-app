import { useAccountsQuery } from '@/hooks/queries/useAccountsQuery';
import { useBudgetQuery } from '@/hooks/queries/useBudgetQuery';
import { useTransactionsQuery } from '@/hooks/queries/useTransactionsQuery';
import { Transaction } from '@/lib/api/transactions';
import { getCategoryConfig } from '@/lib/constants/categories';
import { formatPrice } from '@/lib/utils';
import { useUserStore } from '@/store/userStore';
import { useUser } from '@clerk/expo';
import { Feather } from '@react-native-vector-icons/feather';
import { isSameMonth } from 'date-fns';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, RefreshControl } from 'react-native'
// import { RefreshControl } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

const QUICK_ACTIONS = [
  { icon: "camera", label: "AI Receipt Scan", action: "scan", color: "#1A85FF" },
  { icon: "mic", label: "Voice Entry", action: "voice", color: "#FF6B4A" },
  { icon: "plus", label: "Add Manually", action: "manual", color: "#3DDC84" },
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";

  return "Good Evening"
}

const Home = () => {
  const { user } = useUser()
  const router = useRouter()
  const currency = useUserStore(state => state.currency);

  const [budgetModal, setBudgetModal] = useState(false);

  const {
    data: accounts = [],
    isLoading: accountsLoading,
    isRefetching: accountsRefetching,
    refetch: refetchAccounts
  } = useAccountsQuery()



  const {
    data: transactions = [],
    isLoading: transactionsLoading,
    isRefetching: transactionsRefetching,
    refetch: refetchTransactions
  } = useTransactionsQuery()

  const { data: budget = null, refetch: refetchBudget } = useBudgetQuery()

  const isLoading = accountsLoading || transactionsLoading;
  const refreshing = accountsRefetching || transactionsRefetching;

  function onRefresh() {
    refetchAccounts();
    refetchTransactions();
    refetchBudget();
  }

  const totalBalance = useMemo(() => accounts.reduce((sum, accounts) => sum + Number(accounts.balance), 0), [accounts])
  const monthTransactions = useMemo(() => {
    const now = new Date();
    return transactions.filter((tx) => isSameMonth(new Date(tx.date), now))
  }, [transactions])

  const monthIncome = useMemo(
    () => monthTransactions
      .filter((tx) => tx.type === "INCOME")
      .reduce((sum, tx) => sum + tx.amount, 0),
    [monthTransactions]
  )

  const monthExpense = useMemo(
    () => monthTransactions
      .filter((tx) => tx.type === "EXPENSE")
      .reduce((sum, tx) => sum + tx.amount, 0),
    [monthTransactions]
  )

  const recentTransactions = useMemo(
    () => transactions.slice(0, 5),
    [transactions]
  );

  const expenseBreakdown = useMemo(() => {
    const map: Record<string, number> = {};

    monthTransactions
      .filter((tx) => tx.type === "EXPENSE")
      .forEach((tx) => {
        map[tx.category] = (map[tx.category] ?? 0) + tx.amount
      });

    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([category, amount]) => ({
        category: category as Transaction["category"],
        amount,
        color: getCategoryConfig(category as Transaction["category"]).color
      }))

  }, [monthTransactions])

  return (
    <SafeAreaView className="flex-1 bg-brand-bg" edges={["top"]}>
      <ScrollView
        className="flex-1 bg-brand-body"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="bg-brand-bg rounded-b-[28px] px-5 pt-5 pb-[5px]">
          <View className="flex-row justify-between items-center mb-[22px]">
            <Image
              source={require("../../../assets/images/welth-light.png")}
              style={{ width: 80, height: "100%" }}
              resizeMode="contain"
            />
            <View className="flex-row items-center gap-2.5">
              <View className="items-end">
                <Text className="text-brand-text-secondary text-xs">{getGreeting()}</Text>
                <Text className="text-brand-text-primary text-base font-medium">{user?.firstName ?? "there"} {user?.lastName ?? ""}</Text>
              </View>
              <TouchableOpacity
                onPress={() => router.push("/(root)/(tabs)/profile")}
                className="size-[38px] rounded-full bg-[#1A1D26] items-center justify-center overflow-hidden"
              >
                {
                  user?.imageUrl && user.hasImage ? (
                    <Image
                      source={{ uri: user.imageUrl }}
                      style={{ width: 38, height: 38 }}
                      resizeMode="cover"
                    />
                  ) : (
                    <Feather name="user" size={18} color={"#8A8D96"} />
                  )
                }
              </TouchableOpacity>
            </View>
          </View>

          <View className="mb-[22px]">
            <Text className="text-brand-text-secondary text-sm mb-1">Total balance</Text>
            <Text className="text-brand-text-primary text-[38px] font-medium tracking-tight">
              {formatPrice(totalBalance, currency)}
            </Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home