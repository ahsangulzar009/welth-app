import { ALL_CURRENCIES } from '@/components/CurrencyPicker';
import { onboardingFormSchema, OnboardingFormValues } from '@/lib/validators/onboarding';
import { zodResolver } from '@hookform/resolvers/zod';
import { Feather } from '@react-native-vector-icons/feather';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View, Text, KeyboardAvoidingView, Platform, Image, TextInput, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';

const Onboarding = () => {

  const { control, formState: { errors: formErrors } } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingFormSchema),
    mode: 'onBlur',
    defaultValues: { startingBalance: "" }
  })

  const [selectedCurrency, setSelectedCurrency] = useState(
    ALL_CURRENCIES.find((c) => c.code === 'PKR') ?? ALL_CURRENCIES[0]
  )
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function handleSave({ startingBalance }: OnboardingFormValues) { }

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
                  onChangeText={() => { setError(""); onChange(); }}
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
            <Feather name="chevron-down" size={16} color="#8A8D96"/>
          </TouchableOpacity>

          {/* <Controller
            control={control}
            name="password"
            render={({ field: { value, onChange } }) => {
              return <TextInput
                className="border border-[#E8E6DF] bg-white rounded-xl px-4 py-3 text-[#1A1D26]"
                placeholder="password"
                placeholderTextColor="#8A8D96"
                onChangeText={onChange}
                value={value}
                secureTextEntry
              />
            }}
          />
          {signInErrors?.password && <Text className="text-brand-coral">{signInErrors?.password.message}</Text>}
          {errors?.fields.password && <Text className="text-brand-coral">{errors?.fields.password.message}</Text>}

          <TouchableOpacity
            className="w-full bg-brand-blue py-4 rounded-xl items-center my-4"
            onPress={handleSubmit(onSignInPress)}
          >
            {
              fetchStatus === 'fetching' ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-base">SignIn</Text>
              )
            }
          </TouchableOpacity>

          <View className="flex-row justify-center">
            <Text className="text-brand-text-muted">Don't have an account? {" "}</Text>
            <Link href="/sign-up">
              <Text className="text-brand-blue font-semibold">SignUp</Text>
            </Link>
          </View>

          <View nativeID="clerk-captcha" /> */}

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Onboarding