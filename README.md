<p align="center">
  <img src="assets/images/icon.png" width="96" alt="Ícone do ÁGORA" />
</p>

<h1 align="center">ÁGORA</h1>

<p align="center"><strong>A praça pública no seu bolso.</strong><br/>
Registre, acompanhe e avalie as demandas da sua cidade — direto do celular.</p>

<p align="center">
  <img alt="Expo SDK 58" src="https://img.shields.io/badge/Expo-SDK%2058-000020?logo=expo" />
  <img alt="React Native 0.88" src="https://img.shields.io/badge/React%20Native-0.88-61DAFB?logo=react" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript" />
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-17-4169E1?logo=postgresql&logoColor=white" />
  <img alt="Versão" src="https://img.shields.io/badge/vers%C3%A3o-1.2.0-7A2E3D" />
</p>

---

## Por que o ÁGORA

Poste apagado, buraco na rua, lixo acumulado: o cidadão vê o problema, mas não sabe a quem recorrer nem acompanha o que acontece depois. O **ÁGORA** é o aplicativo de ouvidoria e participação cidadã que resolve isso:

- **Registrar em poucos toques** — categoria, descrição, fotos e endereço pelo **CEP** (ViaCEP) ou pelo **GPS**.
- **Acompanhar pelo protocolo** — linha do tempo de cada etapa, notificações e compartilhamento do protocolo.
- **Avaliar o atendimento** — nota e comentário quando a demanda é concluída.
- **Funcionar sem internet** — rascunhos guardados no aparelho, listas em cache e aviso de offline.
- **Respeitar a privacidade** — sessão no cofre do aparelho (Keychain/Keystore) e dados do usuário apagados ao sair da conta.

## Telas

<table>
  <tr>
    <td align="center"><img src="docs/screenshots/01-boas-vindas.png" width="200" /><br/><sub>Boas-vindas</sub></td>
    <td align="center"><img src="docs/screenshots/02-login.png" width="200" /><br/><sub>Login</sub></td>
    <td align="center"><img src="docs/screenshots/05-home.png" width="200" /><br/><sub>Home</sub></td>
    <td align="center"><img src="docs/screenshots/06-nova-demanda.png" width="200" /><br/><sub>Nova demanda com CEP</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/screenshots/09-demandas.png" width="200" /><br/><sub>Demandas com busca</sub></td>
    <td align="center"><img src="docs/screenshots/10-detalhe-demanda.png" width="200" /><br/><sub>Detalhe e linha do tempo</sub></td>
    <td align="center"><img src="docs/screenshots/11-notificacoes.png" width="200" /><br/><sub>Notificações</sub></td>
    <td align="center"><img src="docs/screenshots/12-perfil.png" width="200" /><br/><sub>Perfil</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/screenshots/07-rascunhos.png" width="200" /><br/><sub>Rascunhos no aparelho</sub></td>
    <td align="center"><img src="docs/screenshots/08-rascunho-detalhe.png" width="200" /><br/><sub>Detalhe do rascunho</sub></td>
    <td align="center"><img src="docs/screenshots/13-estados.png" width="200" /><br/><sub>Estados (IBGE)</sub></td>
    <td align="center"><img src="docs/screenshots/14-municipios.png" width="200" /><br/><sub>Municípios com busca</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/screenshots/15-aparencia-escuro.png" width="200" /><br/><sub>Aparência (tema escuro)</sub></td>
    <td align="center"><img src="docs/screenshots/16-home-escuro.png" width="200" /><br/><sub>Home no tema escuro</sub></td>
    <td align="center"><img src="docs/screenshots/19-offline.png" width="200" /><br/><sub>Aviso de offline</sub></td>
    <td align="center"><img src="docs/screenshots/17-ajuda.png" width="200" /><br/><sub>Ajuda / FAQ</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/screenshots/18-sobre.png" width="200" /><br/><sub>Sobre</sub></td>
    <td align="center"><img src="docs/screenshots/03-cadastro.png" width="200" /><br/><sub>Cadastro</sub></td>
    <td align="center"><img src="docs/screenshots/04-recuperar-senha.png" width="200" /><br/><sub>Recuperar senha</sub></td>
    <td align="center"><img src="docs/screenshots/20-pagina-404.png" width="200" /><br/><sub>Página 404</sub></td>
  </tr>
  <tr>
    <td align="center"><img src="docs/screenshots/23-protocolo-gerado.png" width="200" /><br/><sub>Protocolo gerado</sub></td>
    <td align="center"><img src="docs/screenshots/22-avaliacao.png" width="200" /><br/><sub>Avaliação do atendimento</sub></td>
    <td align="center"><img src="docs/screenshots/24-perfil-preferencias.png" width="200" /><br/><sub>Cidade e tema no Perfil</sub></td>
    <td align="center"><img src="docs/screenshots/21-alterar-senha.png" width="200" /><br/><sub>Alterar senha</sub></td>
  </tr>
