// Roda os nós Code mais críticos com dados simulados (sem n8n, sem rede).
import * as C from './codigos.mjs';
import assert from 'node:assert/strict';

function rodar(js, nodes, $json, inputAll, inputItens) {
  const $ = n => { if (!(n in nodes)) throw new Error('nó não simulado: ' + n); const v = nodes[n]; const arr = Array.isArray(v) ? v : [v]; return { isExecuted: true, first: () => ({ json: arr[0] }), all: () => arr.map(j => ({ json: j })) }; };
  const $input = { all: () => inputItens || (inputAll || [$json]).map(j => ({ json: j })), first: () => ({ json: (inputAll || [$json])[0] }) };
  return new Function('$', '$input', '$json', js)($, $input, $json);
}
const cfg = { pais_origem: 'BR', pais_destino: 'PT', nome_pais: 'Portugal', idioma: 'pt-PT', pixel_id: '123456789', pasta_saida: 'C:\\x\\data\\dr',
  oferta_escolhida: { nome: 'Pilates', slug: 'pilates50-pt' }, hotmart_checkout_url: 'https://pay.hotmart.com/ABC123', preco_aprovado: '14,90 €',
  url_pagina_publicada: 'https://exemplo.pt', ad_account_id: 'act_1', orcamento_diario_centavos: 1000, graph_version: 'v23.0',
  termos_busca: ['desafio pilates'], ofertas_br: [{ nome: 'P', page_id_br: '201' }] };

// 1. Construtor injeta pixel e UTM
const html0 = '<!doctype html><html lang="pt-PT"><head><title>x</title></head><body><a class="cta" href="{{CHECKOUT_URL}}">Quero</a> Preço 14,90 €</body></html>';
const [m] = rodar(C.CONSTRUTOR_HTML, { Entrada: { config: cfg } }, { output: JSON.stringify({ html: html0 }) });
assert.ok(m.json.verificacoes.pixel_injetado && m.json.verificacoes.pageview_injetado && m.json.verificacoes.utm_injetado, 'pixel/utm');
assert.equal(m.json.arquivo, 'C:\\x\\data\\dr\\pilates50-pt\\index.html');
console.log('construtor ok', m.json.verificacoes);

// 2. Funil troca o link
const [f] = rodar(C.FUNIL_LINK, { Entrada: { config: cfg, estado: { construtor: { saida: { html: m.json.html, arquivo: m.json.arquivo } } } } }, { output: '{"produto":{}}' });
assert.ok(f.json.verificacoes.botoes_com_link_do_checkout);
console.log('funil ok');

// 3. Revisor: checklist completo deve passar
const nodes = { Entrada: { config: cfg, estado: { claquete: { saida: { imagens_geradas: [{ url: 'https://img' }] } } } },
  'Revisor · página no ar': { statusCode: 200, body: f.json.html }, 'Revisor · checkout': { statusCode: 200, body: '' },
  'Revisor · pixel': { last_fired_time: new Date().toISOString() } };
const [r] = rodar(C.UTIL + C.REVISOR_DADOS.replace(C.UTIL, ''), nodes, {});
console.log('revisor checklist', r.json.verificacoes);
assert.ok(Object.values(r.json.verificacoes).every(Boolean), 'checklist deveria passar');
// com preço riscado deve reprovar
nodes['Revisor · página no ar'] = { statusCode: 200, body: f.json.html.replace('Preço', 'de €29 por') };
const [r2] = rodar(C.REVISOR_DADOS, nodes, {});
assert.equal(r2.json.verificacoes['5_preco_aprovado_e_sem_preco_riscado'], false);
console.log('revisor reprova preço riscado ok');

