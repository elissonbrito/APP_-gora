import { novaDemandaSchema } from '@/schemas/demanda';

const base = {
  categoria: 'buracos_via' as const,
  assunto: 'Buraco na rua principal',
  descricao: 'Buraco grande e perigoso, próximo à esquina, atrapalhando o trânsito de pedestres.',
  localizacao: { endereco: 'Rua Principal, 100' },
  fotos: [] as string[],
};

describe('novaDemandaSchema', () => {
  test('aceita uma demanda completa e válida', () => {
    expect(novaDemandaSchema.safeParse(base).success).toBe(true);
  });

  test('rejeita categoria inválida', () => {
    const resultado = novaDemandaSchema.safeParse({ ...base, categoria: 'categoria_invalida' });
    expect(resultado.success).toBe(false);
  });

  test('rejeita assunto muito curto', () => {
    const resultado = novaDemandaSchema.safeParse({ ...base, assunto: 'Oi' });
    expect(resultado.success).toBe(false);
  });

  test('rejeita descrição muito curta', () => {
    const resultado = novaDemandaSchema.safeParse({ ...base, descricao: 'curta' });
    expect(resultado.success).toBe(false);
  });

  test('rejeita endereço vazio', () => {
    const resultado = novaDemandaSchema.safeParse({
      ...base,
      localizacao: { endereco: '' },
    });
    expect(resultado.success).toBe(false);
  });

  test('rejeita mais de 5 fotos', () => {
    const resultado = novaDemandaSchema.safeParse({
      ...base,
      fotos: Array.from({ length: 6 }, (_, i) => `file://foto-${i}.jpg`),
    });
    expect(resultado.success).toBe(false);
  });

  test('aceita até 5 fotos', () => {
    const resultado = novaDemandaSchema.safeParse({
      ...base,
      fotos: Array.from({ length: 5 }, (_, i) => `file://foto-${i}.jpg`),
    });
    expect(resultado.success).toBe(true);
  });
});
