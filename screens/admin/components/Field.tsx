import React, { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { Colors } from "./colors";

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  saveOnBlur?: boolean;
  multiline?: boolean;
};

export function Field({
  label,
  value,
  onChangeText,
  placeholder,
  saveOnBlur = false,
  multiline = false,
}: FieldProps) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const displayedValue = saveOnBlur ? draft : value;
  const changeText = saveOnBlur ? setDraft : onChangeText;
  const commitDraft = () => {
    if (saveOnBlur && draft !== value) {
      onChangeText(draft);
    }
  };

  return (
    <View style={{ flex: 1, gap: 6, minWidth: 130 }}>
      <Text style={{ color: Colors.muted, fontSize: 13, fontWeight: "700" }}>{label}</Text>
      <TextInput
        value={displayedValue}
        onBlur={commitDraft}
        onChangeText={changeText}
        onSubmitEditing={commitDraft}
        placeholder={placeholder}
        autoCapitalize="none"
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        style={{
          backgroundColor: "#FFFFFF",
          borderColor: Colors.border,
          borderRadius: 8,
          borderWidth: 1,
          color: Colors.text,
          fontSize: 16,
          minHeight: multiline ? 88 : undefined,
          paddingHorizontal: 12,
          paddingVertical: 10,
        }}
      />
    </View>
  );
}
