import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { z } from 'zod';

import { exigirLogin, usuarioLogado } from '../auth/middleware.ts';
import { gerarTokens } from '../auth/token.ts';
import { paraUsuarioApi, type LinhaUsuario } from '../auth/usuario.ts';
import { consultar } from '../db.ts';
import { ErroHttp } from '../erros.ts';
import { emailDoCorpo, limitarTentativas } from '../limite.ts';
import { VERSAO_TERMOS } from '../termos.ts';
import { senhaForte } from '../validacao.ts';

const email = z.string().trim().min(1, 'Informe seu e-mail.').email('Informe um e-mail válido.');
const telefone = z
  .string()
  .trim()
  .optional()
  .transform((valor) => valor || null);

const loginSchema = z.object({ email, senha: z.string().min(1, 'Informe sua senha.') });
const cadastroSchema = z.object({
  nome: z.string().trim().min(3, 'Informe seu nome completo.').max(120, 'Nome muito longo.'),
  email,
  telefone,
  senha: senhaForte,
  // LGPD: sem o aceite explícito dos termos, a conta não é criada.
  aceitouTermos: z.literal(true, {
    error: 'É preciso aceitar os Termos de Uso e a Política de Privacidade.',
  }),
});
const perfilSchema = z.object({
  nome: z.string().trim().min(3, 'Informe seu nome completo.'),
  telefone,
});
const alterarSenhaSchema = z.object({
  senhaAtual: z.string().min(1, 'Informe sua senha atual.'),
  novaSenha: senhaForte,
});

const QUINZE_MINUTOS = 15 * 60 * 1000;
const UMA_HORA = 60 * 60 * 1000;
const MUITAS_TENTATIVAS = 'Muitas tentativas. Aguarde alguns minutos e tente novamente.';
const falhouLogin = (status: number) => status === 401;

// Hash de uma senha qualquer: quando o e-mail não existe, o login compara
// com ele mesmo assim, para levar o mesmo tempo e não revelar quem tem conta.
const HASH_FALSO = bcrypt.hashSync('senha-de-uma-conta-que-nao-existe', 10);

const CAMPOS = 'id, nome, email, telefone, papel';

async function buscarUsuario(id: string): Promise<LinhaUsuario> {
  const [linha] = await consultar<LinhaUsuario>(`SELECT ${CAMPOS} FROM usuarios WHERE id = $1`, [
    id,
  ]);
  if (!linha) throw new ErroHttp(401, 'Sua sessão expirou. Faça login novamente.');
  return linha;
}

/**
 * Cria as rotas de autenticação. É uma função (e não um objeto único) para
 * cada instância da API ter os próprios contadores de tentativas.
 */
export function criarRotasAuth() {
  const rotasAuth = Router();

  // Contam só as falhas: 5 senhas erradas por conta, 20 por IP (vários e-mails).
  const limiteLoginPorConta = limitarTentativas({
    janelaMs: QUINZE_MINUTOS,
    maximo: 5,
    chave: (req) => `${req.ip}|${emailDoCorpo(req)}`,
    contar: falhouLogin,
    mensagem: MUITAS_TENTATIVAS,
  });
  const limiteLoginPorIp = limitarTentativas({
    janelaMs: QUINZE_MINUTOS,
    maximo: 20,
    chave: (req) => req.ip ?? '',
    contar: falhouLogin,
    mensagem: MUITAS_TENTATIVAS,
  });
  const limiteCadastro = limitarTentativas({
    janelaMs: UMA_HORA,
    maximo: 5,
    chave: (req) => req.ip ?? '',
    mensagem: MUITAS_TENTATIVAS,
  });
  const limiteRecuperacao = limitarTentativas({
    janelaMs: QUINZE_MINUTOS,
    maximo: 5,
    chave: (req) => `${req.ip}|${emailDoCorpo(req)}`,
    mensagem: MUITAS_TENTATIVAS,
  });

  rotasAuth.post('/login', limiteLoginPorIp, limiteLoginPorConta, async (req, res) => {
    const dados = loginSchema.parse(req.body);
    const [linha] = await consultar<LinhaUsuario & { senha_hash: string }>(
      `SELECT ${CAMPOS}, senha_hash FROM usuarios WHERE lower(email) = lower($1)`,
      [dados.email],
    );
    // Compara sempre (com o hash falso se o e-mail não existe) e usa a mesma
    // mensagem nos dois casos: nem o texto nem o tempo revelam quem tem conta.
    const senhaConfere = await bcrypt.compare(dados.senha, linha?.senha_hash ?? HASH_FALSO);
    if (!linha || !senhaConfere) {
      console.warn(`[seguranca] login falhou (ip ${req.ip})`);
      throw new ErroHttp(401, 'E-mail ou senha inválidos.');
    }
    res.json({ user: paraUsuarioApi(linha), tokens: gerarTokens(linha.id) });
  });

  rotasAuth.post('/register', limiteCadastro, async (req, res) => {
    const dados = cadastroSchema.parse(req.body);
    const hash = await bcrypt.hash(dados.senha, 10);
    try {
      const [linha] = await consultar<LinhaUsuario>(
        `INSERT INTO usuarios (nome, email, telefone, senha_hash, termos_versao, termos_aceitos_em)
       VALUES ($1, $2, $3, $4, $5, now()) RETURNING ${CAMPOS}`,
        [dados.nome, dados.email, dados.telefone, hash, VERSAO_TERMOS],
      );
      res.status(201).json({ user: paraUsuarioApi(linha), tokens: gerarTokens(linha.id) });
    } catch (erro) {
      if ((erro as { code?: string }).code === '23505') {
        throw new ErroHttp(422, 'Já existe uma conta cadastrada com este e-mail.');
      }
      throw erro;
    }
  });

  /**
   * Por segurança, sempre responde 204, exista o e-mail ou não. O envio do
   * e-mail de recuperação não faz parte desta versão.
   */
  rotasAuth.post('/forgot-password', limiteRecuperacao, async (req, res) => {
    z.object({ email }).parse(req.body);
    res.status(204).end();
  });

  rotasAuth.get('/me', exigirLogin, async (_req, res) => {
    res.json(paraUsuarioApi(await buscarUsuario(usuarioLogado(res))));
  });

  rotasAuth.patch('/me', exigirLogin, async (req, res) => {
    const dados = perfilSchema.parse(req.body);
    const [linha] = await consultar<LinhaUsuario>(
      `UPDATE usuarios SET nome = $2, telefone = $3 WHERE id = $1 RETURNING ${CAMPOS}`,
      [usuarioLogado(res), dados.nome, dados.telefone],
    );
    if (!linha) throw new ErroHttp(401, 'Sua sessão expirou. Faça login novamente.');
    res.json(paraUsuarioApi(linha));
  });

  rotasAuth.post('/alterar-senha', exigirLogin, async (req, res) => {
    const dados = alterarSenhaSchema.parse(req.body);
    const id = usuarioLogado(res);
    const [linha] = await consultar<{ senha_hash: string }>(
      'SELECT senha_hash FROM usuarios WHERE id = $1',
      [id],
    );
    if (!linha || !(await bcrypt.compare(dados.senhaAtual, linha.senha_hash))) {
      throw new ErroHttp(422, 'Senha atual incorreta.');
    }
    await consultar('UPDATE usuarios SET senha_hash = $2 WHERE id = $1', [
      id,
      await bcrypt.hash(dados.novaSenha, 10),
    ]);
    res.status(204).end();
  });

  return rotasAuth;
}
