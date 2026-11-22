import type { RequestHandler } from 'express';

/**
 * Cabeçalhos de segurança para uma API JSON (OWASP Secure Headers):
 * nada da API deve ser interpretado como página, embutido em iframe ou
 * guardado em cache, pois as respostas têm dados pessoais.
 */
export const cabecalhosDeSeguranca: RequestHandler = (_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  next();
};