</table>

São **19 telas** navegáveis: boas-vindas, login, cadastro, recuperar senha, Home, Demandas, Nova demanda, Notificações, Perfil, detalhe da demanda, alterar senha, Aparência, escolha de estado, escolha de município, Rascunhos, detalhe do rascunho, Ajuda, Sobre e página 404.

## O que foi aplicado de cada conteúdo da disciplina

| Conteúdo | Onde está no app |
|---|---|
| **StyleSheet e Flexbox** (Aula 7) | Todas as telas usam `StyleSheet.create` e cores/espaçamentos de um tema central (`src/constants/theme.ts`). Flexbox em listas, cartões e barra de abas (`row`, `column-reverse`, `flex: 1`, `gap`, `flexWrap`); `position: 'absolute'` no aviso de offline; `useWindowDimensions` nas boas-vindas e nas abas da web. |
| **Tema claro/escuro** (Aula 7) | Paletas clara e escura em `theme.ts`; o cidadão escolhe na tela **Aparência** (claro, escuro ou igual ao aparelho). |
| **Navegação com Expo Router** (Aula 8) | Rotas por arquivo em `src/app`, grupos `(app)` e `(tabs)`, rotas dinâmicas `[id]` e `[uf]`, Stack + Tabs, `router.push`/`replace`/`dismissTo`, rotas protegidas com `Stack.Protected` e tela `+not-found`. |
| **Consumo de API** (Aula 9) | APIs públicas reais: **ViaCEP** (endereço pelo CEP) e **IBGE Localidades** (estados e municípios), com camada de serviço, tratamento de erros em português, os 4 estados de tela (carregando, erro, vazio, sucesso), `FlatList` e puxar para atualizar. |
| **Armazenamento local** (Aula 10) | **SecureStore** para a sessão (token JWT); **AsyncStorage** para tema, cidade, onboarding, rascunhos e cache com validade (TTL); NetInfo para o aviso de offline; limpeza dos dados do usuário no logout. |
| **Backend próprio** | API REST em Node.js + Express com **PostgreSQL** (pasta `backend/`): usuários com senha criptografada (bcrypt), login com JWT, demandas, linha do tempo, avaliações e notificações. |

## Como executar

Pré-requisitos: **Node.js 22.18+ ou 24+**, npm, **Docker** (para o PostgreSQL) e o app **Expo Go** (compatível com o SDK 58) no celular. O celular e o computador precisam estar na **mesma rede Wi-Fi**.

### 1. Backend (API + PostgreSQL)

```bash
cd backend
cp .env.example .env     # na primeira vez; troque o JWT_SECRET
npm install
npm run db:up            # sobe o PostgreSQL no Docker (porta 5433)
npm run db:seed          # cria as tabelas e os dados de exemplo
npm run dev              # API em http://localhost:3333
```

Ao iniciar, a API mostra o endereço para usar no celular, por exemplo `http://192.168.0.101:3333`.

