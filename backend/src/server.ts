import { networkInterfaces } from 'node:os';

import { criarApp } from './app.ts';
import { config } from './config.ts';
import { migrar } from './migracoes.ts';

const novas = await migrar();
if (novas.length) console.log(`Migrações aplicadas: ${novas.join(', ')}`);

// 0.0.0.0: aceita conexões da rede local, para o celular com Expo Go alcançar o PC.
// No Express 5, um erro ao abrir a porta chega neste mesmo callback.
criarApp().listen(config.porta, '0.0.0.0', (erro?: Error) => {
  if (erro) {
    if ((erro as NodeJS.ErrnoException).code === 'EADDRINUSE') {
      console.error(
        `A porta ${config.porta} já está em uso — provavelmente a API já está rodando em outro terminal.\n` +
          `Use a que já está aberta, ou encerre-a (Ctrl+C) antes de subir de novo.`,
      );
    } else {
      console.error(`Não foi possível iniciar a API: ${erro.message}`);
    }
    process.exit(1);
  }

  const ips = Object.values(networkInterfaces())
    .flat()
    .filter((rede) => rede && rede.family === 'IPv4' && !rede.internal)
    .map((rede) => `http://${rede?.address}:${config.porta}`);
  console.log(`API do ÁGORA rodando em http://localhost:${config.porta}`);
  if (ips.length) console.log(`Na rede local: ${ips.join(' ou ')}`);
});
