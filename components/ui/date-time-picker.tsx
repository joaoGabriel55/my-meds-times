import { ThemedText } from "@/components/themed-text";
import { formatDateTime } from "@/helpers/formats";
import { useThemeColor } from "@/hooks/use-theme-color";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

interface DateTimePickerProps {
  value: string;
  mode: "date" | "time" | "datetime";
  minimumDate?: Date;
  onConfirm: (date: Date) => void;
}

export function DateTimePicker({
  value,
  mode,
  minimumDate,
  onConfirm,
}: DateTimePickerProps) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  return (
    <View>
      <TouchableOpacity
        style={{
          height: 48,
          borderWidth: 1,
          padding: 12,
          borderRadius: 8,
          borderColor: useThemeColor({}, "tint"),
          backgroundColor: useThemeColor({}, "background"),
        }}
        onPress={() => setDatePickerVisibility(true)}
      >
        <ThemedText
          style={{
            fontSize: 18,
            color: useThemeColor({}, "text"),
          }}
        >
          {value ? formatDateTime(value) : "Select Date"}
        </ThemedText>
      </TouchableOpacity>
      <DateTimePickerModal
        date={value ? new Date(value) : new Date()}
        isVisible={isDatePickerVisible}
        mode={mode}
        {...(minimumDate ? { minimumDate } : {})}
        onConfirm={(date) => {
          onConfirm(date);
          setDatePickerVisibility(false);
        }}
        onCancel={() => setDatePickerVisibility(false)}
      />
    </View>
  );
}