### 2. App

```bash
cp .env.example .env.local   # na primeira vez
# edite .env.local: EXPO_PUBLIC_API_URL=http://<IP do computador>:3333
npm install
npx expo start               # escaneie o QR code com o Expo Go
```

No celular, `localhost` é o próprio celular — por isso a URL usa o IP do computador na rede (Aula 9). Sem backend, use `EXPO_PUBLIC_API_MODE=mock` e o app roda com dados simulados.

### Usuários de teste

Criados pelo `npm run db:seed` (e também disponíveis no modo mock):

| E-mail | Senha | Papel |
|---|---|---|
| `cidadao@agora.dev` | `123456` | Cidadão |
| `colaborador@agora.dev` | `123456` | Colaborador |
| `gestor@agora.dev` | `123456` | Gestor |

O cadastro em `/cadastro` cria um novo cidadão no banco.

### Simulando a prefeitura

O app é a visão do cidadão. Para ver uma demanda andar até "Concluída" (e poder avaliá-la), avance o status pelo protocolo — o cidadão recebe a notificação:

```bash
cd backend
npm run status -- AG-2026-000124 "Equipe enviada ao local."
```

### Testes e qualidade

```bash
npm test                     # app: 80 testes (Jest + Testing Library)
npm run lint                 # ESLint (config do Expo)
npx tsc --noEmit             # TypeScript em modo strict
cd backend && npm test       # API: 10 testes de integração no banco agora_test
```

## Como o projeto foi criado do zero

Passo a passo seguido no desenvolvimento, na ordem do histórico de commits:

1. **Criação do projeto** — `npx create-expo-app@latest AGORA_APP` (template padrão com Expo Router e TypeScript) e `git init` com o repositório no GitHub.
2. **Rodar no celular** — `npx expo start` e leitura do QR code no Expo Go para validar o ambiente.
3. **Limpeza do template** — remoção das telas, componentes e do script `reset-project` de exemplo, mantendo só a estrutura `src/app`.
4. **Base do app** — tema central (`constants/theme.ts`), componentes de interface (`Button`, `Input`, `Card`, `Chip`, `Badge`), store de sessão com Zustand e SecureStore.
5. **Navegação e autenticação** — login, cadastro e recuperação de senha; grupo `(app)` protegido com `Stack.Protected`; abas `(tabs)`.
6. **Fluxo do cidadão** — Home, Nova demanda (formulário com React Hook Form + Zod, GPS e fotos), Demandas com filtros, detalhe com linha do tempo, Notificações, Perfil e avaliação.
7. **Consumo de API real** — clientes HTTP para APIs públicas, ViaCEP no formulário e IBGE nas telas de estado e município, com os 4 estados de tela.
8. **Armazenamento local** — wrapper tipado do AsyncStorage, cache com TTL, tema persistido, rascunhos no aparelho, onboarding salvo e aviso de offline.
9. **Atualização para o Expo SDK 58** — `npx expo install expo@^58.0.0 --fix` e ajustes para o React Native 0.88.
10. **Acabamento** — identidade visual (ícone e splash próprios), Ajuda, Sobre, página 404, busca, puxar para atualizar e limpeza de dados no logout.
11. **Backend com PostgreSQL** — API REST em `backend/` substituindo o mock: esquema com migrações, dados iniciais, autenticação JWT, testes de integração; o app passa a ler a URL da API do `.env.local`.

O histórico detalhado de cada versão está no [CHANGELOG](CHANGELOG.md).

## Arquitetura

