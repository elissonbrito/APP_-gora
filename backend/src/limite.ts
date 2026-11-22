import type { Request, RequestHandler } from 'express';

import { ErroHttp } from './erros.ts';

type Opcoes = {
  /** Janela de tempo em que as tentativas são contadas. */
  janelaMs: number;
  /** Quantas tentativas contadas são permitidas dentro da janela. */
  maximo: number;
  /** Como agrupar as tentativas (por IP, por IP + e-mail…). */
  chave: (req: Request) => string;
  /** Quais respostas contam como tentativa. Padrão: todas. */
  contar?: (status: number) => boolean;
  mensagem: string;
};

/**
 * Limitador de tentativas em memória (OWASP API4: consumo irrestrito de
 * recursos). Bloqueia com 429 depois de `maximo` tentativas na janela.
 * Em produção com várias instâncias, troque por um armazenamento comum (Redis).
 */
export function limitarTentativas(opcoes: Opcoes): RequestHandler {
  const registros = new Map<string, { inicio: number; total: number }>();

  setInterval(() => {
    const agora = Date.now();
    for (const [chave, registro] of registros) {
      if (agora - registro.inicio > opcoes.janelaMs) registros.delete(chave);
    }
  }, opcoes.janelaMs).unref();

  return (req, res, next) => {
    const chave = opcoes.chave(req);
    const agora = Date.now();
    let registro = registros.get(chave);
    if (!registro || agora - registro.inicio > opcoes.janelaMs) {
      registro = { inicio: agora, total: 0 };
      registros.set(chave, registro);
    }

    if (registro.total >= opcoes.maximo) {
      const segundos = Math.ceil((registro.inicio + opcoes.janelaMs - agora) / 1000);
      res.setHeader('Retry-After', String(segundos));
      console.warn(`[seguranca] limite atingido em ${req.method} ${req.path} (ip ${req.ip})`);
      throw new ErroHttp(429, opcoes.mensagem);
    }

    const atual = registro;
    res.on('finish', () => {
      if (!opcoes.contar || opcoes.contar(res.statusCode)) atual.total += 1;
    });
    next();
  };
}

/** E-mail do corpo, normalizado, para agrupar tentativas por conta. */
export function emailDoCorpo(req: Request): string {
  const email = (req.body as { email?: unknown } | undefined)?.email;
  return typeof email === 'string' ? email.trim().toLowerCase() : '';
}
