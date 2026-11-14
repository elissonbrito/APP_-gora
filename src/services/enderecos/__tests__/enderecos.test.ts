import { AxiosError } from 'axios';

import {
  buscarEnderecoPorCep,
  formatarCep,
  normalizarCep,
  viaCepClient,
} from '@/services/enderecos';

describe('normalizarCep / formatarCep', () => {
  test('remove tudo que não é dígito e limita a 8', () => {
    expect(normalizarCep('25.600-000x9')).toBe('25600000');
  });

  test('aplica a máscara 00000-000', () => {
    expect(formatarCep('25600000')).toBe('25600-000');
    expect(formatarCep('256')).toBe('256');
  });
});

describe('buscarEnderecoPorCep', () => {
  afterEach(() => jest.restoreAllMocks());

  test('rejeita CEP incompleto sem chamar a API', async () => {
    const get = jest.spyOn(viaCepClient, 'get');
    await expect(buscarEnderecoPorCep('2560')).rejects.toMatchObject({ kind: 'validation' });
    expect(get).not.toHaveBeenCalled();
  });

  test('converte a resposta do ViaCEP para Endereco', async () => {
    const get = jest.spyOn(viaCepClient, 'get').mockResolvedValue({
      data: {
        cep: '01001-000',
        logradouro: 'Praça da Sé',
        bairro: 'Sé',
        localidade: 'São Paulo',
        uf: 'SP',
      },
    });

    await expect(buscarEnderecoPorCep('01001-000')).resolves.toEqual({
      cep: '01001-000',
      logradouro: 'Praça da Sé',
      bairro: 'Sé',
      cidade: 'São Paulo',
      uf: 'SP',
    });
    expect(get).toHaveBeenCalledWith('/01001000/json/');
  });

  test('CEP inexistente vira not_found', async () => {
    jest.spyOn(viaCepClient, 'get').mockResolvedValue({ data: { erro: 'true' } });
    await expect(buscarEnderecoPorCep('99999999')).rejects.toMatchObject({ kind: 'not_found' });
  });

  test('falha de rede vira network', async () => {
    jest.spyOn(viaCepClient, 'get').mockRejectedValue(new AxiosError('offline'));
    await expect(buscarEnderecoPorCep('01001000')).rejects.toMatchObject({ kind: 'network' });
  });
});
