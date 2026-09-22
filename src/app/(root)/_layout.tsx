
import { useUserSync } from '@/hooks/useUserSync';
import { useUserStore } from '@/store/userStore';
import { useAuth } from '@clerk/expo';
import { Redirect, Slot, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const RootGroupLayout = () => {

  const { isSignedIn, isLoaded } = useAuth();
  const needsOnboarding = useUserStore(state => state.needsOnboarding)
  const pathname = usePathname()
  const [minLoadDone, setMinLoadDone] = useState(false)

  useUserSync();

  useEffect(() => {
    const t = setTimeout(() => setMinLoadDone(true), 1500)
    return () => clearInterval(t)
  }, [])

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return <Redirect href="/sign-in" />
  }

  if (!minLoadDone || needsOnboarding) {
    return (
      <SafeAreaView>
        <View>
          <ActivityIndicator size="large" color="#1A1D26" />
        </View>
      </SafeAreaView>
    )
  }
  if (needsOnboarding && pathname !== "/onboarding") {
    return <Redirect href='/(root)/onboarding' />
  }

  return <Slot />;
}

export default RootGroupLayout