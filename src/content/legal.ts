/**
 * Termos de Uso e Política de Privacidade do ÁGORA (LGPD — Lei 13.709/2018).
 * Ao mudar qualquer texto, atualize VERSAO_DOCUMENTOS aqui e VERSAO_TERMOS no
 * backend (backend/src/termos.ts): o aceite de cada usuário fica registrado
 * com a versão aceita.
 */
export const VERSAO_DOCUMENTOS = '2026-11-22';
export const DATA_ATUALIZACAO = '22 de novembro de 2026';

export type SecaoLegal = { titulo: string; paragrafos: string[] };
export type DocumentoLegal = { titulo: string; introducao: string; secoes: SecaoLegal[] };

export const termosDeUso: DocumentoLegal = {
  titulo: 'Termos de Uso',
  introducao:
    'Estes Termos explicam as regras para usar o ÁGORA, o aplicativo de ouvidoria e participação cidadã. Ao criar sua conta, você declara que leu e concorda com eles e com a Política de Privacidade.',
  secoes: [
    {
      titulo: '1. O que é o ÁGORA',
      paragrafos: [
        'O ÁGORA é um canal para o cidadão registrar demandas sobre serviços públicos da cidade (iluminação, buracos, coleta de lixo, poda de árvores, saneamento e outros), acompanhar o andamento pelo protocolo e avaliar o atendimento.',
        'O aplicativo é operado pelo órgão público responsável pela ouvidoria do seu município, nos termos da Lei 13.460/2017 (direitos dos usuários de serviços públicos).',
      ],
    },
    {
      titulo: '2. Não é canal de emergência',
      paragrafos: [
        'O ÁGORA não substitui os serviços de emergência. Em situações de risco à vida ou ao patrimônio, ligue imediatamente:',
        '• 190 — Polícia Militar',
        '• 192 — SAMU',
        '• 193 — Corpo de Bombeiros',
        '• 199 — Defesa Civil',
      ],
    },
    {
      titulo: '3. Sua conta',
      paragrafos: [
        'Para usar o ÁGORA é preciso criar uma conta pessoal com nome, e-mail e senha. Você se compromete a informar dados verdadeiros e mantê-los atualizados.',
        'A conta é individual e intransferível. Guarde sua senha em sigilo: ações feitas com ela são de sua responsabilidade. Se suspeitar de uso indevido, troque a senha em Perfil › Alterar senha.',
        'O aplicativo é destinado a maiores de 18 anos. Menores de idade só podem usá-lo com a assistência e o consentimento de um dos pais ou responsável legal.',
      ],
    },
    {
      titulo: '4. Uso adequado',
      paragrafos: [
        'Ao registrar demandas, comentários e avaliações, você concorda em não:',
        '• enviar informações falsas ou registrar demandas em nome de outra pessoa;',
        '• publicar conteúdo ofensivo, discriminatório, ameaçador ou ilegal;',
        '• expor dados pessoais de terceiros ou fotos que identifiquem pessoas sem necessidade;',
        '• usar robôs ou automação para criar contas e demandas em massa;',
        '• tentar acessar dados de outros usuários ou interferir no funcionamento do sistema.',
        'Demandas que descumprirem estas regras podem ser recusadas, e a conta pode ser suspensa.',
      ],
    },
    {
      titulo: '5. Atendimento das demandas',
      paragrafos: [
        'O registro de uma demanda não garante atendimento imediato. A análise, os prazos e a solução dependem do setor responsável do órgão público, que informa o andamento pela linha do tempo do protocolo.',
        'Você é responsável pelo conteúdo que enviar e autoriza o seu uso pelo órgão público exclusivamente para analisar e atender a demanda.',
      ],
    },
    {
      titulo: '6. Disponibilidade',
      paragrafos: [
        'Buscamos manter o ÁGORA disponível e seguro, mas ele pode passar por manutenções ou instabilidades. Rascunhos ficam salvos no seu aparelho para você não perder o que escreveu.',
      ],
    },
    {
      titulo: '7. Encerramento da conta',
      paragrafos: [
        'Você pode excluir sua conta a qualquer momento em Perfil › Privacidade e dados › Excluir minha conta. A exclusão apaga seus dados pessoais e suas demandas da base do ÁGORA.',
      ],
    },
    {
      titulo: '8. Alterações e lei aplicável',
      paragrafos: [
        'Estes Termos podem ser atualizados. Mudanças relevantes serão avisadas no aplicativo, e a versão em vigor fica sempre disponível em Perfil › Privacidade e dados.',
        'Aplicam-se as leis brasileiras, em especial a Lei 13.460/2017, a Lei Geral de Proteção de Dados (Lei 13.709/2018) e o Marco Civil da Internet (Lei 12.965/2014).',
      ],
    },
  ],
};

