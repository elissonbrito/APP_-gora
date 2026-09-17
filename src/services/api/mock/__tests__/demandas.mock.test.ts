import {
  mockAvaliarDemanda,
  mockCriarDemanda,
  mockListarMinhasDemandas,
  mockObterDemanda,
} from '@/services/api/mock/demandas.mock';

const USER_ID = 'usr_cidadao_1';

describe('mockCriarDemanda', () => {
  test('gera protocolo no formato AG-AAAA-xxxxxx', async () => {
    const demanda = await mockCriarDemanda(USER_ID, {
      categoria: 'buracos_via',
      assunto: 'Buraco na esquina',
      descricao: 'Buraco grande e perigoso na esquina da rua principal.',
      localizacao: { endereco: 'Rua Principal, 10' },
    });
    expect(demanda.protocolo).toMatch(/^AG-\d{4}-\d{6}$/);
    expect(demanda.status).toBe('recebida');
  });

  test('a nova demanda passa a aparecer na listagem do usuário', async () => {
    const criada = await mockCriarDemanda(USER_ID, {
      categoria: 'coleta_lixo',
      assunto: 'Lixo acumulado na calçada',
      descricao: 'O lixo não é recolhido há vários dias na minha rua.',
      localizacao: { endereco: 'Rua das Palmeiras, 55' },
    });
    const lista = await mockListarMinhasDemandas(USER_ID);
    expect(lista.some((item) => item.id === criada.id)).toBe(true);
  });

  test('demanda de outro usuário não aparece na listagem', async () => {
    const lista = await mockListarMinhasDemandas('usr_inexistente');
    expect(lista).toEqual([]);
  });
});

describe('mockObterDemanda', () => {
  test('retorna o detalhe completo com histórico', async () => {
    const detalhe = await mockObterDemanda('dem_1');
    expect(detalhe.historico.length).toBeGreaterThan(0);
    expect(detalhe.localizacao.endereco).toBeTruthy();
  });

  test('rejeita id inexistente com AppError "not_found"', async () => {
    await expect(mockObterDemanda('dem_inexistente')).rejects.toMatchObject({
      kind: 'not_found',
    });
  });
});

describe('mockAvaliarDemanda', () => {
  test('avalia uma demanda concluída com sucesso', async () => {
    const avaliacao = await mockAvaliarDemanda('dem_3', { nota: 5, comentario: 'Ótimo atendimento' });
    expect(avaliacao.nota).toBe(5);

    const detalhe = await mockObterDemanda('dem_3');
    expect(detalhe.avaliacao?.nota).toBe(5);
  });

  test('rejeita avaliação duplicada', async () => {
    await expect(
      mockAvaliarDemanda('dem_3', { nota: 3 }),
    ).rejects.toMatchObject({ kind: 'validation' });
  });

  test('rejeita avaliação de demanda não concluída', async () => {
    await expect(
      mockAvaliarDemanda('dem_1', { nota: 4 }),
    ).rejects.toMatchObject({ kind: 'validation' });
  });
});
