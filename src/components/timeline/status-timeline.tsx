import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { demandaStatusLabel } from '@/features/demandas/status';
import { useTheme } from '@/hooks/use-theme';
import type { DemandaHistoricoEvento, DemandaStatus } from '@/types/demanda';
import { formatarDataHora } from '@/utils/date';

const ORDEM_STATUS: DemandaStatus[] = ['recebida', 'em_analise', 'em_andamento', 'concluida'];

export type StatusTimelineProps = {
  historico: DemandaHistoricoEvento[];
};

/**
 * Linha do tempo com os 4 status canônicos da especificação (item 13). Nunca
 * depende só de cor: cada etapa concluída mostra "✓", a atual um marcador
 * preenchido, e as futuras um marcador vazio — além do rótulo em texto.
 */
export function StatusTimeline({ historico }: StatusTimelineProps) {
  const theme = useTheme();
  const eventoPorStatus = new Map(historico.map((evento) => [evento.status, evento]));

  return (
    <View style={styles.container}>
      {ORDEM_STATUS.map((status, index) => {
        const evento = eventoPorStatus.get(status);
        const concluido = Boolean(evento);
        const isLast = index === ORDEM_STATUS.length - 1;

        return (
          <View key={status} style={styles.row}>
            <View style={styles.indicatorColumn}>
              <View
                style={[
                  styles.dot,
                  {
                    borderColor: concluido ? theme.success : theme.border,
                    backgroundColor: concluido ? theme.success : 'transparent',
                  },
                ]}>
                {concluido ? (
                  <ThemedText style={[styles.check, { color: theme.onPrimary }]}>✓</ThemedText>
                ) : null}
              </View>
              {!isLast ? (
                <View
                  style={[
                    styles.line,
                    { backgroundColor: concluido ? theme.success : theme.border },
                  ]}
                />
              ) : null}
            </View>

            <View style={styles.content}>
              <ThemedText type="smallBold" themeColor={concluido ? 'text' : 'textSecondary'}>
                {demandaStatusLabel[status]}
              </ThemedText>
              {evento ? (
                <>
                  <ThemedText type="small" themeColor="textSecondary">
                    {formatarDataHora(evento.data)}
                  </ThemedText>
                  {evento.mensagem ? <ThemedText type="small">{evento.mensagem}</ThemedText> : null}
                </>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.three,
  },
  indicatorColumn: {
    alignItems: 'center',
    width: 20,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    fontSize: 12,
    lineHeight: 14,
  },
  line: {
    width: 2,
    flex: 1,
    minHeight: Spacing.four,
  },
  content: {
    flex: 1,
    paddingBottom: Spacing.four,
    gap: Spacing.half,
  },
});
