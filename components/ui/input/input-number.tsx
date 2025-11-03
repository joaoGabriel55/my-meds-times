import { useThemeColor } from "@/hooks/use-theme-color";
import { TextInput, View } from "react-native";
import { ThemedText } from "../../themed-text";
import { styles } from "./styles";

interface InputProps {
  label: string;
  lint?: string | null;
  value: number;
  onChange: (text: number) => void;
}

export function InputNumber({ label, value, lint, onChange }: InputProps) {
  const errorColor = useThemeColor({}, "error");
  const textColor = useThemeColor({}, "text");

  function handleChange(value: string) {
    const numericText = value.replace(/[^0-9]/g, "");
    onChange(Number(numericText));
  }

  return (
    <View>
      <ThemedText style={{ paddingBottom: 8 }}>{label}</ThemedText>
      <TextInput
        inputMode="numeric"
        keyboardType="number-pad"
        style={[
          styles.input,
          {
            borderColor: useThemeColor({}, "tint"),
            backgroundColor: useThemeColor({}, "background"),
            color: textColor,
          },
        ]}
        onChangeText={handleChange}
        value={String(value)}
      />
      {lint && (
        <ThemedText style={{ fontSize: 14, color: errorColor }}>{lint}</ThemedText>
      )}
    </View>
  );
}