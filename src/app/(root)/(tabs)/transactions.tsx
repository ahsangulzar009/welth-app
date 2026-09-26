import { useDeleteTransactionMutation } from '@/hooks/mutation/useTransactionMutation';
import { useAccountsQuery } from '@/hooks/queries/useAccountsQuery';
import { useTransactionsQuery } from '@/hooks/queries/useTransactionsQuery';
import { Transaction, TransactionType } from '@/lib/api/transactions';
import { exportTransactionsToCSV } from '@/lib/utils';
import { Feather } from '@react-native-vector-icons/feather';
import { eachDayOfInterval, format, startOfDay, startOfMonth } from 'date-fns';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';


const FILTERS = ["All", "Income", "Expense"] as const

function dayKey(date: Date) {
  return format(date, 'dd-MM-yyyy')
}

function currentMonthDays() {
  const today = startOfDay(new Date());
  return eachDayOfInterval({ start: startOfMonth(today), end: today }).map(
    (d) => ({ key: dayKey(d), label: format(d, 'd, MMM') })
  )
}

const Transactions = () => {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState<(typeof FILTERS)[number]>("All")
  const [activeAccountId, setActiveAccountId] = useState<string | null>(null)
  const [search, setSearch] = useState(false)
  const [exporting, setExporting] = useState(false);

  const typeFilter: TransactionType | null =
    activeFilter === 'Income'
      ? "INCOME"
      : activeFilter === "Expense"
        ? "EXPENSE"
        : null

  const {
    data: transactions=[],
    isLoading: transaactionsLoading,
    isRefetching: transactionsRefetching,
    isError: transactionsError,
    refetch: refetchTransactions
  } = useTransactionsQuery({ type: typeFilter, accountId: activeAccountId })

  const { data: accounts, refetch: refetchAccounts } = useAccountsQuery();
  const { mutateAsync: removeTransaction } = useDeleteTransactionMutation();

  const loading = transaactionsLoading;
  const refreshing = transactionsRefetching;
  const error = transactionsError;

  function loadData() {
    refetchTransactions();
    refetchAccounts();
  }

  async function handleExport() {
    if (exporting) return;
    setExporting(true)

    try {
      const { count } = await exportTransactionsToCSV(transactions)
      if (count === 0) {
        Alert.alert("Nothing to export", "No transactions in the export window.")
      }
    } catch (error) {
      console.error("Export failed", error)
      Alert.alert("Error", "Couldn't export transactions.")
    } finally{
      setExporting(false)
    }
  }

  function handleDelete(tx: Transaction) {

  }

  return (
    <SafeAreaView className="flex-1 bg-brand-body" edges={["top", "bottom"]}>
      <View className="px-5 pt-3 pb-2">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-brand-bg text-xl font-semibold">Transactions</Text>

          <TouchableOpacity
            onPress={handleExport}
            disabled={exporting}
            className="size-9 rounded-full bg-white border border-[#E8E6DF] items-center justify-center"
          >
            {
              exporting ? (
                <ActivityIndicator size={"small"} color={"#5C5F68"} />
              ) : (
                <Feather name="download" size={15} color={"#5C5F68"} />
              )
            }
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Transactions