import type { RequestHandler } from 'express';

import { ErroHttp } from '../erros.ts';

import { verificarTokenDeAcesso } from './token.ts';

/**
 * Exige o cabeçalho "Authorization: Bearer <token>" válido. O id do usuário
 * fica em res.locals.usuarioId para as rotas seguintes.
 */
export const exigirLogin: RequestHandler = (req, res, next) => {
  const [tipo, token] = (req.headers.authorization ?? '').split(' ');
  const usuarioId = tipo === 'Bearer' && token ? verificarTokenDeAcesso(token) : null;
  if (!usuarioId) {
    throw new ErroHttp(401, 'Sua sessão expirou. Faça login novamente.');
  }
  res.locals.usuarioId = usuarioId;
  next();
};

export function usuarioLogado(res: { locals: Record<string, unknown> }): string {
  return res.locals.usuarioId as string;
}
