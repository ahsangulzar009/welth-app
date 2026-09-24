import { ALL_CURRENCIES, CurrencyPicker } from '@/components/CurrencyPicker';
import { useSupabase } from '@/hooks/useSupabase';
import { onboardingFormSchema, OnboardingFormValues } from '@/lib/validators/onboarding';
import { useUserStore } from '@/store/userStore';
import { useUser } from '@clerk/expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { Feather } from '@react-native-vector-icons/feather';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View, Text, KeyboardAvoidingView, Platform, Image, TextInput, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';

const Onboarding = () => {
  const { user } = useUser()
  const setCurrency = useUserStore(state => state.setCurrency)
  const setNeedsOnboarding = useUserStore(state => state.setNeedsOnboarding)
  const router = useRouter()
  const { control, handleSubmit, formState: { errors: formErrors, isSubmitting } } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingFormSchema),
    mode: 'onBlur',
    defaultValues: { startingBalance: "" }
  })

  const [selectedCurrency, setSelectedCurrency] = useState(
    ALL_CURRENCIES.find((c) => c.code === 'PKR') ?? ALL_CURRENCIES[138]
  )

  const [pickerOpen, setPickerOpen] = useState(false);
  const authSupabase = useSupabase()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function handleSave({ startingBalance }: OnboardingFormValues) {
    const parsed = parseFloat(startingBalance.replace(/,/g, ""));

    const { error: updateError } = await authSupabase
      .from("users")
      .update({ currency: selectedCurrency.code })
      .eq("clerk_id", user!.id)

    if (updateError) {
      setError("Something went wrong. Please try again")
      return;
    }

    const { data: defaultAccount, error: accountFetchError } =
      await authSupabase
        .from("accounts")
        .select("id, balance")
        .eq("user_id", user!.id)
        .eq("is_default", true)
        .single()

    if (accountFetchError || !defaultAccount) {
      setError("Something went wrong. Please try again.")
      return;
    }

    const { error: txError } = await authSupabase
      .from("transactions")
      .insert({
        user_id: user!.id,
        account_id: defaultAccount.id,
        type: "INCOME",
        amount: parsed,
        category: "other_income",
        description: "Strating balance",
        date: new Date().toISOString(),
        input_method: "MANUAL"
      });

    if (txError) {
      setError("Something went wrong. Please try again.")
      return;
    }

    const { error: balanceError } = await authSupabase
      .from("accounts")
      .update({ balance: defaultAccount.balance + parsed })
      .eq("id", defaultAccount.id)

    if (balanceError) {
      setError("Something went wrong. Please try again.")
      return;
    }

    setCurrency(selectedCurrency.code)
    setNeedsOnboarding(false)
    router.push('/(root)/(tabs)')
  }

  return (
    <SafeAreaView className="flex-1 bg-brand-body" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6 -mt-16">
          <Image
            source={require("../../assets/images/welth.png")}
            className="w-36 h-14 mb-10"
            resizeMode="contain"
          />
          <Text className="text-3xl font-bold text-[#1A1D26] mb-2">
            Let's get you set up
          </Text>
          <Text className="text-brand-text-muted text-sm mb-10">
            A couple of quick details to personlize your experience.
          </Text>
          <Text className="text-brand-text-muted text-sm mb-1">
            Starting balance
          </Text>

          <View className="flex-row items-center bg-white border border-[#E8E6DF] rounded-xl px-4 mb-1">
            <Text className="text-brand-text-secondary text-sm mr-2">{selectedCurrency.symbol}</Text>
            <Controller
              control={control}
              name="startingBalance"
              render={({ field: { value, onChange } }) => {
                return <TextInput
                  className="flex-1 py-3 text-sm text-brand-bg"
                  placeholder="e.g, 50000"
                  placeholderTextColor="#8A8D96"
                  keyboardType="numeric"
                  returnKeyType="done"
                  onChangeText={(text) => { setError(""); onChange(text); }}
                  value={value}
                  autoCapitalize="none"
                />
              }}
            />
            {formErrors?.startingBalance && <Text className="text-brand-coral">{formErrors?.startingBalance.message}</Text>}
          </View>

          <View className="mb-4" />

          <Text className="text-brand-bg text-xs font-medium mb-1.5">Currency</Text>
          <TouchableOpacity
            onPress={() => setPickerOpen(true)}
            className="flex-row items-center justify-between bg-white border border-[#E8E6DF] rounded-xl px-4 py-3.5 mb-6"
          >
            <Text className="text-sm text-brand-bg">
              {selectedCurrency.symbol} {selectedCurrency.code} -{" "}
              {selectedCurrency.name}
            </Text>
            <Feather name="chevron-down" size={16} color="#8A8D96" />
          </TouchableOpacity>



          <TouchableOpacity
            className="bg-brand-bg py-4 rounded-xl items-center"
            onPress={handleSubmit(handleSave)}
            activeOpacity={0.85}
          >
            <Text className="text-white text-sm font-semibold">
              {isSubmitting ? "Saving..." : "Get started"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <CurrencyPicker
        visible={pickerOpen}
        selectedCode={selectedCurrency.code}
        onSelect={(currency) => {
          setSelectedCurrency(currency)
          setPickerOpen(false)
        }}
        onClose={() => setPickerOpen(false)}
      />

    </SafeAreaView>
  )
}

export default Onboarding