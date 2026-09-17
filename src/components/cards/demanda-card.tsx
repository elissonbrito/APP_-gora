import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Spacing } from '@/constants/theme';
import { demandaStatusLabel, demandaStatusTone } from '@/features/demandas/status';
import type { DemandaResumo } from '@/types/demanda';

export function DemandaCard({ demanda }: { demanda: DemandaResumo }) {
  return (
    <Link href={{ pathname: '/demandas/[id]', params: { id: demanda.id } }} asChild>
      <Pressable accessibilityRole="button" accessibilityLabel={`Ver demanda ${demanda.protocolo}`}>
        <Card>
          <View style={styles.headerRow}>
            <ThemedText type="small" themeColor="textSecondary">
              {demanda.protocolo}
            </ThemedText>
            <Badge
              label={demandaStatusLabel[demanda.status]}
              tone={demandaStatusTone[demanda.status]}
            />
          </View>
          <ThemedText type="default" numberOfLines={2}>
            {demanda.assunto}
          </ThemedText>
        </Card>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
});
