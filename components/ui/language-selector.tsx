import React, { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLanguage } from '@/contexts/language-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Shadows } from '@/constants/theme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { isRTL } from '@/lib/i18n';

export function LanguageSelector() {
  const [modalVisible, setModalVisible] = useState(false);
  const { currentLanguage, supportedLanguages, changeAppLanguage } = useLanguage();
  const bg = useThemeColor({}, 'background');
  const cardBg = useThemeColor({}, 'card');
  const tint = useThemeColor({}, 'tint');
  const text = useThemeColor({}, 'text');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const buttonPrimaryText = useThemeColor({}, 'buttonPrimaryText');

  const currentLanguageName = supportedLanguages.find(
    (lang) => lang.code === currentLanguage
  )?.name || 'English';

  const handleLanguageChange = async (languageCode: string) => {
    try {
      const willChangeRTL = isRTL(languageCode) !== isRTL(currentLanguage);

      await changeAppLanguage(languageCode);
      setModalVisible(false);

      // If changing between RTL and LTR, show alert to restart
      if (willChangeRTL) {
        Alert.alert(
          'Language Changed',
          'Please restart the app to fully apply the text direction change for this language.',
          [
            {
              text: 'OK',
              style: 'default',
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: cardBg }, Shadows.small]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.buttonContent}>
          <Ionicons name="language" size={24} color={tint} />
          <ThemedText style={styles.buttonText}>{currentLanguageName}</ThemedText>
        </View>
        <Ionicons name="chevron-forward" size={20} color={textSecondary} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ThemedView style={[styles.modalContent, { backgroundColor: bg }]}>
            <View style={styles.modalHeader}>
              <ThemedText type="subtitle" style={styles.modalTitle}>
                Select Language
              </ThemedText>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={28} color={text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.languageList}>
              {supportedLanguages.map((language) => {
                const isSelected = language.code === currentLanguage;
                return (
                  <TouchableOpacity
                    key={language.code}
                    style={[
                      styles.languageItem,
                      { backgroundColor: cardBg },
                      isSelected && { backgroundColor: tint },
                      Shadows.small,
                    ]}
                    onPress={() => handleLanguageChange(language.code)}
                    activeOpacity={0.7}
                  >
                    <ThemedText
                      style={[
                        styles.languageName,
                        isSelected && { color: buttonPrimaryText, fontWeight: 'bold' },
                      ]}
                    >
                      {language.name}
                    </ThemedText>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={buttonPrimaryText}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </ThemedView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  languageList: {
    paddingHorizontal: 20,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  languageName: {
    fontSize: 16,
  },
});
