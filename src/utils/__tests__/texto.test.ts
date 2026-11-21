import { correspondeBusca, normalizarTexto } from '@/utils/texto';

describe('normalizarTexto', () => {
  test('remove acentos, caixa e espaços das pontas', () => {
    expect(normalizarTexto('  Iluminação PÚBLICA ')).toBe('iluminacao publica');
  });
});

describe('correspondeBusca', () => {
  const campos = ['AG-2026-000123', 'Poste sem iluminação na Rua das Flores'];

  test('termo vazio aceita tudo', () => {
    expect(correspondeBusca('   ', campos)).toBe(true);
  });

  test('encontra pelo assunto sem acento', () => {
    expect(correspondeBusca('iluminacao', campos)).toBe(true);
  });

  test('encontra pelo protocolo com ou sem traço', () => {
    expect(correspondeBusca('2026-000123', campos)).toBe(true);
    expect(correspondeBusca('ag2026000123', campos)).toBe(true);
  });

  test('não encontra o que não existe', () => {
    expect(correspondeBusca('buraco', campos)).toBe(false);
  });
});
