import { z } from 'zod';

export const novaDemandaSchema = z.object({
  categoria: z.enum(
    ['iluminacao_publica', 'buracos_via', 'coleta_lixo', 'poda_arvore', 'saneamento', 'outros'],
    { errorMap: () => ({ message: 'Selecione uma categoria.' }) },
  ),
  assunto: z.string().min(5, 'Informe um assunto com pelo menos 5 caracteres.'),
  descricao: z.string().min(20, 'Descreva a ocorrência com pelo menos 20 caracteres.'),
});

export type NovaDemandaFormValues = z.infer<typeof novaDemandaSchema>;
