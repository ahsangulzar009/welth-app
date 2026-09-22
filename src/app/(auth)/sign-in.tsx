import { codeFormSchema, signInFormSchema, SignInFromSchema } from '@/lib/validators/auth';
import { useSignIn } from '@clerk/expo';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { View, Text, KeyboardAvoidingView, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';


const SignIn = () => {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter()

  const { control, handleSubmit, formState: { errors: signInErrors } } = useForm<SignInFromSchema>({
    resolver: zodResolver(signInFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const { control: codeControl, handleSubmit: handleCodeSubmit, formState: { errors: codeErrors } } = useForm<{ code: string }>({
    resolver: zodResolver(codeFormSchema),
    mode: "onBlur",
    defaultValues: { code: "" }
  })

  async function onSignInPress(values: SignInFromSchema) {
    const { error } = await signIn.password({
      emailAddress: values.email,
      password: values.password,
    })

    if (error) return;

    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return;
          const url = decorateUrl("/")
          router.replace(url as any)
        }
      })
    } else if (signIn.status === 'needs_second_factor') {
      await signIn.mfa.sendPhoneCode()
    } else if (signIn.status === 'needs_client_trust') {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === 'email_code'
      )
      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode()
      }
    } else {
      console.error("Sign-in attempt not completed", signIn)
    }
  }

  async function onVerifyPress({ code }: { code: string }) {
    await signIn.mfa.verifyEmailCode({ code })

    if (signIn.status === 'complete') {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return;
          const url = decorateUrl("/")
          router.replace(url as any)
        }
      })
    } else {
      console.error("Sign-Up attempt not complete:", signIn)
    }
  }

  if (signIn.status === 'needs_client_trust') {
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
            onPress={() => signIn.mfa.sendEmailCode()}
          >
            <Text className="text-brand-blue text-sm">I need a new code</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="py-2"
            onPress={() => signIn.reset()}
          >
            <Text className="text-brand-blue text-sm">Start over</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-brand-body">
      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1"
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
          {signInErrors?.email && <Text className="text-brand-coral">{signInErrors?.email.message}</Text>}
          {errors?.fields.identifier && <Text className="text-brand-coral">{errors?.fields.identifier.message}</Text>}

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

          <View nativeID="clerk-captcha" />

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default SignIn