import jwt from 'jsonwebtoken';

import { config } from '../config.ts';

type Payload = { sub: string; tipo: 'acesso' | 'renovacao' };

// Algoritmo fixo: o servidor nunca aceita um token assinado de outro jeito
// (ex.: "alg": "none" ou troca de algoritmo).
const ALGORITMO = 'HS256';

// Um segredo curto pode ser descoberto por força bruta e permitiria forjar
// tokens de qualquer usuário. A API não sobe sem um segredo forte.
if (config.jwtSecret.length < 32 || config.jwtSecret === 'troque-este-segredo') {
  throw new Error(
    'JWT_SECRET fraco. Gere um com: node -e "console.log(crypto.randomBytes(32).toString(\'hex\'))"',
  );
}

/** Emite os tokens da sessão. O app guarda os dois no SecureStore. */
export function gerarTokens(usuarioId: string) {
  return {
    accessToken: jwt.sign({ tipo: 'acesso' }, config.jwtSecret, {
      algorithm: ALGORITMO,
      subject: usuarioId,
      expiresIn: config.jwtExpiracao,
    }),
    // Reservado para uma futura renovação de sessão; hoje o app não o usa.
    refreshToken: jwt.sign({ tipo: 'renovacao' }, config.jwtSecret, {
      algorithm: ALGORITMO,
      subject: usuarioId,
      expiresIn: '30d',
    }),
  };
}

/** Devolve o id do usuário de um token de acesso válido, ou null. */
export function verificarTokenDeAcesso(token: string): string | null {
  try {
    const payload = jwt.verify(token, config.jwtSecret, { algorithms: [ALGORITMO] }) as Payload;
    return payload.tipo === 'acesso' ? payload.sub : null;
  } catch {
    return null;
  }
}
