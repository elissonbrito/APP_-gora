import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';

/**
 * Erro com status HTTP e uma mensagem em português pronta para o cidadão.
 * O app exibe o campo `mensagem` diretamente (services/api/errors.ts).
 */
export class ErroHttp extends Error {
  readonly status: number;

  constructor(status: number, mensagem: string) {
    super(mensagem);
    this.status = status;
  }
}

export const naoEncontrado = (mensagem = 'Não encontramos o que você procura.') =>
  new ErroHttp(404, mensagem);

/** Converte qualquer erro em resposta JSON { mensagem } sem vazar detalhes técnicos. */
export const tratarErros: ErrorRequestHandler = (erro, req, res, _next) => {
  if (erro instanceof ErroHttp) {
    res.status(erro.status).json({ mensagem: erro.message });
    return;
  }
  if (erro instanceof ZodError) {
    res.status(422).json({ mensagem: erro.issues[0]?.message ?? 'Dados inválidos.' });
    return;
  }
  if (erro?.type === 'entity.parse.failed') {
    res.status(400).json({ mensagem: 'Corpo da requisição inválido.' });
    return;
  }
  if (erro?.type === 'entity.too.large') {
    res.status(413).json({ mensagem: 'Os dados enviados são grandes demais.' });
    return;
  }
  // Registra só o essencial: a mensagem técnica e a rota. Nunca o corpo da
  // requisição, o token ou o objeto completo do erro do banco, que pode
  // conter dados pessoais (e-mails, endereços) — LGPD.
  const codigo = (erro as { code?: string })?.code;
  console.error(
    `[erro] ${req.method} ${req.path}${codigo ? ` (código ${codigo})` : ''}:`,
    erro instanceof Error ? erro.message : 'erro desconhecido',
  );
  res.status(500).json({ mensagem: 'Não foi possível concluir sua solicitação. Tente novamente em instantes.' });
};
