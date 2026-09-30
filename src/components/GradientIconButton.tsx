
import { Feather } from "@react-native-vector-icons/feather";
import { LinearGradient } from "expo-linear-gradient";
import { ComponentProps } from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";


type FeatherIconName = ComponentProps<typeof Feather>['name'];

export function GradientIconButton({
  icon,
  colors,
  size = 64,
  iconSize = 24,
  loading,
  disabled,
  onPress,
  borderColor,
}: {
  icon: FeatherIconName;
  colors: [string, string];
  size?: number;
  iconSize?: number;
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
  borderColor?: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          alignItems: "center",
          justifyContent: "center",
          ...(borderColor
            ? { borderWidth: 3, borderColor }
            : null),
        }}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Feather name={icon} size={iconSize} color="#fff" />
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}
