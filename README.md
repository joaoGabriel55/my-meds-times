# My Meds Times 💊

A medication schedule and reminder app built with Expo and React Native.

**Now available in 10 languages, including Arabic with RTL support!** 🌍

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Internationalization (i18n) 🌍

The app supports 12 languages with independent language selection (users can change the app language without changing device settings), including full RTL (Right-to-Left) support for Arabic.

### Supported Languages

- 🇬🇧 English (en)
- 🇧🇷 Português (pt) - Portuguese
- 🇪🇸 Español (es) - Spanish
- 🇮🇹 Italiano (it) - Italian
- 🇩🇪 Deutsch (de) - German
- 🇳🇱 Nederlands (nl) - Dutch
- 🇫🇷 Français (fr) - French
- 🇯🇵 日本語 (ja) - Japanese
- 🇨🇳 中文 (zh) - Chinese
- 🇸🇦 العربية (ar) - Arabic (RTL)
- 🇷🇺 Русский (ru) - Russian
- 🇮🇱 עברית (he) - Hebrew

### Quick Usage

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <Text>{t('myMedications.title')}</Text>;
}
```

### For Users

1. Open the app
2. Tap the language selector on the home screen
3. Choose your preferred language
4. The app updates immediately!

### Documentation

- **[I18N_QUICKSTART.md](./I18N_QUICKSTART.md)** - Quick start guide for i18n usage
- **[docs/i18n.md](./docs/i18n.md)** - Complete internationalization documentation
- **[docs/RTL.md](./docs/RTL.md)** - Complete RTL (Right-to-Left) support guide
- **[I18N_IMPLEMENTATION_SUMMARY.md](./I18N_IMPLEMENTATION_SUMMARY.md)** - Implementation details and features
- **[locales/TEMPLATE.md](./locales/TEMPLATE.md)** - Template for adding new translations

### Key Features

- ✅ **12 Languages** - Wide international support including Arabic
- ✅ **Independent Selection** - Change app language without changing device settings
- ✅ **Smart Defaults** - Automatic device locale detection
- ✅ **Persistence** - Language choice saved across app restarts
- ✅ **Real-time Updates** - No restart required when changing language (except for RTL/LTR switches)
- ✅ **Pluralization** - Proper grammar for different counts
- ✅ **Interpolation** - Dynamic values in translations
- ✅ **RTL Support** - Full Right-to-Left layout for Arabic and other RTL languages
- ✅ **Layout Mirroring** - Automatic UI mirroring for RTL languages

## Theme System 🎨

This app uses a comprehensive theme system that ensures consistent styling across iOS and Android platforms with full support for light and dark modes.

### Quick Start

```typescript
import { useThemeColor } from '@/hooks/use-theme-color';
import { Shadows, Spacing, BorderRadius } from '@/constants/theme';

// Use theme colors
const backgroundColor = useThemeColor({}, 'background');
const tintColor = useThemeColor({}, 'tint');

// Apply styles
<View style={[
  {
    backgroundColor,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  Shadows.medium
]}>
  {/* Content */}
</View>
```

### Documentation

- **[THEME.md](./THEME.md)** - Complete theme system documentation with all available colors, spacing, and usage examples
- **[THEME_QUICK_REFERENCE.md](./THEME_QUICK_REFERENCE.md)** - Quick reference guide for color tokens and common patterns
- **[THEME_UPDATES.md](./THEME_UPDATES.md)** - Summary of theme improvements and migration guide

### Key Features

- ✅ **Consistent Purple Branding** - Unified color scheme across light and dark modes
- ✅ **40+ Color Tokens** - Semantic color naming for all UI needs
- ✅ **Platform-Specific Shadows** - Works correctly on both iOS and Android
- ✅ **Spacing & Border Radius Systems** - Standardized sizing values
- ✅ **Full Dark Mode Support** - Proper contrast and readability in both themes
- ✅ **Type-Safe** - TypeScript support for all theme tokens

## Features

- 💊 **Medication Scheduling** - Set custom schedules for your medications
- ⏰ **Smart Reminders** - Receive notifications at the right time
- 🌍 **10 Languages** - Full internationalization support including RTL
- 🌐 **RTL Support** - Full Right-to-Left layout for Arabic
- 🎨 **Theme System** - Beautiful light and dark modes
- 📱 **Cross-Platform** - Works on iOS and Android
- 💾 **Persistent Storage** - Your data is saved locally

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