// 4. Tráfego: payload pausado e trava
const [t] = rodar(C.TRAFEGO_PAYLOAD, { Entrada: { config: cfg } }, { output: JSON.stringify({ campanha_nome: 'DR | x', conjuntos: [{ nome: 'a', idade_min: 50, idade_max: 65, generos: [2] }] }) });
assert.equal(t.json.campanha.status, 'PAUSED'); assert.equal(t.json.conjuntos[0].status, 'PAUSED');
assert.throws(() => rodar(C.TRAFEGO_PAYLOAD, { Entrada: { config: cfg } }, { output: JSON.stringify({ conjuntos: [{ nome: 'ACTIVE agora' }] }) }));
// nome da campanha não depende do modelo (idempotência)
const [t2] = rodar(C.TRAFEGO_PAYLOAD, { Entrada: { config: cfg } }, { output: JSON.stringify({ campanha_nome: 'outro nome qualquer' }) });
assert.equal(t2.json.campanha.name, t.json.campanha.name); assert.equal(t.json.campanha.name, 'DR | Pilates | PT');
assert.equal(rodar(C.TRAFEGO_PAYLOAD, { Entrada: { config: Object.assign({}, cfg, { campanha_nome: 'DR | fixo' }) } }, { output: '{}' })[0].json.campanha.name, 'DR | fixo');
console.log('tráfego trava ok');
const st = rodar(C.TRAFEGO_POS, { 'Payload PAUSADO': t.json, 'Meta · criar campanha (PAUSED)': { id: '1' }, 'Meta · criar conjunto (PAUSED)': [{ id: '2' }] }, {}, [{ id: '1', status: 'PAUSED', effective_status: 'PAUSED' }, { id: '2', status: 'PAUSED', effective_status: 'CAMPAIGN_PAUSED' }]);
assert.ok(st[0].json.verificacoes.tudo_pausado_conferido_na_api);
const st2 = rodar(C.TRAFEGO_POS, { 'Payload PAUSADO': t.json, 'Meta · criar campanha (PAUSED)': { id: '1' }, 'Meta · criar conjunto (PAUSED)': [{ id: '2' }] }, {}, [{ id: '1', status: 'ACTIVE', effective_status: 'ACTIVE' }]);
assert.equal(st2[0].json.verificacoes.tudo_pausado_conferido_na_api, false);
console.log('tráfego conferência ok');
// reutilização: campanha já existe -> não cria nada e lista os IDs existentes
const reuso = rodar(C.TRAFEGO_REUSAR, { 'Meta · buscar campanha': { data: [{ id: '77', name: 'DR | Pilates | PT' }] } }, { data: [{ id: '78' }, { id: '79' }] });
assert.deepEqual(reuso.map(i => i.json.id), ['77', '78', '79']);
const nosReuso = { 'Payload PAUSADO': t.json, 'Reusar campanha': reuso.map(i => i.json) };
const st3 = rodar(C.TRAFEGO_POS, nosReuso, {}, [{ id: '77', status: 'PAUSED' }, { id: '78', status: 'PAUSED' }, { id: '79', status: 'PAUSED' }]);
assert.ok(st3[0].json.saida.campanha.reutilizada && st3[0].json.verificacoes.tudo_pausado_conferido_na_api);
console.log('tráfego idempotência ok');

// 5. Radar
const itens = rodar(C.RADAR_ITENS, { Entrada: { config: cfg } }, {});
assert.equal(itens.length, 2);
const [d] = rodar(C.RADAR_DADOS, { Entrada: { config: cfg }, 'Consultas → itens': itens.map(i => i.json) }, {}, [
  { data: [{ id: '9', page_id: 'p1', page_name: 'Mova', ad_delivery_start_time: '2026-03-17' }], paging: { next: 'x' } }, { data: [] }]);
assert.equal(d.json.dados.consultas_destino[0].anuncios_ativos_carregados, 1);
assert.equal(d.json.dados.ofertas_br[0].anuncios_ativos_br, 'não verificado');
// paginação: 2 páginas da 1.ª consulta (pairedItem 0) + 1 da 2.ª
const [d2] = rodar(C.RADAR_DADOS, { Entrada: { config: cfg }, 'Consultas → itens': itens.map(i => i.json) }, {}, null, [
  { json: { data: [{ id: '1', page_id: 'a' }, { id: '2', page_id: 'a' }], paging: { next: 'x', cursors: { after: 'c' } } }, pairedItem: { item: 0 } },
  { json: { data: [{ id: '3', page_id: 'b' }] }, pairedItem: { item: 0 } },
  { json: { data: [{ id: '4', page_id: 'c' }] }, pairedItem: { item: 1 } }]);
assert.equal(d2.json.dados.consultas_destino[0].anuncios_ativos_carregados, 3);
assert.equal(d2.json.dados.consultas_destino[0].paginas_lidas, 2);
assert.equal(d2.json.dados.consultas_destino[0].contagem_e_minimo, false);
assert.equal(d2.json.dados.consultas_destino[1].anuncios_ativos_carregados, 1);
console.log('radar ok (com paginação)');

// 6. Headline pós (pt-PT sem "você")
const [h] = rodar(C.HEADLINE_POS, { Entrada: { config: cfg } }, { output: JSON.stringify({ headlines: Array(10).fill('Para si'), roteiros_video: Array(5).fill({}), briefings_imagem: Array(3).fill({}), pagina: [{ texto: 'você vai perder 3 kg' }] }) });
assert.equal(h.json.verificacoes.sem_voce_em_pt_pt, false); assert.equal(h.json.verificacoes.sem_claims_de_saude_ou_escassez, false);
console.log('headline ok');

