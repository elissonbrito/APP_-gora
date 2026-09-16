/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1A1517',
    background: '#ffffff',
    backgroundElement: '#F5F0F1',
    backgroundSelected: '#EADEE0',
    textSecondary: '#60646C',
    border: '#E2D9DA',
    primary: '#7A2E3D',
    primarySoft: '#F3E4E7',
    onPrimary: '#FFFFFF',
    success: '#1E8E5A',
    successSoft: '#E3F5EC',
    warning: '#B7791F',
    warningSoft: '#FBF0DD',
    danger: '#C0392B',
    dangerSoft: '#FBE7E4',
    info: '#2563EB',
    infoSoft: '#E4EBFC',
  },
  dark: {
    text: '#F5EEEF',
    background: '#121013',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
    border: '#3A3236',
    primary: '#D68A96',
    primarySoft: '#3A2226',
    onPrimary: '#1A1517',
    success: '#4FBE8A',
    successSoft: '#173327',
    warning: '#D9A441',
    warningSoft: '#382B12',
    danger: '#E37567',
    dangerSoft: '#3A2019',
    info: '#7EA1F5',
    infoSoft: '#1C2740',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

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
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  small: 8,
  medium: 12,
  large: 16,
  full: 999,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
