/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// Primary brand color - Purple theme
const tintColorLight = '#B48BEE';
const tintColorDark = '#9B6FDD';

export const Colors = {
  light: {
    // Primary colors
    text: '#11181C',
    textSecondary: '#6B7280',
    background: '#FFFFFF',
    backgroundSecondary: '#F8F9FA',
    tint: tintColorLight,
    
    // UI Elements
    icon: '#687076',
    iconSecondary: '#9CA3AF',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    
    // Borders and dividers
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    
    // Card and surface
    card: '#FFFFFF',
    cardBorder: '#E5E7EB',
    cardShadow: 'rgba(0, 0, 0, 0.08)',
    
    // Interactive elements
    buttonPrimary: tintColorLight,
    buttonPrimaryText: '#FFFFFF',
    buttonSecondary: '#F3F4F6',
    buttonSecondaryText: '#374151',
    
    // Status colors
    error: '#EF4444',
    errorLight: '#FEE2E2',
    success: '#10B981',
    successLight: '#D1FAE5',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    info: '#3B82F6',
    infoLight: '#DBEAFE',
    
    // Input fields
    input: '#FFFFFF',
    inputBorder: tintColorLight,
    inputPlaceholder: '#9CA3AF',
    
    // Overlay and modal
    overlay: 'rgba(0, 0, 0, 0.5)',
    modalBackground: '#FFFFFF',
  },
  dark: {
    // Primary colors
    text: '#ECEDEE',
    textSecondary: '#9CA3AF',
    background: '#1A1A1A',
    backgroundSecondary: '#252525',
    tint: tintColorDark,
    
    // UI Elements
    icon: '#9BA1A6',
    iconSecondary: '#6B7280',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    
    // Borders and dividers
    border: '#374151',
    borderLight: '#2D3748',
    
    // Card and surface
    card: '#252525',
    cardBorder: '#374151',
    cardShadow: 'rgba(0, 0, 0, 0.3)',
    
    // Interactive elements
    buttonPrimary: tintColorDark,
    buttonPrimaryText: '#FFFFFF',
    buttonSecondary: '#374151',
    buttonSecondaryText: '#E5E7EB',
    
    // Status colors
    error: '#F87171',
    errorLight: '#7F1D1D',
    success: '#34D399',
    successLight: '#064E3B',
    warning: '#FBBF24',
    warningLight: '#78350F',
    info: '#60A5FA',
    infoLight: '#1E3A8A',
    
    // Input fields
    input: '#252525',
    inputBorder: tintColorDark,
    inputPlaceholder: '#6B7280',
    
    // Overlay and modal
    overlay: 'rgba(0, 0, 0, 0.7)',
    modalBackground: '#252525',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  android: {
    sans: 'Roboto',
    serif: 'serif',
    rounded: 'sans-serif-medium',
    mono: 'monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Spacing system for consistent padding and margins
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius system
export const BorderRadius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

// Shadow presets for both platforms
export const Shadows = {
  small: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    android: {
      elevation: 1,
    },
    default: {},
  }),
  medium: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
    },
    android: {
      elevation: 3,
    },
    default: {},
  }),
  large: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
    },
    android: {
      elevation: 6,
    },
    default: {},
  }),
};