```
src/
  app/                       # rotas (Expo Router)
    boas-vindas.tsx, login.tsx, cadastro.tsx, recuperar-senha.tsx, +not-found.tsx
    (app)/                   # telas de quem está logado (Stack.Protected)
      (tabs)/                # Home, Demandas, Nova, Notificações, Perfil
      demandas/[id].tsx      # detalhe da demanda
      localidades/           # estados e municípios [uf] (IBGE)
      rascunhos/             # lista e detalhe [id] (AsyncStorage)
      perfil/                # alterar senha, aparência
      ajuda/                 # FAQ e Sobre
  components/                # ui/, forms/, cards/, lists/, feedback/, loading/, timeline/
  features/                  # hooks por domínio (demandas, enderecos, localidades, notificacoes, rascunhos)
  services/                  # camada de serviço: api/ (clientes, erros, mock), enderecos/, localidades/, storage, cache
  stores/                    # Zustand: sessão, preferências, onboarding
  lib/                       # SecureStore, React Query, notificações, localização, limpeza no logout
  schemas/, types/, hooks/, utils/, constants/, config/

backend/
  docker-compose.yml         # PostgreSQL 17 (porta 5433) + banco de testes
  src/
    migrations/              # esquema SQL versionado
    rotas/                   # auth, demandas, notificacoes
    auth/                    # JWT, middleware de login, permissões por papel
    seed.ts                  # usuários e demandas de exemplo
    scripts/                 # migrar, popular, avançar status
  test/                      # testes de integração (node:test)
```

**Endpoints da API**

| Método | Rota | O que faz |
|---|---|---|
| POST | `/auth/login`, `/auth/register` | Entrar e cadastrar (devolve usuário e tokens) |
| GET / PATCH | `/auth/me` | Ver e editar o perfil |
| POST | `/auth/alterar-senha`, `/auth/forgot-password` | Trocar senha e pedir recuperação |
| GET | `/demandas/minhas` | Demandas do usuário logado |
| POST | `/demandas` | Criar demanda (gera protocolo, histórico e notificação) |
| GET | `/demandas/:id` | Detalhe com linha do tempo e avaliação |
| POST | `/demandas/:id/avaliacao` | Avaliar demanda concluída |
| GET | `/notificacoes` | Notificações do usuário |
| POST | `/notificacoes/:id/lida`, `/notificacoes/lidas` | Marcar uma ou todas como lidas |

**Decisões principais**

- **Nenhuma tela chama a API diretamente** — tela → hook em `features/` → serviço em `services/`.
- **Erros sempre em português** — `services/api/errors.ts` converte falhas de rede, timeout e status HTTP em mensagens prontas para o cidadão.
- **APIs públicas não recebem o token** do usuário (`services/api/public-client.ts`).
- **Web com alternativa segura** — no navegador não há SecureStore; a sessão fica só em memória (`lib/secure-storage.web.ts`).
- **Segurança no backend** — senhas com bcrypt, SQL sempre parametrizado, um usuário só enxerga as próprias demandas (as de outros respondem 404) e erros 500 nunca expõem detalhes técnicos.

## Modo de API

O app escolhe de onde vêm os dados pelo `.env.local`:

- `EXPO_PUBLIC_API_MODE=http` — usa o backend em `EXPO_PUBLIC_API_URL` (PostgreSQL).
- `EXPO_PUBLIC_API_MODE=mock` — usa os dados simulados de `src/services/api/mock/`, sem precisar de backend.

As APIs públicas (ViaCEP e IBGE) são sempre reais. Nenhuma tela muda entre os modos — só a configuração.

## Limitações conhecidas

- **Push remoto** exige development build (desde o SDK 53); o push local e o deep link funcionam no Expo Go.
- **Mapa interativo** não está incluso: a localização é resolvida por GPS + endereço em texto.
- **Telas de colaborador e gestor**: os papéis e permissões existem no domínio, mas a interface atual é a do cidadão (o atendimento é simulado pelo `npm run status`).
- **Fotos**: o backend guarda o endereço local das fotos no aparelho; elas aparecem no celular que as tirou, mas o envio dos arquivos para o servidor não faz parte desta versão.
- **Sessão**: o token vale 7 dias e não há renovação automática; depois disso o app pede login de novo.

## Licença

[MIT](LICENSE)
