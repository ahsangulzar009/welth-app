import { codeFormSchema, signUpFormSchema, SignUpFromSchema } from '@/lib/validators/auth';
import { useAuth, useSignUp } from '@clerk/expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View, Text, KeyboardAvoidingView, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'


const SignUp = () => {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("")
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

  async function onSignUpPress(values: SignUpFromSchema) {
    setEmail(values.email)

    const { error } = await signUp.password({
      emailAddress: values.email,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName
    })

    if (error) {
      console.error(JSON.stringify(error, null, 2))
      return;
    }

    if (!error) await signUp.verifications.sendEmailCode()

  }

  async function onVerifyPress({ code }: { code: string }) {
    await signUp.verifications.verifyEmailCode({ code })

    if (signUp.status === 'complete') {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return;
          const url = decorateUrl("/")
          router.replace(url as any)
        }
      })
    } else {
      console.error("Sign-Up attempt not complete:", signUp)
    }
  }

  if(signUp.status ==='complete' || isSignedIn){
    return null;
  }

  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <KeyboardAvoidingView behavior="padding" className="flex-1 bg-brand-body">
        <View className="flex-1 justify-center px-6 -mt-16">
          <Image
            source={require("../../assets/images/welth.png")}
            className="w-36 h-16 mb-8"
            resizeMode="contain"
          />
          <Text className="text-3xl font-bold text-[#1A1D26] mb-2 leading-tight">
            Verify your account
          </Text>
          <Text className="text-brand-text-muted text-base mb-8">
            We sent a code to {email}
          </Text>

          <Controller
            control={codeControl}
            name="code"
            render={({ field: { value, onChange } }) => {
              return <TextInput
                className="border border-[#E8E6DF] bg-white rounded-xl px-4 py-3 my-1.5 text-[#1A1D26]"
                placeholder="Enter verification code"
                placeholderTextColor="#8A8D96"
                onChangeText={onChange}
                value={value}
              />
            }}
          />
          {codeErrors?.code && <Text className="text-brand-coral">{codeErrors?.code.message}</Text>}
          {errors?.fields.code && <Text className="text-brand-coral">{errors?.fields.code.message}</Text>}

          <TouchableOpacity
            className="w-full bg-brand-blue py-4 rounded-xl items-center my-4"
            onPress={handleCodeSubmit(onVerifyPress)}
          >
            {
              fetchStatus === 'fetching' ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-semibold text-base">Verify</Text>
              )
            }
          </TouchableOpacity>

          <TouchableOpacity
            className="py-2"
            onPress={() => signUp.verifications.sendEmailCode()}
          >
            <Text className="text-brand-blue text-sm">I need a new code</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="py-2"
            onPress={() => signUp.reset()}
          >
            <Text className="text-brand-blue text-sm">Start over</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    )
  }

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
              autoCapitalize="none"
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
              secureTextEntry
            />
          }}
        />
        {signUpErrors?.password && <Text className="text-brand-coral">{signUpErrors?.password.message}</Text>}
        {errors?.fields.password && <Text className="text-brand-coral">{errors?.fields.password.message}</Text>}

        <TouchableOpacity
          className="w-full bg-brand-blue py-4 rounded-xl items-center my-4"
          onPress={handleSubmit(onSignUpPress)}
        >
          {
            fetchStatus === 'fetching' ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-base">SignUp</Text>
            )
          }
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="text-brand-text-muted">Already have an account? {" "}</Text>
          <Link href="/sign-in">
            <Text className="text-brand-blue font-semibold">Sign In</Text>
          </Link>
        </View>

        <View nativeID="clerk-captcha" />

      </View>
    </KeyboardAvoidingView>
  )
}

export default SignUp