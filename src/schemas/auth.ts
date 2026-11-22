import { z } from 'zod';

// Senhas mais usadas: aparecem primeiro em qualquer ataque de força bruta.
const SENHAS_COMUNS = new Set([
  '12345678',
  '123456789',
  '1234567890',
  '87654321',
  '11111111',
  '00000000',
  'password',
  'password1',
  'senha123',
  'senha1234',
  'qwerty123',
  'abc12345',
  'abcd1234',
  'a1b2c3d4',
  'brasil123',
  'mudar123',
  'admin123',
  'iloveyou1',
]);

/**
 * Regra de senha forte, igual à do backend (backend/src/validacao.ts):
 * 8 a 72 caracteres, letras e números, e fora da lista de senhas comuns.
 */
export const senhaForte = (rotulo = 'A senha') =>
  z
    .string()
    .min(8, `${rotulo} deve ter pelo menos 8 caracteres.`)
    .max(72, `${rotulo} pode ter no máximo 72 caracteres.`)
    .refine((senha) => /[A-Za-z]/.test(senha) && /\d/.test(senha), {
      message: 'Use letras e números na senha.',
    })
    .refine((senha) => !SENHAS_COMUNS.has(senha.toLowerCase()), {
      message: 'Essa senha é muito comum. Escolha outra.',
    });

export const loginSchema = z.object({
  email: z.string().min(1, 'Informe seu e-mail.').email('Informe um e-mail válido.'),
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    nome: z.string().min(3, 'Informe seu nome completo.'),
    email: z.string().min(1, 'Informe seu e-mail.').email('Informe um e-mail válido.'),
    telefone: z.string().optional(),
    senha: senhaForte(),
    confirmarSenha: z.string().min(1, 'Confirme sua senha.'),
    // LGPD: o cadastro só segue com o aceite explícito dos documentos.
    aceitouTermos: z.boolean().refine((aceitou) => aceitou, {
      message: 'É preciso aceitar os Termos de Uso e a Política de Privacidade.',
    }),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: 'As senhas não coincidem.',
    path: ['confirmarSenha'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const recuperarSenhaSchema = z.object({
  email: z.string().min(1, 'Informe seu e-mail.').email('Informe um e-mail válido.'),
});

export type RecuperarSenhaFormValues = z.infer<typeof recuperarSenhaSchema>;

export const atualizarPerfilSchema = z.object({
  nome: z.string().min(3, 'Informe seu nome completo.'),
  telefone: z.string().optional(),
});

export type AtualizarPerfilFormValues = z.infer<typeof atualizarPerfilSchema>;

export const alterarSenhaSchema = z
  .object({
    senhaAtual: z.string().min(1, 'Informe sua senha atual.'),
    novaSenha: senhaForte('A nova senha'),
    confirmarNovaSenha: z.string().min(1, 'Confirme a nova senha.'),
  })
  .refine((data) => data.novaSenha === data.confirmarNovaSenha, {
    message: 'As senhas não coincidem.',
    path: ['confirmarNovaSenha'],
  });

export type AlterarSenhaFormValues = z.infer<typeof alterarSenhaSchema>;
