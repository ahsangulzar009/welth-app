import { codeFormSchema, signUpFormSchema, SignUpFromSchema } from '@/lib/validators/auth';
import { useAuth, useSignUp } from '@clerk/expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { View, Text, KeyboardAvoidingView, Platform, Image, TextInput } from 'react-native'


const SignUp = () => {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const { control, handleSubmit, formState: { errors: signUpErrors } } = useForm<SignUpFromSchema>({
    resolver: zodResolver(signUpFormSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: ""
    }
  })

  const { control: codeControl, handleSubmit: handleCodeSubmit, formState: { errors: codeErrors } } = useForm<{ code: string }>({
    resolver: zodResolver(codeFormSchema),
    mode: "onBlur",
    defaultValues: { code: "" }
  })

  return (
    <KeyboardAvoidingView
      behavior="padding"
      className="flex-1 bg-brand-body"
    >
      <View className="flex-1 justify-center px-6 -mt-16">
        <Image
          source={require("../../assets/images/welth.png")}
          className="w-36 h-16 mb-8"
          resizeMode="contain"
        />
        <Text className="text-3xl font-bold text-[#1A1D26] mb-2 leading-tight">
          Create account
        </Text>
        <Text className="text-brand-text-muted text-base mb-8">
          Track your money, powered by AI
        </Text>

        <View className="flex-row gap-1">
          <Controller
            control={control}
            name="firstName"
            render={({ field: { value, onChange } }) => {
              return <TextInput
                className="flex-1 border border-[#E8E6DF] bg-white rounded-xl px-4 py-3 text-[#1A1D26]"
                placeholder="First Name"
                placeholderTextColor="#8A8D96"
                onChangeText={onChange}
                value={value}
                autoCapitalize="words"
              />
            }}
          />

          <Controller
            control={control}
            name="lastName"
            render={({ field: { value, onChange } }) => {
              return <TextInput
                className="flex-1 border border-[#E8E6DF] bg-white rounded-xl px-4 py-3 text-[#1A1D26]"
                placeholder="Last Name"
                placeholderTextColor="#8A8D96"
                onChangeText={onChange}
                value={value}
                autoCapitalize="words"
              />
            }}
          />
        </View>
        {
          (signUpErrors.firstName || signUpErrors.lastName) && (
            <Text className="text-brand-coral mb-4 text-sm">
              {signUpErrors.firstName?.message || signUpErrors.lastName?.message}
            </Text>
          )
        }

        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange } }) => {
            return <TextInput
              className="border border-[#E8E6DF] bg-white rounded-xl px-4 py-3 my-1.5 text-[#1A1D26]"
              placeholder="Email"
              placeholderTextColor="#8A8D96"
              onChangeText={onChange}
              value={value}
              autoCapitalize="words"
            />
          }}
        />
        {signUpErrors?.email && <Text className="text-brand-coral">{signUpErrors?.email.message}</Text>}
        {errors?.fields.emailAddress && <Text className="text-brand-coral">{errors?.fields.emailAddress.message}</Text>}

        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange } }) => {
            return <TextInput
              className="border border-[#E8E6DF] bg-white rounded-xl px-4 py-3 text-[#1A1D26]"
              placeholder="password"
              placeholderTextColor="#8A8D96"
              onChangeText={onChange}
              value={value}
              autoCapitalize="words"
            />
          }}
        />
        {signUpErrors?.password && <Text className="text-brand-coral">{signUpErrors?.password.message}</Text>}
        {errors?.fields.password && <Text className="text-brand-coral">{errors?.fields.password.message}</Text>}
      </View>
    </KeyboardAvoidingView>
  )
}

export default SignUp