// 7. Estado entre rodadas e copy congelada
const hk = { etapa: 'headline', aprovado: true, seguir: true, saida: { headlines: ['a'] }, saida_hash: 'v12345678' };
const salvo = { headline: hk, revisor: { aprovado: true, seguir: true } };
const [ei] = rodar(C.COORD_ESTADO_INICIAL, { '⚙️ Configuração': cfg, 'Estado salvo · extrair': { data: salvo }, 'Arquivo de estado': { arquivo_estado: 'C:\\x\\estado.json' } }, { output: 'plano' });
assert.ok(ei.json.estado.headline.de_rodada_anterior && ei.json.estado.revisor.de_rodada_anterior);
// sem arquivo salvo (primeira rodada): começa vazio
const [ei2] = rodar(C.COORD_ESTADO_INICIAL, { '⚙️ Configuração': cfg, 'Estado salvo · extrair': { error: { message: 'no such file' } }, 'Arquivo de estado': { arquivo_estado: 'x' } }, {});
assert.equal(ei2.json.estado.headline, undefined);
// headline pulada (congelada) mantém a entrega salva
const [ce] = rodar(C.COORD_ESTADO.split('__PREV__').join('Estado inicial').split('__ETAPA__').join('headline'), { 'Estado inicial': ei.json }, { etapa: 'headline', pulada: true, seguir: true, motivo: 'congelada' });
assert.equal(ce.json.estado.headline.saida_hash, 'v12345678'); assert.equal(ce.json.estado.headline.seguir, true);
// headline gerada de novo substitui
const [ce2] = rodar(C.COORD_ESTADO.split('__PREV__').join('Estado inicial').split('__ETAPA__').join('headline'), { 'Estado inicial': ei.json }, { etapa: 'headline', aprovado: true, saida_hash: 'vNOVA' });
assert.equal(ce2.json.estado.headline.saida_hash, 'vNOVA');
// hash estável e sensível a mudança
const hash = new Function(C.UTIL + '; return hashTexto;')();
assert.equal(hash('abc'), hash('abc')); assert.notEqual(hash('abc'), hash('abd')); assert.match(hash('x'), /^v[0-9a-f]{8}$/);
// Saída da etapa grava saida_hash
const [se] = rodar(C.SAIDA.split('__POS__').join('Pós').split('__ETAPA__').join('headline').split('__AGENTE__').join('HK'),
  { 'Dados da etapa': { verificacoes: { a: true } }, 'Pós': { saida: { x: 1 }, verificacoes: { b: true } }, 'Grok · briefing': { output: 'b' } }, { output: '{"aprovado":true}' });
assert.equal(se.json.saida_hash, hash(JSON.stringify({ x: 1 }))); assert.equal(se.json.aprovado, true);
// salvar não leva a marca de rodada anterior
const [sv] = rodar(C.COORD_SALVAR, { 'Prazos e resumo': { estado: ce.json.estado }, 'Estado inicial': ei.json }, {});
assert.ok(!JSON.parse(sv.json.texto).headline.de_rodada_anterior); assert.equal(sv.json.arquivo, 'C:\\x\\estado.json');
// progresso sem relatório do modelo ainda sai, e mostra a versão da copy
const [pg] = rodar(C.COORD_PROGRESSO, { 'Prazos e resumo': { config: cfg, estado: ce.json.estado, prazos: [{ n: 1, agente: 'Radar', status: 'aprovado' }] } }, {});
assert.match(pg.json.progresso, /1\. Radar: aprovado/); assert.match(pg.json.progresso, /v12345678/);
console.log('estado entre rodadas ok');

// 8. Falha do modelo e alerta de erro
const [fm] = rodar(C.FALHA_MODELO.split('__ETAPA__').join('radar').split('__AGENTE__').join('Radar'), {}, { error: { message: '401 invalid api key' } });
assert.equal(fm.json.aprovado, false); assert.equal(fm.json.seguir, false); assert.match(fm.json.motivo, /401/);
const [al] = rodar(C.ERROS_ALERTA.split('__PASTA__').join('C:\\\\erros'), {}, { execution: { id: '9', url: 'http://localhost:5678/execution/9', lastNodeExecuted: 'Payload PAUSADO', error: { message: 'Trava do Tráfego' } }, workflow: { id: 'w', name: 'Direct Response · 07 Tráfego' } });
assert.match(al.json.texto, /Trava do Tráfego/); assert.ok(al.json.arquivo.startsWith('C:\\erros\\erro-'));
console.log('erros ok');
console.log('TODOS OS TESTES PASSARAM');
