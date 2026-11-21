import { useRascunhoEmEdicao } from '@/features/rascunhos/em-edicao-store';
import { rascunhosRepository } from '@/features/rascunhos/repository';
import { limparDadosDoUsuario } from '@/lib/limpar-dados-usuario';
import { queryClient } from '@/lib/query-client';

jest.mock('@react-native-community/netinfo', () =>
  jest.requireActual('@react-native-community/netinfo/jest/netinfo-mock.js'),
);

jest.mock('@/features/rascunhos/repository', () => ({
  rascunhosRepository: { limparTudo: jest.fn().mockResolvedValue(undefined) },
}));

describe('limparDadosDoUsuario', () => {
  test('apaga o cache de consultas, o rascunho aberto e os rascunhos salvos', async () => {
    queryClient.setQueryData(['demandas', 'minhas', 'usr_1'], [{ id: 'dem_1' }]);
    useRascunhoEmEdicao.getState().abrir(7);

    await limparDadosDoUsuario();

    expect(queryClient.getQueryData(['demandas', 'minhas', 'usr_1'])).toBeUndefined();
    expect(useRascunhoEmEdicao.getState().id).toBeNull();
    expect(rascunhosRepository.limparTudo).toHaveBeenCalled();
  });

  test('não falha o logout se apagar os rascunhos der erro', async () => {
    jest.mocked(rascunhosRepository.limparTudo).mockRejectedValueOnce(new Error('disco'));
    await expect(limparDadosDoUsuario()).resolves.toBeUndefined();
  });
});
