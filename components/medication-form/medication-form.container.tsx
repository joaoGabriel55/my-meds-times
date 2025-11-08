import { useThemeColor } from "@/hooks/use-theme-color";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BannerAd } from "../ui/banner-ad";

export function MedicationFormContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: useThemeColor({}, "background"),
      }}
    >
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: useThemeColor({}, "background"),
        }}
        contentContainerStyle={{
          padding: 28,
          paddingBottom: 30,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={true}
        bounces={true}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {children}
      </ScrollView>
      <BannerAd />
    </SafeAreaView>
  );
}
