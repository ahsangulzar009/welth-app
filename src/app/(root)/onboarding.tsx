import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

const Onboarding = () => {
  return (
    <SafeAreaView className="flex-1 bg-brand-body" edges={["top"]}>
      <View>
        <Text>Onboarding</Text>
      </View>
    </SafeAreaView>
  )
}

export default Onboarding