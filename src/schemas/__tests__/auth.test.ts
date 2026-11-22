import { alterarSenhaSchema, loginSchema, registerSchema } from '@/schemas/auth';

describe('loginSchema', () => {
  test('aceita e-mail e senha válidos', () => {
    const resultado = loginSchema.safeParse({ email: 'cidadao@agora.dev', senha: '123456' });
    expect(resultado.success).toBe(true);
  });

  test('rejeita e-mail inválido', () => {
    const resultado = loginSchema.safeParse({ email: 'não-é-email', senha: '123456' });
    expect(resultado.success).toBe(false);
  });

  test('rejeita senha curta', () => {
    const resultado = loginSchema.safeParse({ email: 'cidadao@agora.dev', senha: '123' });
    expect(resultado.success).toBe(false);
  });
});

describe('registerSchema', () => {
  const base = {
    nome: 'Maria da Silva',
    email: 'maria@agora.dev',
    senha: 'Segura2026',
    confirmarSenha: 'Segura2026',
    aceitouTermos: true,
  };

  test('aceita dados válidos com senhas coincidentes', () => {
    expect(registerSchema.safeParse(base).success).toBe(true);
  });

  test('rejeita quando as senhas não coincidem', () => {
    const resultado = registerSchema.safeParse({ ...base, confirmarSenha: 'outrasenha' });
    expect(resultado.success).toBe(false);
  });

  test('rejeita nome muito curto', () => {
    const resultado = registerSchema.safeParse({ ...base, nome: 'Jo' });
    expect(resultado.success).toBe(false);
  });
});

describe('alterarSenhaSchema', () => {
  test('rejeita quando a nova senha e a confirmação não coincidem', () => {
    const resultado = alterarSenhaSchema.safeParse({
      senhaAtual: '123456',
      novaSenha: 'NovaSenha9',
      confirmarNovaSenha: 'diferente',
    });
    expect(resultado.success).toBe(false);
  });

  test('aceita quando tudo confere', () => {
    const resultado = alterarSenhaSchema.safeParse({
      senhaAtual: '123456',
      novaSenha: 'NovaSenha9',
      confirmarNovaSenha: 'NovaSenha9',
    });
    expect(resultado.success).toBe(true);
  });
});

describe('regras de segurança do cadastro', () => {
  const valido = {
    nome: 'Maria da Silva',
    email: 'maria@exemplo.com',
    senha: 'Segura2026',
    confirmarSenha: 'Segura2026',
    aceitouTermos: true,
  };

  test.each(['123456', 'somenteletras', '12345678', 'Senha123'.slice(0, 5)])(
    'recusa a senha fraca "%s"',
    (senha) => {
      expect(registerSchema.safeParse({ ...valido, senha, confirmarSenha: senha }).success).toBe(
        false,
      );
    },
  );

  test('exige o aceite dos termos (LGPD)', () => {
    const resultado = registerSchema.safeParse({ ...valido, aceitouTermos: false });
    expect(resultado.success).toBe(false);
    expect(resultado.error?.issues[0].message).toMatch(/Termos de Uso/);
  });
});
