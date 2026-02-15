import { ThemedText } from "@/components/themed-text";
import { formatDateHour } from "@/helpers/formats";
import { styles } from "./my-medications.styles";
import { useThemeColor } from "@/hooks/use-theme-color";

export function MedicationTimeChip({ time }: { time: Date }) {
  const tint = useThemeColor({}, "tint");
  const buttonPrimaryText = useThemeColor({}, "buttonPrimaryText");
  const cardBg = useThemeColor({}, "card");

  const passedTime = time.getTime() < new Date().getTime();

  const defaultStyle = {
    backgroundColor: cardBg,
    color: tint,
    borderColor: tint,
    borderStyle: "solid",
    borderWidth: 1,
  };

  const passedTimeStyle = { backgroundColor: tint, color: buttonPrimaryText };

  return (
    <ThemedText
      style={[
        styles.cardDetail,
        {
          ...(passedTime ? passedTimeStyle : defaultStyle),
          height: 28,
        },
      ]}
    >
      {formatDateHour(time)}
    </ThemedText>
  );
}
