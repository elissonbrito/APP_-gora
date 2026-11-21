# Changelog

Todas as mudanças relevantes do app ÁGORA são registradas aqui.
O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto usa [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.1.0] — 2026-11-21

Versão de entrega do P2 da disciplina de Aplicativos Híbridos: consumo de API real, armazenamento local, novas telas e identidade visual própria.

### Adicionado
- Consulta de endereço por CEP (API pública **ViaCEP**) na Nova Demanda.
- Escolha de estado e município (API de Localidades do **IBGE**) com busca, puxar para atualizar e os 4 estados de tela; a cidade fica salva no Perfil.
- Cache com validade (TTL) no AsyncStorage: estados e municípios abrem mesmo offline.
- Rascunhos da Nova Demanda guardados em **SQLite** (`expo-sqlite`), com telas de lista e detalhe.
- Tema claro, escuro ou igual ao aparelho, salvo no AsyncStorage, com a tela **Aparência**.
- Boas-vindas (onboarding) na primeira abertura, lembradas no aparelho.
- Aviso de offline (NetInfo) e recarga automática das listas quando a conexão volta.
- Telas **Ajuda** (perguntas frequentes), **Sobre** e **404**.
- Busca por protocolo ou assunto em Demandas; puxar para atualizar em Home, Demandas e Notificações.
- "Marcar todas como lidas" nas Notificações.
- Atalhos para Rascunhos e Ajuda no Perfil.
- Ícone, splash e favicon próprios do ÁGORA.
- README com prints de todas as telas e o passo a passo de criação do projeto.

### Alterado
- Projeto atualizado para o **Expo SDK 58** (React Native 0.88, React 19.3, Jest 30, Testing Library 14).
- Na web, a barra de abas fica no fluxo da tela: embaixo em telas estreitas e no topo em telas largas.
- Ao sair da conta, o app apaga do aparelho o cache de dados e os rascunhos do usuário.

### Corrigido
- App ficava em branco na web porque o SecureStore não existe no navegador.
- Botões dentro de `Link` perdiam fundo e cor na web.
- Formato do protocolo na prévia da tela Aparência.

### Removido
- Arquivos de exemplo do template do Expo (logo e ícone padrão).

## [1.0.0] — 2026-09-19

Primeira versão funcional do fluxo do cidadão, com API em modo mock.

### Adicionado
- Projeto Expo (SDK 57) com Expo Router, TypeScript estrito e testes com Jest.
- Login, cadastro e recuperação de senha com rotas protegidas (`Stack.Protected`) e sessão no Secure Store.
- Home do cidadão com saudação, resumo e últimas atualizações.
- Nova Demanda com categoria, descrição, localização por GPS e fotos anexadas.
- Lista de Demandas com filtro por status e detalhe com linha do tempo, cópia e compartilhamento do protocolo.
- Avaliação do atendimento (nota e comentário) em demandas concluídas.
- Notificações com permissão e deep link para a demanda.
- Perfil com edição de dados, preferência de notificações, alteração de senha e logout.
