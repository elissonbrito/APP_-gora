import { useState } from 'react';
import { StyleSheet } from 'react-native';

import { StarRating } from '@/components/forms/star-rating';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spacing } from '@/constants/theme';
import { useAvaliarDemanda } from '@/features/demandas/hooks';
import { AppError } from '@/services/api/errors';
import type { Avaliacao } from '@/types/avaliacao';

export function AvaliacaoSection({
  demandaId,
  avaliacao,
}: {
  demandaId: string;
  avaliacao?: Avaliacao;
}) {
  if (avaliacao) {
    return (
      <Card style={styles.card}>
        <ThemedText type="smallBold">Sua avaliação</ThemedText>
        <StarRating value={avaliacao.nota} readOnly />
        {avaliacao.comentario ? (
          <ThemedText type="default">{avaliacao.comentario}</ThemedText>
        ) : null}
      </Card>
    );
  }

  return <FormularioAvaliacao demandaId={demandaId} />;
}

function FormularioAvaliacao({ demandaId }: { demandaId: string }) {
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const avaliarDemanda = useAvaliarDemanda(demandaId);

  async function handleEnviar() {
    if (nota === 0) {
      setErro('Selecione uma nota.');
      return;
    }
    setErro(null);
    try {
      await avaliarDemanda.mutateAsync({ nota, comentario: comentario || undefined });
    } catch (error) {
      setErro(error instanceof AppError ? error.message : 'Não foi possível enviar sua avaliação.');
    }
  }

  return (
    <Card style={styles.card}>
      <ThemedText type="smallBold">Avalie o atendimento</ThemedText>
      <StarRating value={nota} onChange={setNota} />
      <Input
        label="Comentário (opcional)"
        placeholder="Conte como foi sua experiência"
        multiline
        numberOfLines={3}
        style={styles.textarea}
        value={comentario}
        onChangeText={setComentario}
      />
      {erro ? (
        <ThemedText type="small" themeColor="danger">
          {erro}
        </ThemedText>
      ) : null}
      <Button label="Enviar avaliação" onPress={handleEnviar} loading={avaliarDemanda.isPending} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.two,
  },
  textarea: {
    minHeight: 80,
    paddingTop: Spacing.two,
    textAlignVertical: 'top',
  },
});
