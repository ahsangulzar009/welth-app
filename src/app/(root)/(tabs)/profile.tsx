import { useAuth, useUser } from '@clerk/expo';
import { useRouter } from 'expo-router';
import { View, Text, Alert, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';


const Profile = () => {
  const { signOut } = useAuth()
  const { user } = useUser();
  const router = useRouter()

  function handleSignOut() {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.push('/sign-in')
        }
      }
    ])
  }

  return (
    <SafeAreaView className="flex-1 bg-brand-body" edges={["top"]}>
      <TouchableOpacity onPress={handleSignOut}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Profile