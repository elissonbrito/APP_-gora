# ÁGORA — App Mobile

Aplicativo mobile oficial da plataforma **ÁGORA HUB** (ouvidoria, participação cidadã e gestão operacional pública), construído com React Native + Expo. O cidadão registra manifestações, acompanha protocolos, recebe atualizações e avalia o atendimento — tudo pelo celular, sem precisar do sistema web.

> **Status atual:** ainda não existe uma API/backend do ÁGORA acessível a este projeto. Todas as chamadas de rede passam por uma camada de mock claramente identificada (`services/api/mock/`), documentada na seção [Modo de API](#modo-de-api-mock-vs-http) abaixo. Nenhuma regra de negócio real (autenticação, protocolos, SLAs) foi inventada — os contratos foram modelados a partir da especificação do produto, para trocar por chamadas reais sem reescrever telas.

## Stack

- **Expo SDK 57** (New Architecture) + **Expo Router** (navegação por arquivos, rotas tipadas)
- **React 19** / **React Native 0.86**
- **TypeScript** em modo `strict`
- **TanStack Query** — cache e sincronização de dados de servidor
- **Zustand** — sessão de autenticação e preferências locais (não substitui o React Query)
- **React Hook Form + Zod** — formulários e validação
- **Axios** — cliente HTTP único, com interceptors
- **Expo Secure Store** — tokens de sessão (nunca em AsyncStorage)
- **Expo Notifications / Location / Clipboard** — notificações, geolocalização e compartilhamento de protocolo
- **Jest + Testing Library** — testes automatizados

## Pré-requisitos

- Node.js LTS (18 ou superior) e npm
- App **Expo Go** no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779)) para testar sem instalar nada nativo
- Opcional: Android Studio / Xcode, apenas se for usar emulador/simulador ou gerar development build

O desenvolvimento é feito em Linux; todos os comandos abaixo funcionam em qualquer shell Unix.

## Instalação

```bash
npm install
```

## Executando

```bash
npm start        # abre o Metro/Expo Dev Tools — escaneie o QR code com o Expo Go
npm run web       # roda no navegador
npm run android   # roda em emulador/dispositivo Android conectado
npm run ios       # roda em simulador iOS (apenas macOS)
```

