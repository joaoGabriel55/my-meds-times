import { useThemeColor } from "@/hooks/use-theme-color";
import { TextInput, View } from "react-native";
import { ThemedText } from "../../themed-text";
import { styles } from "./styles";

interface InputProps {
  label?: string;
  lint?: string | null;
  value: string;
  readOnly?: boolean;
  onChange?: (text: string) => void;
}

export function InputText({
  label,
  lint,
  value,
  readOnly,
  onChange,
}: InputProps) {
  const textColor = useThemeColor({}, "text");
  const errorColor = useThemeColor({}, "error");
  return (
    <View>
      {label && (
        <ThemedText
          style={{
            fontSize: 16,
            color: textColor,
            paddingBottom: 8,
          }}
        >
          {label}
        </ThemedText>
      )}
      <TextInput
        style={[
          styles.input,
          {
            borderColor: useThemeColor({}, "tint"),
            backgroundColor: useThemeColor({}, "background"),
            color: textColor,
          },
        ]}
        onChangeText={onChange}
        value={String(value)}
        readOnly={readOnly}
      />
      {lint && (
        <ThemedText style={{ fontSize: 14, color: errorColor }}>{lint}</ThemedText>
      )}
    </View>
  );
}
