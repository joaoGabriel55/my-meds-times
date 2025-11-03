import { useLanguage } from '@/contexts/language-context';
import { I18nManager } from 'react-native';

/**
 * Hook to check if the current language is RTL (Right-to-Left)
 * @returns {boolean} true if current language is RTL, false otherwise
 */
export function useRTL(): boolean {
  const { isRTL } = useLanguage();
  return isRTL;
}

/**
 * Hook to get RTL-aware directional styles
 * Useful for margins, padding, text alignment, etc.
 */
export function useRTLStyles() {
  const isRTLMode = useRTL();

  return {
    isRTL: isRTLMode,
    
    // Text alignment
    textAlign: isRTLMode ? 'right' : 'left' as 'right' | 'left',
    textAlignReverse: isRTLMode ? 'left' : 'right' as 'left' | 'right',
    
    // Flex direction
    flexDirection: isRTLMode ? 'row-reverse' : 'row' as 'row-reverse' | 'row',
    flexDirectionReverse: isRTLMode ? 'row' : 'row-reverse' as 'row' | 'row-reverse',
    
    // Margins (use these instead of marginLeft/marginRight)
    marginStart: (value: number) => (isRTLMode ? { marginRight: value } : { marginLeft: value }),
    marginEnd: (value: number) => (isRTLMode ? { marginLeft: value } : { marginRight: value }),
    
    // Padding (use these instead of paddingLeft/paddingRight)
    paddingStart: (value: number) => (isRTLMode ? { paddingRight: value } : { paddingLeft: value }),
    paddingEnd: (value: number) => (isRTLMode ? { paddingLeft: value } : { paddingRight: value }),
    
    // Position (use these instead of left/right)
    start: (value: number) => (isRTLMode ? { right: value } : { left: value }),
    end: (value: number) => (isRTLMode ? { left: value } : { right: value }),
    
    // Border radius (for asymmetric borders)
    borderTopStartRadius: (value: number) => (isRTLMode ? { borderTopRightRadius: value } : { borderTopLeftRadius: value }),
    borderTopEndRadius: (value: number) => (isRTLMode ? { borderTopLeftRadius: value } : { borderTopRightRadius: value }),
    borderBottomStartRadius: (value: number) => (isRTLMode ? { borderBottomRightRadius: value } : { borderBottomLeftRadius: value }),
    borderBottomEndRadius: (value: number) => (isRTLMode ? { borderBottomLeftRadius: value } : { borderBottomRightRadius: value }),
    
    // Icon direction (for arrows, chevrons, etc.)
    iconName: (ltrIcon: string, rtlIcon: string) => isRTLMode ? rtlIcon : ltrIcon,
    
    // Transform for mirroring
    transform: [{ scaleX: isRTLMode ? -1 : 1 }],
  };
}

/**
 * Get the correct icon name for RTL/LTR
 * @param ltrIcon Icon name for LTR languages
 * @param rtlIcon Icon name for RTL languages (optional, defaults to LTR icon)
 */
export function useRTLIcon(ltrIcon: string, rtlIcon?: string): string {
  const isRTLMode = useRTL();
  return isRTLMode && rtlIcon ? rtlIcon : ltrIcon;
}

/**
 * Check if RTL is currently forced in React Native
 */
export function isRTLForced(): boolean {
  return I18nManager.isRTL;
}