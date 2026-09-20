import { Tabs } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Platform } from 'react-native';

export default function TabLayout() {
  const useNativeTabs = Platform.OS === 'ios'


  return (
    <NativeTabs
      backgroundColor={useNativeTabs ? "#0B0E14" : "#FFFFFF"}
      tintColor="#4A9EFF"
      iconColor={{ default: "#5C5F68" }}
      labelStyle={{
        default: { color: "#5C5F68" },
        selected: { color: "#4A9EFF" }
      }}

    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="transactions">
        <NativeTabs.Trigger.Icon sf="list.bullet" md="list" />
        <NativeTabs.Trigger.Label>Transactions</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="add-transaction">
        <NativeTabs.Trigger.Icon sf="plus.circle.fill" md="add_circle" />
        <NativeTabs.Trigger.Label>Add</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="assistant">
        <NativeTabs.Trigger.Icon sf="brain.head.profile" md="psychology" />
        <NativeTabs.Trigger.Label>Assistant</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Icon sf="person.fill" md="person" />
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

    </NativeTabs>
  )

}

















// import { Feather } from '@react-native-vector-icons/feather';
// import { Tabs } from 'expo-router'
// import { NativeTabs } from 'expo-router/unstable-native-tabs'
// import { Platform } from 'react-native'

// const COLORS = {
//   background: '#0B0E14',
//   active: '#4A9EFF',
//   inactive: '#5C5F68',
//   border: '#1C2029',
// }

// export default function TabLayout() {
//   const useNativeTabs = Platform.OS === 'ios'

//   if (useNativeTabs) {
//     return (
//       <NativeTabs
//         backgroundColor={COLORS.background}
//         tintColor={COLORS.active}
//         iconColor={{ default: COLORS.inactive }}
//         labelStyle={{
//           default: { color: COLORS.inactive },
//           selected: { color: COLORS.active },
//         }}
//       >
//         <NativeTabs.Trigger name="index">
//           <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
//           <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
//         </NativeTabs.Trigger>

//         <NativeTabs.Trigger name="transactions">
//           <NativeTabs.Trigger.Icon sf="list.bullet" md="list" />
//           <NativeTabs.Trigger.Label>Transactions</NativeTabs.Trigger.Label>
//         </NativeTabs.Trigger>

//         <NativeTabs.Trigger name="add-transaction">
//           <NativeTabs.Trigger.Icon sf="plus.circle.fill" md="add_circle" />
//           <NativeTabs.Trigger.Label>Add</NativeTabs.Trigger.Label>
//         </NativeTabs.Trigger>

//         <NativeTabs.Trigger name="assistant">
//           <NativeTabs.Trigger.Icon sf="brain.head.profile" md="psychology" />
//           <NativeTabs.Trigger.Label>Assistant</NativeTabs.Trigger.Label>
//         </NativeTabs.Trigger>

//         <NativeTabs.Trigger name="profile">
//           <NativeTabs.Trigger.Icon sf="person.fill" md="person" />
//           <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
//         </NativeTabs.Trigger>
//       </NativeTabs>
//     )
//   }

//   // Android (aur web)
//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarActiveTintColor: COLORS.active,
//         tabBarInactiveTintColor: COLORS.inactive,
//         tabBarStyle: {
//           backgroundColor: COLORS.background,
//           borderTopColor: COLORS.border,
//           paddingTop: 4,
//           height: 64,
//         },
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Home',
//           tabBarIcon: ({ color, size }) => (
//             <Feather name="home" size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="transactions"
//         options={{
//           title: 'Transactions',
//           tabBarIcon: ({ color, size }) => (
//             <Feather name="list" size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="add-transaction"
//         options={{
//           title: 'Add',
//           tabBarIcon: ({ color, size }) => (
//             <Feather name="plus-circle" size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="assistant"
//         options={{
//           title: 'Assistant',
//           tabBarIcon: ({ color, size }) => (
//             <Feather name="message-circle" size={size} color={color} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: 'Profile',
//           tabBarIcon: ({ color, size }) => (
//             <Feather name="user" size={size} color={color} />
//           ),
//         }}
//       />
//     </Tabs>
//   )
// }