import { excluirConta, exportarMeusDados } from '@/services/conta';
import { mockLogin } from '@/services/api/mock/auth.mock';

describe('direitos do titular no modo mock (LGPD)', () => {
  test('exporta cadastro, demandas com histórico e notificações do próprio usuário', async () => {
    const dados = await exportarMeusDados('usr_cidadao_1');
    expect(dados.usuario).toMatchObject({ email: 'cidadao@agora.dev' });
    expect(dados.usuario).not.toHaveProperty('senha');
    expect(dados.demandas.length).toBeGreaterThan(0);
    expect(dados.demandas[0]).toHaveProperty('historico');
    expect(dados.notificacoes.length).toBeGreaterThan(0);
  });

  test('só exclui a conta com a senha correta', async () => {
    await expect(excluirConta('usr_gestor_1', 'errada')).rejects.toMatchObject({
      kind: 'validation',
    });
    await excluirConta('usr_gestor_1', '123456');
    await expect(mockLogin({ email: 'gestor@agora.dev', senha: '123456' })).rejects.toMatchObject({
      kind: 'auth',
    });
  });
});
