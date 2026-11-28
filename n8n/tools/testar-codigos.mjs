// Roda os nós Code mais críticos com dados simulados (sem n8n, sem rede).
import * as C from './codigos.mjs';
import assert from 'node:assert/strict';

function rodar(js, nodes, $json, inputAll) {
  const $ = n => { if (!(n in nodes)) throw new Error('nó não simulado: ' + n); const v = nodes[n]; const arr = Array.isArray(v) ? v : [v]; return { first: () => ({ json: arr[0] }), all: () => arr.map(j => ({ json: j })) }; };
  const $input = { all: () => (inputAll || [$json]).map(j => ({ json: j })) };
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
assert.throws(() => rodar(C.TRAFEGO_PAYLOAD, { Entrada: { config: cfg } }, { output: JSON.stringify({ campanha_nome: 'ACTIVE agora' }) }));
console.log('tráfego trava ok');
const st = rodar(C.TRAFEGO_POS, { 'Payload PAUSADO': t.json, 'Meta · criar campanha (PAUSED)': { id: '1' }, 'Meta · criar conjunto (PAUSED)': [{ id: '2' }] }, {}, [{ id: '1', status: 'PAUSED', effective_status: 'PAUSED' }, { id: '2', status: 'PAUSED', effective_status: 'CAMPAIGN_PAUSED' }]);
assert.ok(st[0].json.verificacoes.tudo_pausado_conferido_na_api);
const st2 = rodar(C.TRAFEGO_POS, { 'Payload PAUSADO': t.json, 'Meta · criar campanha (PAUSED)': { id: '1' }, 'Meta · criar conjunto (PAUSED)': [{ id: '2' }] }, {}, [{ id: '1', status: 'ACTIVE', effective_status: 'ACTIVE' }]);
assert.equal(st2[0].json.verificacoes.tudo_pausado_conferido_na_api, false);
console.log('tráfego conferência ok');

// 5. Radar
const itens = rodar(C.RADAR_ITENS, { Entrada: { config: cfg } }, {});
assert.equal(itens.length, 2);
const [d] = rodar(C.RADAR_DADOS, { Entrada: { config: cfg }, 'Consultas → itens': itens.map(i => i.json) }, {}, [
  { data: [{ id: '9', page_id: 'p1', page_name: 'Mova', ad_delivery_start_time: '2026-03-17' }], paging: { next: 'x' } }, { data: [] }]);
assert.equal(d.json.dados.consultas_destino[0].anuncios_ativos_carregados, 1);
assert.equal(d.json.dados.ofertas_br[0].anuncios_ativos_br, 'não verificado');
console.log('radar ok');

// 6. Headline pós (pt-PT sem "você")
const [h] = rodar(C.HEADLINE_POS, { Entrada: { config: cfg } }, { output: JSON.stringify({ headlines: Array(10).fill('Para si'), roteiros_video: Array(5).fill({}), briefings_imagem: Array(3).fill({}), pagina: [{ texto: 'você vai perder 3 kg' }] }) });
assert.equal(h.json.verificacoes.sem_voce_em_pt_pt, false); assert.equal(h.json.verificacoes.sem_claims_de_saude_ou_escassez, false);
console.log('headline ok');
console.log('TODOS OS TESTES PASSARAM');
