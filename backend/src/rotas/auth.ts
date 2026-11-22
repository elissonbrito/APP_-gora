import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { z } from 'zod';

import { exigirLogin, usuarioLogado } from '../auth/middleware.ts';
import { gerarTokens } from '../auth/token.ts';
import { paraUsuarioApi, type LinhaUsuario } from '../auth/usuario.ts';
import { consultar } from '../db.ts';
import { ErroHttp } from '../erros.ts';

const email = z.string().trim().min(1, 'Informe seu e-mail.').email('Informe um e-mail válido.');
const telefone = z
  .string()
  .trim()
  .optional()
  .transform((valor) => valor || null);

const loginSchema = z.object({ email, senha: z.string().min(1, 'Informe sua senha.') });
const cadastroSchema = z.object({
  nome: z.string().trim().min(3, 'Informe seu nome completo.'),
  email,
  telefone,
  senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
});
const perfilSchema = z.object({ nome: z.string().trim().min(3, 'Informe seu nome completo.'), telefone });
const alterarSenhaSchema = z.object({
  senhaAtual: z.string().min(1, 'Informe sua senha atual.'),
  novaSenha: z.string().min(6, 'A nova senha deve ter pelo menos 6 caracteres.'),
});

const CAMPOS = 'id, nome, email, telefone, papel';

async function buscarUsuario(id: string): Promise<LinhaUsuario> {
  const [linha] = await consultar<LinhaUsuario>(`SELECT ${CAMPOS} FROM usuarios WHERE id = $1`, [id]);
  if (!linha) throw new ErroHttp(401, 'Sua sessão expirou. Faça login novamente.');
  return linha;
}

export const rotasAuth = Router();

rotasAuth.post('/login', async (req, res) => {
  const dados = loginSchema.parse(req.body);
  const [linha] = await consultar<LinhaUsuario & { senha_hash: string }>(
    `SELECT ${CAMPOS}, senha_hash FROM usuarios WHERE lower(email) = lower($1)`,
    [dados.email],
  );
  // Mesma mensagem para e-mail inexistente e senha errada: não revela quem tem conta.
  if (!linha || !(await bcrypt.compare(dados.senha, linha.senha_hash))) {
    throw new ErroHttp(401, 'E-mail ou senha inválidos.');
  }
  res.json({ user: paraUsuarioApi(linha), tokens: gerarTokens(linha.id) });
});

rotasAuth.post('/register', async (req, res) => {
  const dados = cadastroSchema.parse(req.body);
  const hash = await bcrypt.hash(dados.senha, 10);
  try {
    const [linha] = await consultar<LinhaUsuario>(
      `INSERT INTO usuarios (nome, email, telefone, senha_hash)
       VALUES ($1, $2, $3, $4) RETURNING ${CAMPOS}`,
      [dados.nome, dados.email, dados.telefone, hash],
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
rotasAuth.post('/forgot-password', async (req, res) => {
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
