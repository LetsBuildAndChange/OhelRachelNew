import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";
import { Colors } from "./colors";

type ButtonProps = {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
};

export function Button({
  label,
  icon,
  onPress,
  variant = "primary",
  disabled = false,
}: ButtonProps) {
  const backgroundColor =
    variant === "primary" ? Colors.gold : variant === "danger" ? "#FEE2E2" : "#F8FAFC";
  const color = variant === "danger" ? Colors.danger : variant === "primary" ? "#1F2937" : Colors.text;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => ({
        alignItems: "center",
        backgroundColor,
        borderColor: variant === "primary" ? Colors.gold : Colors.border,
        borderRadius: 8,
        borderWidth: 1,
        flexDirection: "row",
        gap: 8,
        justifyContent: "center",
        opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
        paddingHorizontal: 12,
        paddingVertical: 10,
      })}
    >
      {icon ? <Ionicons name={icon} size={18} color={color} /> : null}
      <Text style={{ color, fontSize: 15, fontWeight: "700" }}>{label}</Text>
    </Pressable>
  );
}
