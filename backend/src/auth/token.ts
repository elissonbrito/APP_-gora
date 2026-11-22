import jwt from 'jsonwebtoken';

import { config } from '../config.ts';

type Payload = { sub: string; tipo: 'acesso' | 'renovacao' };

/** Emite os tokens da sessão. O app guarda os dois no SecureStore. */
export function gerarTokens(usuarioId: string) {
  return {
    accessToken: jwt.sign({ tipo: 'acesso' }, config.jwtSecret, {
      subject: usuarioId,
      expiresIn: config.jwtExpiracao,
    }),
    // Reservado para uma futura renovação de sessão; hoje o app não o usa.
    refreshToken: jwt.sign({ tipo: 'renovacao' }, config.jwtSecret, {
      subject: usuarioId,
      expiresIn: '30d',
    }),
  };
}

/** Devolve o id do usuário de um token de acesso válido, ou null. */
export function verificarTokenDeAcesso(token: string): string | null {
  try {
    const payload = jwt.verify(token, config.jwtSecret) as Payload;
    return payload.tipo === 'acesso' ? payload.sub : null;
  } catch {
    return null;
  }
}
