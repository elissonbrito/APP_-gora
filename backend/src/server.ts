import { networkInterfaces } from 'node:os';

import { criarApp } from './app.ts';
import { config } from './config.ts';
import { migrar } from './migracoes.ts';

const novas = await migrar();
if (novas.length) console.log(`Migrações aplicadas: ${novas.join(', ')}`);

// 0.0.0.0: aceita conexões da rede local, para o celular com Expo Go alcançar o PC.
criarApp().listen(config.porta, '0.0.0.0', () => {
  const ips = Object.values(networkInterfaces())
    .flat()
    .filter((rede) => rede && rede.family === 'IPv4' && !rede.internal)
    .map((rede) => `http://${rede?.address}:${config.porta}`);
  console.log(`API do ÁGORA rodando em http://localhost:${config.porta}`);
  if (ips.length) console.log(`No celular, use: ${ips.join(' ou ')}`);
});
