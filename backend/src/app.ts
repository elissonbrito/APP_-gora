import cors from 'cors';
import express from 'express';

import { config } from './config.ts';
import { naoEncontrado, tratarErros } from './erros.ts';
import { criarRotasAuth } from './rotas/auth.ts';
import { rotasConta } from './rotas/conta.ts';
import { rotasDemandas } from './rotas/demandas.ts';
import { rotasNotificacoes } from './rotas/notificacoes.ts';
import { cabecalhosDeSeguranca } from './seguranca.ts';

/** Monta a aplicação Express (sem abrir porta — os testes usam esta função). */
export function criarApp() {
  const app = express();
  app.disable('x-powered-by');
  app.use(cabecalhosDeSeguranca);
  // Só o app web nas origens configuradas (CORS_ORIGINS) pode chamar a API
  // pelo navegador; o app no celular não usa CORS.
  app.use(cors({ origin: config.origensWeb }));
  app.use(express.json({ limit: '100kb' }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });
  app.use('/auth', criarRotasAuth());
  app.use('/conta', rotasConta);
  app.use('/demandas', rotasDemandas);
  app.use('/notificacoes', rotasNotificacoes);

  app.use(() => {
    throw naoEncontrado('Rota não encontrada.');
  });
  app.use(tratarErros);
  return app;
}
