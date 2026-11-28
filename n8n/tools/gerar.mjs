// Gera e publica no n8n local os workflows do time "Direct Response".
// Uso: node tools/gerar.mjs            (gera JSON em workflows/ e publica via API)
//      node tools/gerar.mjs --so-json  (só gera os arquivos)
// Precisa de N8N_API_KEY no ambiente. n8n em http://localhost:5678 (ou N8N_URL).
import { writeFileSync, mkdirSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { AGENTES, supervisorBriefing, supervisorRevisao, COORDENADOR_PLANO, COORDENADOR_RELATORIO } from './prompts.mjs';
import * as C from './codigos.mjs';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');
const N8N = (process.env.N8N_URL || 'http://localhost:5678').replace(/\/$/, '');
const KEY = process.env.N8N_API_KEY;
const SO_JSON = process.argv.includes('--so-json');
const TAG = 'Direct Response';
const PREFIXO = 'Direct Response · ';
const MODELO_GROK = 'grok-4';
// Onde o workflow 99 Erros grava um arquivo por erro (pasta que o n8n pode escrever)
const PASTA_ERROS = process.env.DR_PASTA_ERROS || 'C:\\Users\\italo\\Downloads\\claude\\canal-dark-n8n\\data\\direct-response\\erros';
// Repetições: nós Grok e leituras HTTP tentam 3 vezes, 5 s entre tentativas
const RETRY = { retryOnFail: true, maxTries: 3, waitBetweenTries: 5000 };

// ---------- API ----------
async function api(method, path, body) {
  const r = await fetch(N8N + '/api/v1' + path, {
    method, headers: { 'X-N8N-API-KEY': KEY, 'content-type': 'application/json', accept: 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  const t = await r.text();
  if (!r.ok) throw new Error(`${method} ${path} -> ${r.status}: ${t.slice(0, 500)}`);
  return t ? JSON.parse(t) : {};
}
async function listarTudo(path) {
  let out = [], cursor;
  do {
    const r = await api('GET', path + (path.includes('?') ? '&' : '?') + 'limit=100' + (cursor ? '&cursor=' + cursor : ''));
    out = out.concat(r.data || []); cursor = r.nextCursor;
  } while (cursor);
  return out;
}

// ---------- credenciais (placeholders; o usuário cola as chaves no n8n) ----------
const CREDS = {
  xai: { name: 'DR · xAI Grok', type: 'xAiApi', data: { apiKey: 'COLE_AQUI_A_CHAVE_DA_XAI' } },
  meta: { name: 'DR · Meta (token de sistema)', type: 'facebookGraphApi', data: { accessToken: 'COLE_AQUI_O_TOKEN_DA_META' } },
  hotmart: { name: 'DR · Hotmart', type: 'httpCustomAuth', data: { json: JSON.stringify({ headers: { Authorization: 'Basic COLE_AQUI_O_BASIC_DA_HOTMART' }, qs: { client_id: 'COLE_AQUI_O_CLIENT_ID', client_secret: 'COLE_AQUI_O_CLIENT_SECRET' } }) } }
};
const credRef = {}; // chave -> {id, name}

async function garantirCredenciais() {
  let existentes = [];
  try { existentes = await listarTudo('/credentials'); } catch (e) { console.warn('não listou credenciais:', e.message); }
  for (const [k, c] of Object.entries(CREDS)) {
    const ja = existentes.find(x => x.name === c.name && x.type === c.type);
    if (ja) { credRef[k] = { id: ja.id, name: ja.name }; console.log('credencial já existe:', c.name); continue; }
    const r = await api('POST', '/credentials', c);
    credRef[k] = { id: r.id, name: r.name };
    console.log('credencial criada (placeholder):', c.name);
  }
}

// ---------- construtor de workflow ----------
class WF {
  constructor(name) { this.name = name; this.nodes = []; this.connections = {}; this.x = 0; this.errorWorkflow = null; }
  add(name, type, typeVersion, parameters, pos, extra = {}) {
    this.nodes.push({ id: randomUUID(), name, type, typeVersion, position: pos, parameters, ...extra });
    return name;
  }
  link(a, b, out = 0, kind = 'main', inIdx = 0) {
    this.connections[a] = this.connections[a] || {};
    this.connections[a][kind] = this.connections[a][kind] || [];
    while (this.connections[a][kind].length <= out) this.connections[a][kind].push([]);
    this.connections[a][kind][out].push({ node: b, type: kind, index: inIdx });
  }
  json() {
    const settings = { executionOrder: 'v1', saveManualExecutions: true, callerPolicy: 'workflowsFromSameOwner' };
    if (this.errorWorkflow) settings.errorWorkflow = this.errorWorkflow;
    return { name: this.name, nodes: this.nodes, connections: this.connections, settings };
  }
}

const code = (wf, name, js, pos, extra) => wf.add(name, 'n8n-nodes-base.code', 2, { jsCode: js.trim() }, pos, extra);
const grokModel = (wf, name, pos) => wf.add(name, '@n8n/n8n-nodes-langchain.lmChatXAiGrok', 1,
  { model: MODELO_GROK, options: { temperature: 0.2 } }, pos, { credentials: { xAiApi: credRef.xai } });
// onError: 'continueErrorOutput' cria a saída 1 (erro), ligada ao nó "Falha do modelo" da etapa;
// no coordenador usa 'continueRegularOutput' para a rodada seguir até o relatório.
const agente = (wf, name, sistema, texto, pos, onError = 'continueErrorOutput') => wf.add(name, '@n8n/n8n-nodes-langchain.agent', 2.2,
  { promptType: 'define', text: '=' + texto, options: { systemMessage: sistema, maxIterations: 4 } }, pos, { ...RETRY, onError });
const sticky = (wf, name, content, pos, w = 420, h = 260, color = 5) =>
  wf.add(name, 'n8n-nodes-base.stickyNote', 1, { content, width: w, height: h, color }, pos);

// retry: por padrão só leituras (GET). POST de criação na Meta NUNCA repete (evita duplicar; regra 4 da seção 13 do plano).
function http(wf, name, pos, { method = 'GET', url, cred, qsJson, headers, bodyJson, texto = false, full = false, retry = method === 'GET', paginarCursor = false }) {
  const p = { method, url: '=' + url, options: {} };
  if (cred === 'meta') { p.authentication = 'predefinedCredentialType'; p.nodeCredentialType = 'facebookGraphApi'; }
  if (cred === 'xai') { p.authentication = 'predefinedCredentialType'; p.nodeCredentialType = 'xAiApi'; }
  if (cred === 'hotmart') { p.authentication = 'genericCredentialType'; p.genericAuthType = 'httpCustomAuth'; }
  if (qsJson) { p.sendQuery = true; p.specifyQuery = 'json'; p.jsonQuery = '=' + qsJson; }
  if (headers) { p.sendHeaders = true; p.headerParameters = { parameters: headers.map(([n, v]) => ({ name: n, value: v })) }; }
  if (bodyJson) { p.sendBody = true; p.specifyBody = 'json'; p.jsonBody = '=' + bodyJson; }
  if (texto || full) p.options.response = { response: { fullResponse: full, neverError: true, responseFormat: texto ? 'text' : 'json' } };
  p.options.timeout = 60000;
  if (paginarCursor) {
    // Graph API: segue paging.cursors.after até não haver paging.next (no máximo 25 páginas)
    p.options.pagination = { pagination: {
      paginationMode: 'updateAParameterInEachRequest',
      parameters: { parameters: [{ type: 'qs', name: 'after', value: '={{ $response.body.paging && $response.body.paging.cursors ? $response.body.paging.cursors.after : "" }}' }] },
      paginationCompleteWhen: 'other',
      completeExpression: '={{ !$response.body.paging || !$response.body.paging.next }}',
      limitPagesFetched: true, maxRequests: 25
    } };
  }
  const extra = { onError: 'continueRegularOutput', alwaysOutputData: true, ...(retry ? RETRY : {}) };
  if (cred === 'meta') extra.credentials = { facebookGraphApi: credRef.meta };
  if (cred === 'xai') extra.credentials = { xAiApi: credRef.xai };
  if (cred === 'hotmart') extra.credentials = { httpCustomAuth: credRef.hotmart };
  return wf.add(name, 'n8n-nodes-base.httpRequest', 4.2, p, pos, extra);
}

function ifTrue(wf, name, expr, pos) {
  return wf.add(name, 'n8n-nodes-base.if', 2.2, {
    conditions: {
      options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 2 },
      conditions: [{ id: randomUUID(), leftValue: '=' + expr, rightValue: '', operator: { type: 'boolean', operation: 'true', singleValue: true } }],
      combinator: 'and'
    },
    looseTypeValidation: true, options: {}
  }, pos);
}

const sub = (s, map) => Object.entries(map).reduce((a, [k, v]) => a.split(k).join(v), s);

// Abertura padrão: Entrada -> Pré-requisitos -> IF -> (false) Bloqueado
function abertura(wf, chave, preReqBody) {
  const a = AGENTES[chave];
  wf.add('Entrada', 'n8n-nodes-base.executeWorkflowTrigger', 1.1, { inputSource: 'passthrough' }, [0, 300]);
  code(wf, 'Pré-requisitos', sub(C.preReq(preReqBody), { __ETAPA__: chave }), [220, 300]);
  ifTrue(wf, 'Pode rodar?', '{{ $json.ok }}', [440, 300]);
  code(wf, 'Bloqueado / pulada', sub(C.BLOQUEADO, { __ETAPA__: chave, __AGENTE__: a.nome }), [660, 520]);
  wf.link('Entrada', 'Pré-requisitos'); wf.link('Pré-requisitos', 'Pode rodar?');
  wf.link('Pode rodar?', 'Bloqueado / pulada', 1);
  sticky(wf, 'Sobre este agente', `## ${a.nome} (${a.papel})\n${a.descricao}\n\n**Fluxo:** integração → GROK BOT orienta → ${a.nome} trabalha → verificações por código → GROK BOT supervisiona → saída para o Coordenador.\n\nO prompt completo com as regras está no nó **Agente · ${a.nome}** (System Message).`, [-40, -40], 520, 300, 4);
  return 'Pode rodar?';
}

// Fechamento padrão: Dados da etapa -> Grok briefing -> Agente -> [pós...] -> Grok revisão -> Saída
// pos: lista de nomes já criados que formam a cadeia após o agente (o último precisa devolver {saida, verificacoes})
function fechamento(wf, chave, x0, montarPos) {
  const a = AGENTES[chave];
  const y = 300;
  const agenteNome = 'Agente · ' + a.nome;
  grokModel(wf, 'Grok (xAI)', [x0 + 340, y + 260]);
  agente(wf, 'Grok · briefing', supervisorBriefing(chave),
    "{{ 'CONFIGURAÇÃO:\\n' + JSON.stringify($('Entrada').first().json.config) + '\\n\\nESTADO DO PROJETO (resumo):\\n' + JSON.stringify($('Entrada').first().json.estado || {}).slice(0, 6000) + '\\n\\nDADOS DA INTEGRAÇÃO:\\n' + JSON.stringify($('Dados da etapa').first().json).slice(0, 15000) }}",
    [x0, y]);
  agente(wf, agenteNome, a.sistema,
    "{{ 'BRIEFING DO GROK BOT (supervisor):\\n' + $json.output + '\\n\\nCONFIGURAÇÃO:\\n' + JSON.stringify($('Entrada').first().json.config) + '\\n\\nDADOS DA INTEGRAÇÃO:\\n' + JSON.stringify($('Dados da etapa').first().json.dados).slice(0, 40000) }}",
    [x0 + 300, y]);
  wf.link('Dados da etapa', 'Grok · briefing');
  wf.link('Grok · briefing', agenteNome);
  wf.link('Grok (xAI)', 'Grok · briefing', 0, 'ai_languageModel');
  wf.link('Grok (xAI)', agenteNome, 0, 'ai_languageModel');
  const { primeiro, ultimo, xFim } = montarPos(x0 + 600, y, agenteNome);
  wf.link(agenteNome, primeiro);
  agente(wf, 'Grok · supervisão', supervisorRevisao(chave),
    "{{ 'DADOS BRUTOS DA INTEGRAÇÃO:\\n' + JSON.stringify($('Dados da etapa').first().json.dados).slice(0, 20000) + '\\n\\nVERIFICAÇÕES AUTOMÁTICAS (código):\\n' + JSON.stringify(Object.assign({}, $('Dados da etapa').first().json.verificacoes, $('" + ultimo + "').first().json.verificacoes)) + '\\n\\nSAÍDA DO AGENTE:\\n' + JSON.stringify($('" + ultimo + "').first().json.saida).slice(0, 25000) }}",
    [xFim, y]);
  grokModel(wf, 'Grok (xAI) supervisor', [xFim + 40, y + 260]);
  wf.link('Grok (xAI) supervisor', 'Grok · supervisão', 0, 'ai_languageModel');
  wf.link(ultimo, 'Grok · supervisão');
  code(wf, 'Saída da etapa', sub(C.SAIDA, { __ETAPA__: chave, __AGENTE__: a.nome, __POS__: ultimo }), [xFim + 300, y]);
  wf.link('Grok · supervisão', 'Saída da etapa');
  // Falha do modelo: depois de 3 tentativas, a etapa reprova com motivo (a rodada segue até o relatório)
  code(wf, 'Falha do modelo', sub(C.FALHA_MODELO, { __ETAPA__: chave, __AGENTE__: a.nome }), [xFim + 300, y + 300]);
  for (const n of ['Grok · briefing', agenteNome, 'Grok · supervisão']) wf.link(n, 'Falha do modelo', 1);
}

const posSimples = (wf, nomePos, js) => (x, y) => { code(wf, nomePos, js, [x, y]); return { primeiro: nomePos, ultimo: nomePos, xFim: x + 260 }; };

// ---------- 7 etapas ----------
function wfRadar() {
  const wf = new WF(PREFIXO + '01 Radar (minerador)');
  const ok = abertura(wf, 'radar', `if (!(cfg.termos_busca || []).length && !(cfg.ofertas_br || []).length) faltando.push('termos_busca ou ofertas_br');
if (!cfg.pais_destino) faltando.push('pais_destino');`);
  code(wf, 'Consultas → itens', C.RADAR_ITENS, [660, 300]);
  http(wf, 'Meta Ad Library · país de destino', [880, 300], { url: '{{ $json.url }}', cred: 'meta', qsJson: '{{ JSON.stringify($json.qs) }}', paginarCursor: true });
  code(wf, 'Dados da etapa', C.RADAR_DADOS, [1100, 300]);
  wf.link(ok, 'Consultas → itens', 0); wf.link('Consultas → itens', 'Meta Ad Library · país de destino'); wf.link('Meta Ad Library · país de destino', 'Dados da etapa');
  fechamento(wf, 'radar', 1320, posSimples(wf, 'Conferência pós-agente', C.POS_SIMPLES));
  return wf;
}

function wfHeadline() {
  const wf = new WF(PREFIXO + '02 Headline Killer (copywriter)');
  const ok = abertura(wf, 'headline', `if (cfg.copy_aprovada === true && cfg.copy_aprovada_hash && estado.headline && estado.headline.saida_hash === cfg.copy_aprovada_hash) return [{ json: { ok: false, pulada: true, congelada: true, versao: cfg.copy_aprovada_hash, faltando: [] } }];
if (!(cfg.oferta_escolhida && cfg.oferta_escolhida.url_pagina_original)) faltando.push('oferta_escolhida.url_pagina_original (o dono escolhe a oferta)');
if (!cfg.idioma) faltando.push('idioma');`);
  http(wf, 'Página original · baixar', [660, 300], { url: "{{ $('Entrada').first().json.config.oferta_escolhida.url_pagina_original }}", texto: true });
  code(wf, 'Dados da etapa', C.HEADLINE_DADOS, [880, 300]);
  wf.link(ok, 'Página original · baixar', 0); wf.link('Página original · baixar', 'Dados da etapa');
  fechamento(wf, 'headline', 1100, posSimples(wf, 'Conferência pós-agente', C.HEADLINE_POS));
  return wf;
}

function wfConstrutor() {
  const wf = new WF(PREFIXO + '03 Construtor (página)');
  const ok = abertura(wf, 'construtor', `if (cfg.copy_aprovada !== true) faltando.push('copy_aprovada = true (aprovação do dono)');
if (!(estado.headline && estado.headline.saida)) faltando.push('entrega do Headline Killer');
else if (!cfg.copy_aprovada_hash || estado.headline.saida_hash !== cfg.copy_aprovada_hash) faltando.push('copy_aprovada_hash igual à versão da copy (' + (estado.headline.saida_hash || 'sem versão') + '): só a versão aprovada vira página');
if (!cfg.pixel_id) faltando.push('pixel_id');
if (!cfg.pasta_saida) faltando.push('pasta_saida');`);
  code(wf, 'Dados da etapa', C.CONSTRUTOR_DADOS, [660, 300]);
  wf.link(ok, 'Dados da etapa', 0);
  fechamento(wf, 'construtor', 880, (x, y) => {
    code(wf, 'Montar HTML final', C.CONSTRUTOR_HTML, [x, y]);
    wf.add('HTML → arquivo', 'n8n-nodes-base.convertToFile', 1.1, { operation: 'toText', sourceProperty: 'html', options: { fileName: 'index.html' } }, [x + 220, y]);
    wf.add('Gravar index.html', 'n8n-nodes-base.readWriteFile', 1, { operation: 'write', fileName: "={{ $('Montar HTML final').first().json.arquivo }}", dataPropertyName: 'data', options: {} }, [x + 440, y], { onError: 'continueRegularOutput' });
    http(wf, 'Página publicada · baixar', [x + 660, y], { url: "{{ $('Entrada').first().json.config.url_pagina_publicada || 'http://invalid.local' }}", texto: true, full: true });
    http(wf, 'Pixel · último disparo', [x + 880, y], { url: "https://graph.facebook.com/{{ $('Entrada').first().json.config.graph_version }}/{{ $('Entrada').first().json.config.pixel_id }}", cred: 'meta', qsJson: "{{ JSON.stringify({ fields: 'name,last_fired_time,is_unavailable' }) }}" });
    code(wf, 'Conferência do PageView', C.CONSTRUTOR_PAGEVIEW, [x + 1100, y]);
    wf.link('Montar HTML final', 'HTML → arquivo'); wf.link('HTML → arquivo', 'Gravar index.html');
    wf.link('Gravar index.html', 'Página publicada · baixar'); wf.link('Página publicada · baixar', 'Pixel · último disparo');
    wf.link('Pixel · último disparo', 'Conferência do PageView');
    return { primeiro: 'Montar HTML final', ultimo: 'Conferência do PageView', xFim: x + 1320 };
  });
  return wf;
}

function wfFunil() {
  const wf = new WF(PREFIXO + '04 Funil (Hotmart)');
  const ok = abertura(wf, 'funil', `if (!String(cfg.preco_aprovado || '').trim()) faltando.push('preco_aprovado (o dono aprova o preço)');
if (!(estado.construtor && estado.construtor.saida && estado.construtor.saida.html)) faltando.push('página do Construtor');
if (!cfg.hotmart_checkout_url) faltando.push('hotmart_checkout_url');
if (!cfg.hotmart_product_id) faltando.push('hotmart_product_id');`);
  http(wf, 'Hotmart · token', [660, 300], { method: 'POST', url: 'https://api-sec-vlc.hotmart.com/security/oauth/token?grant_type=client_credentials', cred: 'hotmart' });
  http(wf, 'Hotmart · produtos', [880, 300], { url: 'https://developers.hotmart.com/products/api/v1/products', headers: [['Authorization', "=Bearer {{ $json.access_token }}"]] });
  http(wf, 'Checkout · conferir', [1100, 300], { url: "{{ $('Entrada').first().json.config.hotmart_checkout_url }}", texto: true, full: true });
  code(wf, 'Dados da etapa', C.FUNIL_DADOS, [1320, 300]);
  wf.link(ok, 'Hotmart · token', 0); wf.link('Hotmart · token', 'Hotmart · produtos'); wf.link('Hotmart · produtos', 'Checkout · conferir'); wf.link('Checkout · conferir', 'Dados da etapa');
  fechamento(wf, 'funil', 1540, (x, y) => {
    code(wf, 'Link do checkout nos botões', C.FUNIL_LINK, [x, y]);
    wf.add('HTML → arquivo', 'n8n-nodes-base.convertToFile', 1.1, { operation: 'toText', sourceProperty: 'html', options: { fileName: 'index.html' } }, [x + 220, y]);
    wf.add('Regravar index.html', 'n8n-nodes-base.readWriteFile', 1, { operation: 'write', fileName: "={{ $('Link do checkout nos botões').first().json.arquivo }}", dataPropertyName: 'data', options: {} }, [x + 440, y], { onError: 'continueRegularOutput' });
    code(wf, 'Conferência pós-agente', C.FUNIL_FIM, [x + 660, y]);
    wf.link('Link do checkout nos botões', 'HTML → arquivo'); wf.link('HTML → arquivo', 'Regravar index.html'); wf.link('Regravar index.html', 'Conferência pós-agente');
    return { primeiro: 'Link do checkout nos botões', ultimo: 'Conferência pós-agente', xFim: x + 880 };
  });
  return wf;
}

function wfClaquete() {
  const wf = new WF(PREFIXO + '05 Claquete (criativos)');
  const ok = abertura(wf, 'claquete', `if (cfg.copy_aprovada !== true) faltando.push('copy_aprovada = true (roteiros aprovados)');
if (!(estado.headline && estado.headline.saida)) faltando.push('roteiros do Headline Killer');
else if (!cfg.copy_aprovada_hash || estado.headline.saida_hash !== cfg.copy_aprovada_hash) faltando.push('copy_aprovada_hash igual à versão da copy (' + (estado.headline.saida_hash || 'sem versão') + ')');`);
  code(wf, 'Dados da etapa', C.CLAQUETE_DADOS, [660, 300]);
  wf.link(ok, 'Dados da etapa', 0);
  fechamento(wf, 'claquete', 880, (x, y) => {
    code(wf, 'Imagens → itens', C.CLAQUETE_ITENS, [x, y]);
    http(wf, 'xAI · gerar imagem', [x + 220, y], { method: 'POST', url: 'https://api.x.ai/v1/images/generations', cred: 'xai',
      bodyJson: "{{ JSON.stringify({ model: $('Entrada').first().json.config.modelo_imagem || 'grok-2-image', prompt: $json.prompt, n: 1, response_format: 'url' }) }}" });
    code(wf, 'Conferência pós-agente', C.CLAQUETE_POS, [x + 440, y]);
    wf.link('Imagens → itens', 'xAI · gerar imagem'); wf.link('xAI · gerar imagem', 'Conferência pós-agente');
    sticky(wf, 'Vídeos', '### Vídeos\nA Claquete devolve o plano de cada vídeo (cenas, texto na tela, locução). Para renderizar, ligue aqui o gerador de vídeo que preferir (fal.ai, Higgsfield ou o estúdio de vídeo local) com os campos de `saida.plano.videos`.', [x + 180, y + 220], 380, 200, 6);
    return { primeiro: 'Imagens → itens', ultimo: 'Conferência pós-agente', xFim: x + 660 };
  });
  return wf;
}

function wfRevisor() {
  const wf = new WF(PREFIXO + '06 Revisor');
  const ok = abertura(wf, 'revisor', `if (!cfg.url_pagina_publicada) faltando.push('url_pagina_publicada');
if (!cfg.hotmart_checkout_url) faltando.push('hotmart_checkout_url');
if (!cfg.pixel_id) faltando.push('pixel_id');`);
  http(wf, 'Revisor · página no ar', [660, 300], { url: "{{ $('Entrada').first().json.config.url_pagina_publicada }}", texto: true, full: true });
  http(wf, 'Revisor · checkout', [880, 300], { url: "{{ $('Entrada').first().json.config.hotmart_checkout_url }}", texto: true, full: true });
  http(wf, 'Revisor · pixel', [1100, 300], { url: "https://graph.facebook.com/{{ $('Entrada').first().json.config.graph_version }}/{{ $('Entrada').first().json.config.pixel_id }}", cred: 'meta', qsJson: "{{ JSON.stringify({ fields: 'name,last_fired_time' }) }}" });
  code(wf, 'Dados da etapa', C.REVISOR_DADOS, [1320, 300]);
  wf.link(ok, 'Revisor · página no ar', 0); wf.link('Revisor · página no ar', 'Revisor · checkout'); wf.link('Revisor · checkout', 'Revisor · pixel'); wf.link('Revisor · pixel', 'Dados da etapa');
  fechamento(wf, 'revisor', 1540, posSimples(wf, 'Conferência pós-agente', C.REVISOR_POS));
  return wf;
}

function wfTrafego() {
  const wf = new WF(PREFIXO + '07 Tráfego (gestor, sempre PAUSADO)');
  const ok = abertura(wf, 'trafego', `if (!(estado.revisor && estado.revisor.aprovado === true && !estado.revisor.de_rodada_anterior)) faltando.push('aprovação do Revisor nesta rodada');
if (!/^act_\\d+$/.test(String(cfg.ad_account_id || ''))) faltando.push('ad_account_id no formato act_123');
if (!cfg.pixel_id) faltando.push('pixel_id');
if (!(Number(cfg.orcamento_diario_centavos) > 0)) faltando.push('orcamento_diario_centavos');`);
  code(wf, 'Dados da etapa', C.TRAFEGO_DADOS, [660, 300]);
  wf.link(ok, 'Dados da etapa', 0);
  const g = "https://graph.facebook.com/{{ $('Entrada').first().json.config.graph_version }}";
  fechamento(wf, 'trafego', 880, (x, y) => {
    code(wf, 'Payload PAUSADO', C.TRAFEGO_PAYLOAD, [x, y - 200]);
    // Idempotência: procura a campanha pelo nome antes de criar
    http(wf, 'Meta · buscar campanha', [x, y], { url: g + "/{{ $('Entrada').first().json.config.ad_account_id }}/campaigns", cred: 'meta',
      qsJson: "{{ JSON.stringify({ fields: 'id,name,status,effective_status', filtering: JSON.stringify([{ field: 'name', operator: 'EQUAL', value: $json.campanha.name }]), limit: 50 }) }}" });
    ifTrue(wf, 'Campanha já existe?', '{{ Array.isArray($json.data) && $json.data.length > 0 }}', [x + 110, y + 150]);
    http(wf, 'Meta · conjuntos existentes', [x + 330, y + 400], { url: g + "/{{ $json.data[0].id }}/adsets", cred: 'meta', qsJson: "{{ JSON.stringify({ fields: 'id,name,status,effective_status', limit: 100 }) }}" });
    code(wf, 'Reusar campanha', C.TRAFEGO_REUSAR, [x + 550, y + 400]);
    http(wf, 'Meta · conferir status (existente)', [x + 770, y + 400], { url: g + '/{{ $json.id }}', cred: 'meta', qsJson: "{{ JSON.stringify({ fields: 'id,name,status,effective_status' }) }}" });
    http(wf, 'Meta · criar campanha (PAUSED)', [x + 220, y], { method: 'POST', url: g + "/{{ $('Entrada').first().json.config.ad_account_id }}/campaigns", cred: 'meta',
      bodyJson: "{{ JSON.stringify(Object.assign({}, $('Payload PAUSADO').first().json.campanha, { status: 'PAUSED' })) }}" });
    code(wf, 'Conjuntos → itens', C.TRAFEGO_CONJUNTOS, [x + 440, y]);
    http(wf, 'Meta · criar conjunto (PAUSED)', [x + 660, y], { method: 'POST', url: g + "/{{ $('Entrada').first().json.config.ad_account_id }}/adsets", cred: 'meta',
      bodyJson: "{{ JSON.stringify(Object.assign({}, $json.body, { status: 'PAUSED' })) }}" });
    code(wf, 'IDs criados', C.TRAFEGO_IDS, [x + 880, y]);
    http(wf, 'Meta · reforçar PAUSED', [x + 1100, y], { method: 'POST', url: g + '/{{ $json.id }}', cred: 'meta', bodyJson: "{{ JSON.stringify({ status: 'PAUSED' }) }}" });
    http(wf, 'Meta · conferir status', [x + 1320, y], { url: g + "/{{ $('IDs criados').all()[$itemIndex].json.id }}", cred: 'meta', qsJson: "{{ JSON.stringify({ fields: 'id,name,status,effective_status' }) }}" });
    code(wf, 'Conferência PAUSADO', C.TRAFEGO_POS, [x + 1540, y]);
    wf.link('Payload PAUSADO', 'Meta · buscar campanha'); wf.link('Meta · buscar campanha', 'Campanha já existe?');
    wf.link('Campanha já existe?', 'Meta · conjuntos existentes', 0); wf.link('Meta · conjuntos existentes', 'Reusar campanha');
    wf.link('Reusar campanha', 'Meta · conferir status (existente)'); wf.link('Meta · conferir status (existente)', 'Conferência PAUSADO');
    wf.link('Campanha já existe?', 'Meta · criar campanha (PAUSED)', 1); wf.link('Meta · criar campanha (PAUSED)', 'Conjuntos → itens');
    wf.link('Conjuntos → itens', 'Meta · criar conjunto (PAUSED)'); wf.link('Meta · criar conjunto (PAUSED)', 'IDs criados');
    wf.link('IDs criados', 'Meta · reforçar PAUSED'); wf.link('Meta · reforçar PAUSED', 'Meta · conferir status'); wf.link('Meta · conferir status', 'Conferência PAUSADO');
    sticky(wf, 'Trava PAUSADO', '### Nunca ativa nada\n1. O nó **Payload PAUSADO** quebra a execução se qualquer status for diferente de PAUSED.\n2. Os nós de criação forçam `status: PAUSED` no corpo.\n3. **Reforçar PAUSED** manda PAUSED de novo para cada ID criado.\n4. **Conferir status** lê da API e a etapa só aprova se tudo estiver pausado.\n5. **Buscar campanha** procura pelo nome antes de criar: se já existe, reutiliza e não mexe em nada (sem duplicar).\nQuem ativa é sempre o dono, no Gerenciador de Anúncios.', [x + 200, y - 300], 520, 240, 3);
    return { primeiro: 'Payload PAUSADO', ultimo: 'Conferência PAUSADO', xFim: x + 1760 };
  });
  return wf;
}

// ---------- Coordenador ----------
const ORDEM = [['radar', '01'], ['headline', '02'], ['construtor', '03'], ['funil', '04'], ['claquete', '05'], ['revisor', '06'], ['trafego', '07']];

function wfCoordenador(ids) {
  const wf = new WF(PREFIXO + '00 Coordenador (GROK BOT)');
  wf.add('Iniciar rodada', 'n8n-nodes-base.manualTrigger', 1, {}, [0, 300]);
  code(wf, '⚙️ Configuração', C.CONFIG_PADRAO, [220, 300]);
  // Estado entre rodadas: <pasta_saida>\<slug>\estado.json (se não existir, começa vazio)
  code(wf, 'Arquivo de estado', C.COORD_ARQUIVO_ESTADO, [220, 520]);
  wf.add('Estado salvo · ler', 'n8n-nodes-base.readWriteFile', 1, { operation: 'read', fileSelector: '={{ $json.arquivo_estado }}', options: {} }, [440, 520], { onError: 'continueRegularOutput', alwaysOutputData: true });
  wf.add('Estado salvo · extrair', 'n8n-nodes-base.extractFromFile', 1, { operation: 'fromJson', binaryPropertyName: 'data', options: {} }, [660, 520], { onError: 'continueRegularOutput', alwaysOutputData: true });
  grokModel(wf, 'Grok (xAI)', [920, 560]);
  agente(wf, 'Coordenador · plano', COORDENADOR_PLANO, "{{ 'CONFIGURAÇÃO DA RODADA:\\n' + JSON.stringify($('⚙️ Configuração').first().json) }}", [880, 300], 'continueRegularOutput');
  wf.link('Grok (xAI)', 'Coordenador · plano', 0, 'ai_languageModel');
  code(wf, 'Estado inicial', C.COORD_ESTADO_INICIAL, [1100, 300]);
  wf.link('Iniciar rodada', '⚙️ Configuração'); wf.link('⚙️ Configuração', 'Arquivo de estado'); wf.link('Arquivo de estado', 'Estado salvo · ler');
  wf.link('Estado salvo · ler', 'Estado salvo · extrair'); wf.link('Estado salvo · extrair', 'Coordenador · plano'); wf.link('Coordenador · plano', 'Estado inicial');
  sticky(wf, 'Como usar', `## Time Direct Response — Coordenador (GROK BOT)\n1. Cole as chaves nas credenciais **DR · xAI Grok**, **DR · Meta (token de sistema)** e **DR · Hotmart**.\n2. Edite **⚙️ Configuração** (país, oferta, aprovações, pixel, conta de anúncios).\n3. Clique em **Execute workflow**.\n\nCada etapa chama um sub-workflow: integração → GROK BOT orienta → agente → verificações → GROK BOT supervisiona. Se uma etapa não for aprovada, o fluxo para e o relatório numerado diz o que falta.\n\n**Campanhas: sempre PAUSADAS.** Nada é ativado por este fluxo.`, [-60, -60], 640, 320, 4);

  let prev = 'Estado inicial', x = 1340;
  const falsos = [];
  for (const [k, n] of ORDEM) {
    const a = AGENTES[k];
    const exec = `${n} · ${a.nome}`;
    wf.add(exec, 'n8n-nodes-base.executeWorkflow', 1.2, {
      source: 'database',
      workflowId: { __rl: true, value: ids[k], mode: 'id' },
      options: { waitForSubWorkflow: true }
    }, [x, 300]);
    const est = `Estado · ${a.nome}`;
    code(wf, est, sub(C.COORD_ESTADO, { __PREV__: prev, __ETAPA__: k }), [x + 220, 300]);
    const gate = `${a.nome} liberou?`;
    ifTrue(wf, gate, `{{ $json.estado['${k}'].seguir }}`, [x + 440, 300]);
    wf.link(prev === 'Estado inicial' ? 'Estado inicial' : prev, exec, prev.endsWith('liberou?') ? 0 : 0);
    wf.link(exec, est); wf.link(est, gate);
    falsos.push(gate);
    prev = gate; x += 700;
  }
  // corrige: a entrada de cada exec é a saída "true" do gate anterior (já ligada acima com out 0)
  code(wf, 'Prazos e resumo', C.COORD_PRAZOS, [x, 600]);
  for (const g of falsos) wf.link(g, 'Prazos e resumo', 1);
  wf.link(prev, 'Prazos e resumo', 0);
  grokModel(wf, 'Grok (xAI) relatório', [x + 260, 860]);
  agente(wf, 'Coordenador · relatório', COORDENADOR_RELATORIO,
    "{{ 'PRAZOS E STATUS:\\n' + JSON.stringify($json.prazos) + '\\n\\nRESUMO POR ETAPA:\\n' + JSON.stringify($json.resumo).slice(0, 30000) + '\\n\\nPLANO DO INÍCIO DA RODADA:\\n' + ($json.estado.plano_do_coordenador || '') }}",
    [x + 220, 600], 'continueRegularOutput');
  wf.link('Grok (xAI) relatório', 'Coordenador · relatório', 0, 'ai_languageModel');
  wf.link('Prazos e resumo', 'Coordenador · relatório');
  code(wf, 'Progresso (lista numerada)', C.COORD_PROGRESSO, [x + 520, 600]);
  wf.link('Coordenador · relatório', 'Progresso (lista numerada)');
  code(wf, 'Estado → salvar', C.COORD_SALVAR, [x + 760, 820]);
  wf.add('Estado → arquivo', 'n8n-nodes-base.convertToFile', 1.1, { operation: 'toText', sourceProperty: 'texto', options: { fileName: 'estado.json' } }, [x + 980, 820]);
  wf.add('Gravar estado.json', 'n8n-nodes-base.readWriteFile', 1, { operation: 'write', fileName: "={{ $('Estado → salvar').first().json.arquivo }}", dataPropertyName: 'data', options: {} }, [x + 1200, 820], { onError: 'continueRegularOutput' });
  wf.link('Progresso (lista numerada)', 'Estado → salvar'); wf.link('Estado → salvar', 'Estado → arquivo'); wf.link('Estado → arquivo', 'Gravar estado.json');
  wf.add('Enviar no Telegram (opcional)', 'n8n-nodes-base.telegram', 1.2, {
    chatId: 'COLE_AQUI_O_CHAT_ID', text: '={{ $json.progresso }}', additionalFields: { appendAttribution: false }
  }, [x + 760, 600], { disabled: true, credentials: { telegramApi: { id: 'HhIgeNHoT7zTSUiM', name: 'Telegram account' } } });
  wf.link('Progresso (lista numerada)', 'Enviar no Telegram (opcional)');
  return wf;
}

// ---------- 99 Erros ----------
function wfErros() {
  const wf = new WF(PREFIXO + '99 Erros');
  wf.add('Erro em workflow DR', 'n8n-nodes-base.errorTrigger', 1, {}, [0, 300]);
  code(wf, 'Montar alerta', C.ERROS_ALERTA.split('__PASTA__').join(PASTA_ERROS.replace(/\\/g, '\\\\')), [220, 300]);
  wf.add('Alerta → arquivo', 'n8n-nodes-base.convertToFile', 1.1, { operation: 'toText', sourceProperty: 'registro', options: { fileName: '={{ $json.nome_arquivo }}' } }, [440, 300]);
  wf.add('Gravar erro no disco', 'n8n-nodes-base.readWriteFile', 1, { operation: 'write', fileName: "={{ $('Montar alerta').first().json.arquivo }}", dataPropertyName: 'data', options: {} }, [660, 300], { onError: 'continueRegularOutput' });
  wf.add('Enviar alerta no Telegram (opcional)', 'n8n-nodes-base.telegram', 1.2, {
    chatId: 'COLE_AQUI_O_CHAT_ID', text: "={{ $('Montar alerta').first().json.texto }}", additionalFields: { appendAttribution: false }
  }, [880, 300], { disabled: true, credentials: { telegramApi: { id: 'HhIgeNHoT7zTSUiM', name: 'Telegram account' } } });
  wf.link('Erro em workflow DR', 'Montar alerta'); wf.link('Montar alerta', 'Alerta → arquivo'); wf.link('Alerta → arquivo', 'Gravar erro no disco'); wf.link('Gravar erro no disco', 'Enviar alerta no Telegram (opcional)');
  sticky(wf, 'Sobre os erros', '## 99 Erros\nRecebe o erro de qualquer workflow Direct Response (configurado como *Error workflow* em todos).\nGrava um arquivo por erro na pasta `erros` e, se ligado, avisa no Telegram (ative o nó e ponha o chat ID).\nNão guarda chave nem token: só workflow, nó, mensagem e link da execução.', [-40, -40], 520, 240, 3);
  return wf;
}

// ---------- publicar ----------
async function publicar(wf, existentes) {
  const corpo = wf.json();
  const ja = existentes.find(w => w.name === wf.name);
  let r;
  if (ja) { r = await api('PUT', '/workflows/' + ja.id, corpo); console.log('atualizado:', wf.name, ja.id); }
  else { r = await api('POST', '/workflows', corpo); console.log('criado:', wf.name, r.id); }
  return r.id;
}

async function main() {
  mkdirSync(join(RAIZ, 'workflows'), { recursive: true });
  if (!SO_JSON) {
    if (!KEY) throw new Error('Defina N8N_API_KEY');
    await garantirCredenciais();
  } else {
    for (const k of Object.keys(CREDS)) credRef[k] = { id: 'PREENCHER', name: CREDS[k].name };
  }
  const construir = { radar: wfRadar, headline: wfHeadline, construtor: wfConstrutor, funil: wfFunil, claquete: wfClaquete, revisor: wfRevisor, trafego: wfTrafego };
  const existentes = SO_JSON ? [] : await listarTudo('/workflows');
  const ids = {};
  // 99 Erros primeiro: os outros apontam para ele (settings.errorWorkflow)
  const erros = wfErros();
  writeFileSync(join(RAIZ, 'workflows', '99-erros.json'), JSON.stringify(erros.json(), null, 2));
  // No n8n 2.x o Error workflow precisa ter versão publicada (ativa); o gatilho de erro não dispara sozinho
  const idErros = SO_JSON ? 'ID_erros' : await publicar(erros, existentes);
  if (!SO_JSON) await api('POST', `/workflows/${idErros}/activate`);
  for (const [k, n] of ORDEM) {
    const wf = construir[k]();
    wf.errorWorkflow = idErros;
    writeFileSync(join(RAIZ, 'workflows', `${n}-${k}.json`), JSON.stringify(wf.json(), null, 2));
    ids[k] = SO_JSON ? 'ID_' + k : await publicar(wf, existentes);
    // No n8n 2.x o sub-workflow precisa estar publicado (ativo) para ser chamado.
    // Ele só tem o gatilho "Execute Workflow Trigger": ativar não dispara nada sozinho.
    if (!SO_JSON) await api('POST', `/workflows/${ids[k]}/activate`);
  }
  const coord = wfCoordenador(ids);
  coord.errorWorkflow = idErros;
  writeFileSync(join(RAIZ, 'workflows', '00-coordenador.json'), JSON.stringify(coord.json(), null, 2));
  if (SO_JSON) return console.log('JSON gerado em workflows/');
  ids.coordenador = await publicar(coord, existentes);
  ids.erros = idErros;

  // tag "Direct Response"
  const tags = await listarTudo('/tags');
  let tag = tags.find(t => t.name === TAG);
  if (!tag) tag = await api('POST', '/tags', { name: TAG });
  for (const id of Object.values(ids)) await api('PUT', `/workflows/${id}/tags`, [{ id: tag.id }]);
  writeFileSync(join(RAIZ, 'workflows', 'ids.json'), JSON.stringify(ids, null, 2));
  console.log('tag aplicada:', TAG, tag.id);
  console.log(JSON.stringify(ids, null, 2));
}

main().catch(e => { console.error(e); process.exit(1); });
