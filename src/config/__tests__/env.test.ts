import { urlDaApiPeloExpo } from '@/config/env';

describe('urlDaApiPeloExpo', () => {
  test('usa o IP do computador que serve o app, na porta da API', () => {
    expect(urlDaApiPeloExpo('192.168.1.100:8081')).toBe('http://192.168.1.100:3333');
  });

  test('funciona com localhost (app na web, no mesmo computador)', () => {
    expect(urlDaApiPeloExpo('localhost:8081')).toBe('http://localhost:3333');
  });

  test('sem hostUri (build de produção) não inventa endereço', () => {
    expect(urlDaApiPeloExpo(undefined)).toBeUndefined();
  });
});