export const politicaDePrivacidade: DocumentoLegal = {
  titulo: 'Política de Privacidade',
  introducao:
    'Esta Política explica, de forma clara, quais dados pessoais o ÁGORA trata, para quê, com quem compartilha e como você exerce seus direitos, conforme a Lei Geral de Proteção de Dados (LGPD — Lei 13.709/2018).',
  secoes: [
    {
      titulo: '1. Quem trata seus dados',
      paragrafos: [
        'O controlador dos dados é o órgão público que opera o ÁGORA no seu município. O encarregado pelo tratamento de dados pessoais (DPO) é indicado por esse órgão, e o contato dele é publicado no canal oficial da ouvidoria municipal.',
      ],
    },
    {
      titulo: '2. Dados que coletamos',
      paragrafos: [
        '• Cadastro: nome, e-mail, telefone (opcional) e senha. A senha nunca é guardada em texto: armazenamos apenas um código criptográfico (hash bcrypt) que não permite recuperá-la.',
        '• Demandas: categoria, assunto, descrição, endereço, CEP e, se você permitir, a localização do GPS no momento do registro.',
        '• Fotos: se você anexar, as imagens permanecem no seu aparelho; o ÁGORA guarda apenas a referência a elas.',
        '• Avaliações: a nota e o comentário opcional sobre o atendimento.',
        '• Registro do aceite destes documentos: data e versão aceitas.',
        'Não coletamos CPF, documentos, dados de saúde, biometria nem contatos do seu celular.',
      ],
    },
    {
      titulo: '3. Para que usamos e com qual base legal',
      paragrafos: [
        '• Registrar, encaminhar e acompanhar suas demandas e responder a você — execução de políticas públicas e cumprimento de obrigação legal pelo poder público (LGPD, art. 7º, II e III, e art. 23; Lei 13.460/2017).',
        '• Manter sua conta e sua sessão — execução do serviço que você solicitou (art. 7º, V).',
        '• Usar sua localização e acessar suas fotos — somente com o seu consentimento, pedido pelo próprio celular, que você pode revogar a qualquer momento nas configurações do aparelho (art. 7º, I).',
        '• Proteger o serviço contra fraudes e acessos indevidos (art. 7º, IX).',
        'Não usamos seus dados para publicidade e não fazemos decisões automatizadas sobre você.',
      ],
    },
    {
      titulo: '4. Compartilhamento',
      paragrafos: [
        '• Os dados da demanda são compartilhados apenas com o setor do órgão público responsável pelo atendimento.',
        '• Para preencher o endereço, o aplicativo envia somente o CEP digitado ao serviço público ViaCEP; para listar municípios, envia somente a sigla do estado à API do IBGE. Nenhum dado que identifique você é enviado a esses serviços.',
        '• Seus dados não são vendidos nem cedidos a terceiros para fins comerciais.',
      ],
    },
    {
      titulo: '5. Dados guardados no seu aparelho',
      paragrafos: [
        '• Sessão: o token de acesso fica no cofre criptografado do sistema (Keychain no iPhone, Keystore no Android).',
        '• Rascunhos de demandas, tema escolhido, sua cidade e uma cópia temporária das listas de estados e municípios ficam no armazenamento local do aplicativo.',
        '• Ao sair da conta, apagamos do aparelho a sessão, os rascunhos e os dados em memória das suas demandas.',
      ],
    },
    {
      titulo: '6. Segurança',
      paragrafos: [
        'Adotamos medidas técnicas para proteger seus dados: senhas criptografadas, acesso restrito por login, conferência de que cada pessoa só acessa as próprias demandas, limite de tentativas de login, conexão protegida (HTTPS) no ambiente de produção e registros de segurança sem dados pessoais.',
        'Em caso de incidente de segurança que possa causar risco ou dano relevante, você e a Autoridade Nacional de Proteção de Dados (ANPD) serão comunicados, como determina o art. 48 da LGPD.',
      ],
    },
    {
      titulo: '7. Por quanto tempo guardamos',
      paragrafos: [
        'Seus dados ficam guardados enquanto sua conta estiver ativa. Ao excluir a conta, apagamos seus dados pessoais, suas demandas, avaliações e notificações da base do ÁGORA.',
      ],
    },
    {
      titulo: '8. Seus direitos (LGPD, art. 18)',
      paragrafos: [
        'Você pode, a qualquer momento e de graça:',
        '• confirmar e acessar seus dados — Perfil › Privacidade e dados › Baixar meus dados;',
        '• corrigir dados incompletos ou desatualizados — Perfil › Meus dados;',
        '• levar seus dados para outro serviço (portabilidade) — o arquivo de “Baixar meus dados” está em formato aberto (JSON);',
        '• pedir a eliminação dos seus dados — Perfil › Privacidade e dados › Excluir minha conta;',
        '• revogar o consentimento de localização e fotos — nas configurações do celular;',
        '• saber com quem seus dados são compartilhados — seção 4 desta Política.',
        'Se entender que seus direitos não foram atendidos, você pode reclamar à ANPD pelo site gov.br/anpd.',
      ],
    },
    {
      titulo: '9. Alterações',
      paragrafos: [
        'Esta Política pode ser atualizada para refletir mudanças no aplicativo ou na lei. A versão e a data da última atualização aparecem no topo, e mudanças relevantes serão avisadas no aplicativo.',
      ],
    },
  ],
};
