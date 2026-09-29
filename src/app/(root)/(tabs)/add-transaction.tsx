import { useCreateTransactionMutation } from '@/hooks/mutation/useTransactionMutation';
import { useAccountsQuery } from '@/hooks/queries/useAccountsQuery';
import { Account } from '@/lib/api/accounts';
import { InputMethod } from '@/lib/api/transactions';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/lib/constants/categories';
import { transactionFormSchema, TransactionFormSchema } from '@/lib/validators/transaction';
import { useUser } from '@clerk/expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { Feather } from '@react-native-vector-icons/feather';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { View, Text, KeyboardAvoidingView, Platform, ActivityIndicator, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';

function DEFAULT_VALUES(accounts: Account[]): TransactionFormSchema {
  return {
    type: "EXPENSE",
    amount: "",
    category: "food",
    accountId: accounts[0]?.id ?? "",
    description: "",
    date: new Date()
  }
}

const AddTransaction = () => {
  const { user } = useUser();
  const router = useRouter()
  const params = useLocalSearchParams<{ action?: string }>();

  const {
    data: accounts = [],
    isLoading: accountsLoading,
    isRefetching: accountsRefetching,
    refetch: refetchAccounts,
    isError: accountsError
  } = useAccountsQuery()

  const { mutateAsync: createTransaction, isPending: saving } = useCreateTransactionMutation()

  const [error, setError] = useState("");
  const [datePicker, setDatePicker] = useState(false)
  const [inputMethod, setInputMethod] = useState<InputMethod>("MANUAL");
  const [voiceTranscript, setVoiceTranscript] = useState<string | null>(null);

  const [scanning, setScanning] = useState(false);
  const [scannerOpen, setScannerOpen] = useState();
  const [voiceModalOpen, setVoiceModalOpen] = useState(false)

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset: resetForm,
    formState: { errors }
  } = useForm<TransactionFormSchema>({
    resolver: zodResolver(transactionFormSchema),
    mode: 'onBlur',
    defaultValues: DEFAULT_VALUES([])
  })

  const type = watch("type")
  const category = watch('category')
  const accountId = watch('accountId')
  const date = watch('date')

  const categories = type === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES

  useEffect(() => {
    if (accounts.length > 0) resetForm(DEFAULT_VALUES(accounts))
  }, [accounts, resetForm])


  return (
    <SafeAreaView className="flex-1 bg-brand-body" edges={["top"]}>
      <View className="px-5 pt-3 pb-2">
        <Text className="text-brand-bg text-xl font-semibold">AddTransaction</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {
          accountsLoading ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator color={"#4A9EFF"}/>
            </View>
          ) : accountsError ? (
            <View className="flex-1 items-center justify-center px-10">
              <Feather name="alert-circle" size={32} color={"#FF6B4A"}/>
              <Text className="text-brand-text-muted text-sm mt-3 text-center">
                Couldn't load your accounts
              </Text>
            </View>
          ) : (
            <ScrollView></ScrollView>
          )
        }
      </KeyboardAvoidingView>

    </SafeAreaView>
  )
}

export default AddTransaction