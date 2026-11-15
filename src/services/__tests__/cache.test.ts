import AsyncStorage from '@react-native-async-storage/async-storage';

import { comCache } from '@/services/cache';
import { storage } from '@/services/storage';

jest.mock('@react-native-async-storage/async-storage', () =>
  jest.requireActual('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

beforeEach(async () => {
  await AsyncStorage.clear();
  jest.restoreAllMocks();
});

describe('storage', () => {
  test('grava e lê objetos com prefixo versionado', async () => {
    await storage.set('prefs', { tema: 'escuro' });
    expect(await AsyncStorage.getItem('agora.v1.prefs')).toBe('{"tema":"escuro"}');
    expect(await storage.get('prefs', null)).toEqual({ tema: 'escuro' });
  });

  test('devolve o padrão quando o dado está corrompido', async () => {
    await AsyncStorage.setItem('agora.v1.prefs', '{quebrado');
    expect(await storage.get('prefs', 'padrao')).toBe('padrao');
  });
});

describe('comCache', () => {
  test('primeira chamada vai à API e grava o resultado', async () => {
    const buscar = jest.fn().mockResolvedValue(['RJ']);
    expect(await comCache('estados', buscar)).toEqual(['RJ']);
    expect(buscar).toHaveBeenCalledTimes(1);
  });

  test('dentro do TTL não chama a API de novo', async () => {
    const buscar = jest.fn().mockResolvedValue(['RJ']);
    await comCache('estados', buscar);
    await comCache('estados', buscar);
    expect(buscar).toHaveBeenCalledTimes(1);
  });

  test('cache vencido busca de novo', async () => {
    const agora = jest.spyOn(Date, 'now').mockReturnValue(1_000);
    const buscar = jest.fn().mockResolvedValueOnce(['antigo']).mockResolvedValueOnce(['novo']);
    await comCache('estados', buscar, 100);
    agora.mockReturnValue(5_000);
    expect(await comCache('estados', buscar, 100)).toEqual(['novo']);
  });

  test('offline com cache antigo devolve o antigo', async () => {
    const agora = jest.spyOn(Date, 'now').mockReturnValue(1_000);
    await comCache('estados', async () => ['antigo'], 100);
    agora.mockReturnValue(5_000);
    const semRede = jest.fn().mockRejectedValue(new Error('offline'));
    expect(await comCache('estados', semRede, 100)).toEqual(['antigo']);
  });

  test('offline sem cache repassa o erro', async () => {
    await expect(
      comCache('estados', async () => Promise.reject(new Error('offline'))),
    ).rejects.toThrow('offline');
  });
});
