import { z } from 'zod';

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
    senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
    confirmarSenha: z.string().min(1, 'Confirme sua senha.'),
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
    novaSenha: z.string().min(6, 'A nova senha deve ter pelo menos 6 caracteres.'),
    confirmarNovaSenha: z.string().min(1, 'Confirme a nova senha.'),
  })
  .refine((data) => data.novaSenha === data.confirmarNovaSenha, {
    message: 'As senhas não coincidem.',
    path: ['confirmarNovaSenha'],
  });

export type AlterarSenhaFormValues = z.infer<typeof alterarSenhaSchema>;
