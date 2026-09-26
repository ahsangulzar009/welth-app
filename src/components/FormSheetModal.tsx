import React from 'react';
import { View, Text, Modal, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native'


const FormSheetModal = (
  {
    visible, title, onClose, children
  }: {
    visible: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
  }
) => {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-end bg-black/40"
      >
        <View className="bg-brand-body rounded-t-2xl px-5 pt-5 pb-8">
          <Text className="text-brand-bg text-base font-semibold mb-4">
            {title}
          </Text>

          {children}

          <TouchableOpacity className="py-2 items-center" onPress={onClose}>
            <Text className="text-brand-text-secondary text-sm">Cancel</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

export default FormSheetModal