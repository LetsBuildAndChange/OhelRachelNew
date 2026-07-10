import { Switch, Text, View } from "react-native";
import { Colors } from "./colors";

type VisibilitySwitchProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
};

export function VisibilitySwitch({ value, onValueChange, label = "Visible" }: VisibilitySwitchProps) {
  return (
    <View style={{ alignItems: "center", gap: 6 }}>
      <Text style={{ color: Colors.muted, fontSize: 13, fontWeight: "700" }}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#CBD5E1", true: "#E8D4A2" }}
        thumbColor={value ? Colors.gold : "#F8FAFC"}
      />
    </View>
  );
}
