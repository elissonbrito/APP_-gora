-- Esquema inicial do ÁGORA. Os valores dos CHECK espelham os tipos do app
-- (src/types/*.ts): mudar um lado exige mudar o outro.

CREATE TABLE usuarios (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        text NOT NULL CHECK (length(trim(nome)) >= 3),
  email       text NOT NULL,
  telefone    text,
  senha_hash  text NOT NULL,
  papel       text NOT NULL DEFAULT 'cidadao'
              CHECK (papel IN ('cidadao', 'colaborador', 'gestor', 'administrador')),
  criado_em   timestamptz NOT NULL DEFAULT now()
);
-- E-mail único sem diferenciar maiúsculas de minúsculas.
CREATE UNIQUE INDEX usuarios_email_unico ON usuarios (lower(email));

-- Protocolos sequenciais: AG-<ano>-<6 dígitos>.
CREATE SEQUENCE protocolo_seq START 1;

CREATE TABLE demandas (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  protocolo          text NOT NULL UNIQUE,
  usuario_id         uuid NOT NULL REFERENCES usuarios (id) ON DELETE CASCADE,
  assunto            text NOT NULL CHECK (length(assunto) >= 5),
  descricao          text NOT NULL CHECK (length(descricao) >= 20),
  categoria          text NOT NULL CHECK (categoria IN (
                       'iluminacao_publica', 'buracos_via', 'coleta_lixo',
                       'poda_arvore', 'saneamento', 'outros')),
  status             text NOT NULL DEFAULT 'recebida'
                     CHECK (status IN ('recebida', 'em_analise', 'em_andamento', 'concluida')),
  endereco           text NOT NULL,
  cep                text,
  latitude           double precision,
  longitude          double precision,
  setor_responsavel  text,
  fotos              text[] NOT NULL DEFAULT '{}',
  criada_em          timestamptz NOT NULL DEFAULT now(),
  atualizada_em      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX demandas_por_usuario ON demandas (usuario_id, atualizada_em DESC);

CREATE TABLE demanda_historico (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  demanda_id  uuid NOT NULL REFERENCES demandas (id) ON DELETE CASCADE,
  status      text NOT NULL
              CHECK (status IN ('recebida', 'em_analise', 'em_andamento', 'concluida')),
  mensagem    text,
  data        timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX historico_por_demanda ON demanda_historico (demanda_id, data);

CREATE TABLE avaliacoes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  demanda_id  uuid NOT NULL UNIQUE REFERENCES demandas (id) ON DELETE CASCADE,
  nota        smallint NOT NULL CHECK (nota BETWEEN 1 AND 5),
  comentario  text,
  criada_em   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE notificacoes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id  uuid NOT NULL REFERENCES usuarios (id) ON DELETE CASCADE,
  demanda_id  uuid REFERENCES demandas (id) ON DELETE CASCADE,
  tipo        text NOT NULL CHECK (tipo IN (
                'atualizacao_status', 'resposta_setor', 'solicitacao_informacao',
                'conclusao', 'aviso_geral')),
  titulo      text NOT NULL,
  corpo       text NOT NULL,
  lida        boolean NOT NULL DEFAULT false,
  criada_em   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX notificacoes_por_usuario ON notificacoes (usuario_id, criada_em DESC);
