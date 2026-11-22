-- LGPD: registra quando e qual versão dos Termos de Uso e da Política de
-- Privacidade cada usuário aceitou no cadastro (prova do aceite).
ALTER TABLE usuarios
  ADD COLUMN termos_versao text,
  ADD COLUMN termos_aceitos_em timestamptz;
