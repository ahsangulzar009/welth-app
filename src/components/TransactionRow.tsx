import { View, Text } from 'react-native'

import { Transaction } from '@/lib/api/transactions';
import { getCategoryConfig } from '@/lib/constants/categories';
import { Feather } from '@react-native-vector-icons/feather';
import { ComponentProps } from 'react';
import { formatPrice } from '@/lib/utils';

type FeatherIconName = ComponentProps<typeof Feather>['name'];
const INPUT_METHOD_ICON: Record<Transaction["input_method"], FeatherIconName> = {
  MANUAL: "edit-3",
  RECEIPT_SCAN: "camera",
  VOICE: "mic"
}

const TransactionRow = ({ tx, onDelete, currency }: { tx: Transaction, onDelete?: () => void, currency:string }) => {
  const config = getCategoryConfig(tx.category)
  const isIncome = tx.type === 'INCOME'

  const row = (
    <View
      className="flex-row items-center bg-white rounded-2xl border border-[#E8E6DF] pl-3 pr-3.5 py-4 mt-1"
      style={{ borderLeftWidth: 3, borderLeftColor: config.color }}
    >
      <View
        className="size-10 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: `${config.icon}22` }}
      >
        <Text className="text-lg">{config.icon}</Text>
      </View>

      <View className="flex-1">
        <Text className="text-brand-bg text-sm font-medium" numberOfLines={1}>
          {tx.description || config.label}
        </Text>
        <View className="flex-row items-center gap-1.5 mt-0.5">
          <Feather
            name={INPUT_METHOD_ICON[tx.input_method]}
            size={11}
            color={"#8A8D96"}
          />
          <View className="px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${config.color}1A` }}>
            <Text className="text-[10px] font-medium">{config.label}</Text>
          </View>

          {
            tx.is_flagged && (
              <View className="flex-row items-center gap-1 ml-1">
                <Feather name="alert-triangle" size={11} color={"#FF6B4A"} />
                <Text className="text-brand-coral text-[11px]">Flagged</Text>
              </View>
            )
          }
        </View>
      </View>

      <Text className={`text-sm font-medium ${isIncome ? "text-brand-success" : "text-brand-coral"}`}>
        {isIncome ? "+" : "-"}
        {formatPrice(tx.amount, currency)}
      </Text>
    </View>
  )

  return (
    <View> {row}</View>
  )
}

export default TransactionRow