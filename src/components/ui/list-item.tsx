import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ListItemProps = {
  title: string;
  subtitle?: string;
  /** Texto curto à direita, como uma sigla ou contagem. */
  trailing?: string;
  selected?: boolean;
  onPress?: () => void;
};

export function ListItem({ title, subtitle, trailing, selected, onPress }: ListItemProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={({ pressed }) => [
        styles.item,
        {
          backgroundColor: selected ? theme.primarySoft : theme.backgroundElement,
          borderColor: selected ? theme.primary : 'transparent',
          opacity: pressed ? 0.7 : 1,
        },
      ]}>
      <View style={styles.texts}>
        <ThemedText type="default" numberOfLines={1}>
          {title}
        </ThemedText>
        {subtitle ? (
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
            {subtitle}
          </ThemedText>
        ) : null}
      </View>
      {trailing ? (
        <ThemedText type="smallBold" themeColor={selected ? 'primary' : 'textSecondary'}>
          {trailing}
        </ThemedText>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    borderRadius: Radius.medium,
    borderWidth: 1,
  },
  texts: {
    flex: 1,
    gap: Spacing.half,
  },
});
