import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Spacing } from '@/constants/theme';
import { demandaStatusLabel, demandaStatusTone } from '@/features/demandas/status';
import type { DemandaResumo } from '@/types/demanda';

export function DemandaCard({ demanda }: { demanda: DemandaResumo }) {
  return (
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
