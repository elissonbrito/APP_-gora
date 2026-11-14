# Changelog

Todas as mudanças relevantes do app ÁGORA são registradas aqui.
O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto usa [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [1.1.0] — em desenvolvimento

Versão de entrega do P2 da disciplina de Aplicativos Híbridos. Foco em consumo de API real, armazenamento local e novas telas.

### Adicionado
- Registro de versões neste arquivo.

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
