import cors from 'cors';
import express from 'express';

import { naoEncontrado, tratarErros } from './erros.ts';
import { rotasAuth } from './rotas/auth.ts';
import { rotasDemandas } from './rotas/demandas.ts';
import { rotasNotificacoes } from './rotas/notificacoes.ts';

/** Monta a aplicação Express (sem abrir porta — os testes usam esta função). */
export function criarApp() {
  const app = express();
  app.disable('x-powered-by');
  // Libera o app web em desenvolvimento (localhost:8081); o celular não usa CORS.
  app.use(cors());
  app.use(express.json({ limit: '100kb' }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });
  app.use('/auth', rotasAuth);
  app.use('/demandas', rotasDemandas);
  app.use('/notificacoes', rotasNotificacoes);

  app.use(() => {
    throw naoEncontrado('Rota não encontrada.');
  });
  app.use(tratarErros);
  return app;
}
