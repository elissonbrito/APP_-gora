import { AxiosError } from 'axios';

import {
  filtrarPorNome,
  ibgeClient,
  listarEstados,
  listarMunicipios,
} from '@/services/localidades';

describe('serviço de localidades (IBGE)', () => {
  afterEach(() => jest.restoreAllMocks());

  test('listarEstados achata a região e pede ordenação por nome', async () => {
    const get = jest.spyOn(ibgeClient, 'get').mockResolvedValue({
      data: [{ id: 33, sigla: 'RJ', nome: 'Rio de Janeiro', regiao: { id: 3, nome: 'Sudeste' } }],
    });

    await expect(listarEstados()).resolves.toEqual([
      { id: 33, sigla: 'RJ', nome: 'Rio de Janeiro', regiao: 'Sudeste' },
    ]);
    expect(get).toHaveBeenCalledWith('/estados', { params: { orderBy: 'nome' } });
  });

  test('listarMunicipios devolve só id, nome e UF', async () => {
    jest.spyOn(ibgeClient, 'get').mockResolvedValue({
      data: [{ id: 3306206, nome: 'Vassouras', microrregiao: {} }],
    });

    await expect(listarMunicipios('RJ')).resolves.toEqual([
      { id: 3306206, nome: 'Vassouras', uf: 'RJ' },
    ]);
  });

  test('erro HTTP vira AppError com mensagem amigável', async () => {
    const erro = new AxiosError('falhou');
    erro.response = { status: 503, data: {}, statusText: '', headers: {}, config: {} as never };
    jest.spyOn(ibgeClient, 'get').mockRejectedValue(erro);

    await expect(listarEstados()).rejects.toMatchObject({ kind: 'server' });
  });
});

describe('filtrarPorNome', () => {
  const lista = [{ nome: 'São João de Meriti' }, { nome: 'Vassouras' }, { nome: 'Niterói' }];

  test('ignora acentos e maiúsculas', () => {
    expect(filtrarPorNome(lista, 'sao joao')).toEqual([{ nome: 'São João de Meriti' }]);
    expect(filtrarPorNome(lista, 'NITEROI')).toEqual([{ nome: 'Niterói' }]);
  });

  test('termo vazio devolve a lista inteira', () => {
    expect(filtrarPorNome(lista, '  ')).toBe(lista);
  });
});
