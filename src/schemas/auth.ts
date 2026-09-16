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
