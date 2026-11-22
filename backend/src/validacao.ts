import { z } from 'zod';

// As senhas mais usadas no Brasil e no mundo: aparecem primeiro em qualquer
// ataque de força bruta, então não são aceitas mesmo tendo 8+ caracteres.
const SENHAS_COMUNS = new Set([
  '12345678', '123456789', '1234567890', '87654321', '11111111', '00000000',
  'password', 'password1', 'senha123', 'senha1234', 'qwerty123', 'abc12345',
  'abcd1234', 'a1b2c3d4', 'brasil123', 'mudar123', 'admin123', 'iloveyou1',
]);

/** Mesma regra do app (src/schemas/auth.ts). Máximo de 72: limite do bcrypt. */
export const senhaForte = z
  .string()
  .min(8, 'A senha deve ter pelo menos 8 caracteres.')
  .max(72, 'A senha pode ter no máximo 72 caracteres.')
  .refine((senha) => /[A-Za-z]/.test(senha) && /\d/.test(senha), {
    message: 'Use letras e números na senha.',
  })
  .refine((senha) => !SENHAS_COMUNS.has(senha.toLowerCase()), {
    message: 'Essa senha é muito comum. Escolha outra.',
  });