O app funciona inteiramente pelo **Expo Go** — nenhuma funcionalidade atual exige development build. As duas exceções futuras já mapeadas são notificações push remotas e mapa interativo (ver [Limitações conhecidas](#limitações-conhecidas)).

### Usuários de teste (mock)

Como não há backend, use um destes usuários para logar:

| E-mail | Senha | Papel |
|---|---|---|
| `cidadao@agora.dev` | `123456` | Cidadão |
| `colaborador@agora.dev` | `123456` | Colaborador |
| `gestor@agora.dev` | `123456` | Gestor |

O cadastro de novos usuários (`/cadastro`) também funciona e cria um cidadão novo em memória (perdido ao reiniciar o app).

## Modo de API (mock vs http)

Controlado por `src/config/env.ts`, lido de `Constants.expoConfig.extra`:

```json
// app.json
{
  "expo": {
    "extra": {
      "apiMode": "http",
      "apiUrl": "https://api.agora.example.com"
    }
  }
}
```

- `apiMode` ausente ou `"mock"` (padrão): todos os `services/*` respondem com dados fictícios de `services/api/mock/`.
- `apiMode: "http"`: os mesmos `services/*` passam a chamar `apiUrl` via Axios (`services/api/client.ts`), com o token de sessão injetado automaticamente pelo interceptor.

Nenhuma tela precisa mudar quando o backend real existir — só a configuração acima.

## Testes e lint

```bash
npm test    # roda a suíte Jest (schemas, tratamento de erros, serviços mockados)
npm run lint
```

## Arquitetura

```
src/
  app/                    # rotas (Expo Router)
    login.tsx, cadastro.tsx, recuperar-senha.tsx   # fora de qualquer grupo — acessíveis quando deslogado
    (app)/                # Stack protegido (Stack.Protected, só para quem está logado)
      (tabs)/              # Home, Demandas, Nova, Notificações, Perfil
      demandas/[id].tsx    # detalhe da demanda (empilhado sobre as tabs)
      perfil/alterar-senha.tsx
  components/
    ui/          # Button, Input, Card, Badge, Chip — design system base
    forms/       # CategoriaSelect, LocationField, StarRating
    cards/       # DemandaCard, NotificacaoCard, AvaliacaoSection
    feedback/    # EmptyState, ErrorState
    loading/     # Skeleton
    timeline/    # StatusTimeline
  features/      # hooks de use-case por domínio (auth, demandas, notificacoes)
  services/
    api/         # client Axios, interceptors, AppError, e api/mock/ (contratos fictícios)
    auth/, demandas/, notificacoes/   # camada de serviço — único ponto que fala com a API
  stores/        # Zustand: auth-store (sessão), preferences-store (preferências locais)
  schemas/       # validação Zod dos formulários
  types/         # tipos de domínio (User, Demanda, Notificacao, Avaliacao)
  hooks/, lib/, utils/, constants/, config/
```

### Decisões técnicas relevantes

- **Nenhuma tela chama Axios diretamente** — sempre via `services/<domínio>` e hooks em `features/<domínio>/hooks.ts`.
- **Autenticação protegida por `Stack.Protected`** (`src/app/_layout.tsx`): o layout raiz alterna entre o grupo `(app)` e as telas de login/cadastro conforme o status da sessão, restaurada do Secure Store no boot.
- **Erros nunca vazam mensagem técnica** — `services/api/errors.ts` converte qualquer erro (rede, timeout, 401/403/404/422/500) em `AppError` com mensagem em português já pronta para exibir ao cidadão.
- **RBAC por permissões, não por papel fixo** — `User.permissions` vem do backend (hoje do mock); a UI deveria consultar essas permissões para decidir o que mostrar, não o `role` diretamente.
- **Mock isolado e sinalizado** — todo arquivo em `services/api/mock/` tem o comentário `MOCK CONTRACT` no topo. Trocar por integração real é só reimplementar a função no `services/<domínio>/index.ts` correspondente quando `env.apiMode === 'http'`.

## Limitações conhecidas

- **Notificações push remotas**: a estrutura (permissão + navegação ao tocar) funciona no Expo Go, mas o envio de push remoto no Android exige development build desde o SDK 53 do Expo. Sem backend, não há de qualquer forma um servidor de push para registrar — isso só se torna relevante quando a API real existir.
- **Mapa interativo**: hoje a localização é resolvida por GPS + geocodificação reversa (endereço em texto), sem mapa visual — bibliotecas de mapa compatíveis com Expo (ex. `react-native-maps`) exigem development build.
- **Funcionalidades de colaborador/gestor**: o domínio de autenticação já modela os papéis e permissões, mas as telas mobile específicas para esses perfis ainda não foram implementadas (avaliação intencional de escopo, priorizando o fluxo do cidadão).

## Para novos desenvolvedores

1. Rode `npm install && npm start` e entre com um dos usuários de teste da tabela acima.
2. O fluxo principal do cidadão está todo navegável: Home → Nova demanda → protocolo → aba Demandas → detalhe com linha do tempo → avaliação (quando concluída).
3. Qualquer tela nova deve seguir o padrão já usado: hook em `features/<domínio>/hooks.ts` → serviço em `services/<domínio>/index.ts` → mock em `services/api/mock/` quando `apiMode` for `mock`.
4. Ao adicionar uma rota nova, rode `npm start` uma vez para o Expo Router regenerar `.expo/types/router.d.ts` antes de rodar `tsc` — os `href` tipados dependem desse arquivo gerado.
