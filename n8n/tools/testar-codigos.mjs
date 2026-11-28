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
  url_pagina_publicada: 'https://exemplo.pt', ad_account_id: 'act_1', orcamento_diario_centavos: 1000, graph_version: 'v26.0', dsa_pagador: 'Empresa X', dsa_beneficiario: 'Empresa X',
  termos_busca: ['desafio pilates'], ofertas_br: [{ nome: 'P', page_id_br: '201' }], moeda: 'EUR', hotmart_product_id: '555',
  criativos_aprovados: true, criativos_aprovados_hash: 'vIMG', facebook_page_id: '1000', dominio_conversao: 'exemplo.pt' };

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
const nodes = { Entrada: { config: cfg, estado: { claquete: { saida_hash: 'vIMG', saida: { imagens_geradas: [{ arquivo: 'C:\\x\\img1.jpg' }] } } } },
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
// lacunas do G-06 (testes-revisor.md, seção 1A) agora reprovam
const revisa = (html, extraCfg) => { const n = JSON.parse(JSON.stringify(nodes)); n['Revisor · página no ar'] = { statusCode: 200, body: html }; if (extraCfg) n.Entrada.config = Object.assign({}, cfg, extraCfg); return rodar(C.REVISOR_DADOS, n, {})[0].json.verificacoes; };
assert.equal(revisa(f.json.html.replace('lang="pt-PT"', 'lang="pt-BR"'))['6_idioma_do_destino'], false);
assert.equal(revisa(f.json.html.replace('Preço 14,90 €', 'Preço de 29,90 € por 14,90 €'))['5_preco_aprovado_e_sem_preco_riscado'], false);
assert.equal(revisa(f.json.html.replace('Preço 14,90 €', 'Preço 114,90 €'))['5_preco_aprovado_e_sem_preco_riscado'], false);
assert.equal(revisa(f.json.html.replace('Preço 14,90 €', 'Preço 14,90 € [ESPAÇO PARA PROVA REAL]'))['8_sem_marcadores_pendentes'], false);
assert.equal(revisa(f.json.html.replace('</body>', '<a class="cta" href="https://outro.invalid/x">Comprar</a></body>'))['4_links_de_checkout_certos_e_no_ar'], false);
assert.ok(Object.values(revisa(f.json.html)).every(Boolean), 'página certa continua passando');
// criativos sem aprovação, ou aprovação de outra versão, reprovam o item 7
assert.equal(revisa(f.json.html, { criativos_aprovados: false })['7_criativos_prontos_e_aprovados'], false);
assert.equal(revisa(f.json.html, { criativos_aprovados_hash: 'vOUTRA' })['7_criativos_prontos_e_aprovados'], false);
console.log('revisor lacunas do G-06 ok');

// 4. Tráfego: payload pausado e trava
const [t] = rodar(C.TRAFEGO_PAYLOAD, { Entrada: { config: cfg } }, { output: JSON.stringify({ campanha_nome: 'DR | x', conjuntos: [{ nome: 'a', idade_min: 50, idade_max: 65, generos: [2] }] }) });
assert.equal(t.json.campanha.status, 'PAUSED'); assert.equal(t.json.conjuntos[0].status, 'PAUSED');
assert.equal(t.json.conjuntos[0].dsa_payor, 'Empresa X'); assert.equal(t.json.conjuntos[0].dsa_beneficiary, 'Empresa X');
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
// a busca compara o nome no código: outra campanha da conta não é reaproveitada
const nosBusca = { 'Payload PAUSADO': t.json };
assert.equal(rodar(C.TRAFEGO_EXISTENTE, nosBusca, { data: [{ id: '5', name: 'Outra campanha' }] })[0].json.existe, false);
const [ex] = rodar(C.TRAFEGO_EXISTENTE, nosBusca, { data: [{ id: '5', name: 'Outra' }, { id: '77', name: 'DR | Pilates | PT' }] });
assert.equal(ex.json.existe, true); assert.equal(ex.json.campanha.id, '77');
assert.throws(() => rodar(C.TRAFEGO_EXISTENTE, nosBusca, { error: { message: 'Invalid parameter' } }));
assert.throws(() => rodar(C.TRAFEGO_EXISTENTE, nosBusca, { data: [{ id: '5', name: 'Outra' }], paging: { next: 'x' } }));
const reuso = rodar(C.TRAFEGO_REUSAR, { 'Campanha existente': ex.json }, { data: [{ id: '78' }, { id: '79' }] });
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
// removido_por_risco cita o que foi tirado e não reprova a copy (falso positivo do G-06)
const [h2] = rodar(C.HEADLINE_POS, { Entrada: { config: cfg } }, { output: JSON.stringify({ headlines: Array(10).fill('Para si'), roteiros_video: Array(5).fill({}), briefings_imagem: Array(3).fill({}), pagina: [{ texto: 'Aulas suaves em casa' }], removido_por_risco: ['antes e depois', 'últimas vagas'] }) });
assert.equal(h2.json.verificacoes.sem_claims_de_saude_ou_escassez, true);
const claims = new Function(C.UTIL + '; return CLAIMS_SAUDE;')();
for (const f of ['Perca 10 kg em 1 semana', 'perda de 10 kg', 'Elimine 5 quilos', 'Cure as suas dores', 'Só hoje', 'Últimas 10 vagas', 'Antes/depois']) assert.ok(claims.test(f), 'claims deveria pegar: ' + f);
for (const f of ['Procure um lugar calmo', 'Aulas de pilates suaves, em casa', 'Programa de 21 dias']) assert.ok(!claims.test(f), 'claims não deveria pegar: ' + f);
const riscado = new Function(C.UTIL + '; return PRECO_RISCADO;')();
for (const f of ['de 29,90 € por 14,90 €', 'de 29,90 por 14,90', 'de € 29,90 por']) assert.ok(riscado.test(f), 'riscado: ' + f);
for (const f of ['acesso de 12 meses por apenas 14,90 €', 'desafio de 21 dias para si']) assert.ok(!riscado.test(f), 'não é riscado: ' + f);
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

// 9. Claquete: base64 da xAI vira arquivo com versão no nome
const b64 = Buffer.from('imagem-falsa').toString('base64');
const nosCq = { Entrada: { config: cfg }, 'Imagens → itens': [{ id: 'img1', formato: '4:5', texto_na_imagem: 'Para si' }, { id: 'img2' }] };
const arqs = rodar(C.CLAQUETE_ARQUIVOS, nosCq, {}, [{ data: [{ b64_json: b64 }] }, { error: { message: 'limite' } }]);
assert.match(arqs[0].json.arquivo, /^C:\\x\\data\\dr\\pilates50-pt\\criativos\\img1-v[0-9a-f]{8}\.jpg$/);
assert.equal(arqs[0].binary.data.data, b64); assert.equal(arqs[1].json.arquivo, null); assert.match(arqs[1].json.erro, /limite/);
const [cp] = rodar(C.CLAQUETE_POS, { 'Agente · Claquete': { output: '{"imagens":[{"id":"img1"}],"videos":[{"id":"v"}]}' }, 'Imagens → arquivos': arqs.map(a => a.json) }, {}, [{ fileName: 'x' }, { error: { message: 'sem arquivo' } }]);
assert.equal(cp.json.verificacoes.imagens_geradas_e_gravadas, false);
const [cp2] = rodar(C.CLAQUETE_POS, { 'Agente · Claquete': { output: '{"imagens":[{"id":"img1"}],"videos":[{"id":"v"}]}' }, 'Imagens → arquivos': [arqs[0].json] }, {}, [{ fileName: 'x' }]);
assert.ok(cp2.json.verificacoes.imagens_geradas_e_gravadas); assert.equal(cp2.json.saida.pasta, 'C:\\x\\data\\dr\\pilates50-pt\\criativos');
console.log('claquete arquivos ok');

// 10. Netlify: URL vem da config ou do deploy
const semNetlify = rodar(C.URL_DA_PAGINA, { Entrada: { config: cfg } }, {})[0].json;
assert.equal(semNetlify.url, 'https://exemplo.pt'); assert.equal(semNetlify.netlify, null);
const cfgN = Object.assign({}, cfg, { url_pagina_publicada: '', netlify_site_id: 'site1' });
const comNetlify = rodar(C.URL_DA_PAGINA, { Entrada: { config: cfgN }, 'Netlify · publicar': { id: 'd1', state: 'uploaded', ssl_url: 'https://dr.netlify.app' }, 'Netlify · conferir deploy': { id: 'd1', state: 'ready', ssl_url: 'https://dr.netlify.app' } }, {})[0].json;
assert.equal(comNetlify.url, 'https://dr.netlify.app'); assert.ok(comNetlify.netlify.publicou); assert.equal(comNetlify.netlify.estado, 'ready');
const falhou = rodar(C.URL_DA_PAGINA, { Entrada: { config: cfgN }, 'Netlify · publicar': { error: { message: '401' } }, 'Netlify · conferir deploy': { error: {} } }, {})[0].json;
assert.equal(falhou.netlify.publicou, false); assert.equal(falhou.url, '');
const [pv] = rodar(C.CONSTRUTOR_PAGEVIEW, { Entrada: { config: cfgN }, 'Montar HTML final': m.json, 'URL da página': comNetlify, 'Página publicada · baixar': { statusCode: 200, body: m.json.html }, 'Pixel · último disparo': { last_fired_time: new Date().toISOString() } }, {});
assert.equal(pv.json.saida.url_publicada, 'https://dr.netlify.app'); assert.ok(pv.json.verificacoes.pagina_publicada_no_ar && pv.json.verificacoes.netlify_publicou);
assert.ok(Object.values(pv.json.verificacoes).filter(v => v === false).length <= 1, 'só botoes_marcados pode faltar');
// o Coordenador passa o endereço do Netlify para as etapas seguintes
const cEst = C.COORD_ESTADO.split('__PREV__').join('Estado inicial').split('__ETAPA__').join('construtor');
const [ce3] = rodar(cEst, { 'Estado inicial': { config: cfgN, estado: {} } }, { aprovado: true, saida: { url_publicada: 'https://dr.netlify.app' } });
assert.equal(ce3.json.config.url_pagina_publicada, 'https://dr.netlify.app');
const [ce4] = rodar(cEst, { 'Estado inicial': { config: cfg, estado: {} } }, { aprovado: true, saida: { url_publicada: 'https://dr.netlify.app' } });
assert.equal(ce4.json.config.url_pagina_publicada, 'https://exemplo.pt');
const [ei3] = rodar(C.COORD_ESTADO_INICIAL, { '⚙️ Configuração': cfgN, 'Estado salvo · extrair': { data: { construtor: { saida: { url_publicada: 'https://dr.netlify.app' } } } }, 'Arquivo de estado': { arquivo_estado: 'x' } }, {});
assert.equal(ei3.json.config.url_pagina_publicada, 'https://dr.netlify.app');
const [ff] = rodar(C.FUNIL_FIM, { 'Link do checkout nos botões': f.json, 'Regravar index.html': {}, 'Netlify · publicar': { id: 'd2' }, 'Netlify · conferir deploy': { id: 'd2', state: 'ready' } }, {});
assert.ok(ff.json.verificacoes.pagina_regravada_no_disco && ff.json.verificacoes.netlify_republicou_com_checkout);
const [ff2] = rodar(C.FUNIL_FIM, { 'Link do checkout nos botões': f.json, 'Regravar index.html': { error: { message: 'x' } } }, {});
assert.equal(ff2.json.verificacoes.pagina_regravada_no_disco, false); assert.equal('netlify_republicou_com_checkout' in ff2.json.verificacoes, false);
console.log('netlify ok');

// 11. Funil: preço e moeda pela oferta principal da Hotmart
const nosF = ofertas => ({ Entrada: { config: cfg }, 'Hotmart · token': { access_token: 't' }, 'Hotmart · produtos': { items: [{ id: 555, ucode: 'u-1', name: 'P' }] }, 'Hotmart · ofertas': { items: ofertas }, 'Checkout · conferir': { statusCode: 200, body: '' } });
const fd = o => rodar(C.FUNIL_DADOS, nosF(o), {})[0].json;
const okF = fd([{ code: 'a', is_main_offer: false, price: { value: 29.9, currency_code: 'EUR' } }, { code: 'b', is_main_offer: true, price: { value: 14.9, currency_code: 'EUR' }, payment_mode: 'UNIQUE_PAYMENT' }]);
assert.ok(Object.values(okF.verificacoes).every(Boolean), JSON.stringify(okF.verificacoes)); assert.equal(okF.dados.oferta_principal.codigo, 'b');
assert.equal(fd([{ is_main_offer: true, price: { value: 19.9, currency_code: 'EUR' } }]).verificacoes.preco_da_oferta_igual_ao_aprovado, false);
assert.equal(fd([{ is_main_offer: true, price: { value: 14.9, currency_code: 'BRL' } }]).verificacoes.moeda_da_oferta_igual_a_config, false);
assert.equal(fd([]).verificacoes.oferta_principal_encontrada, false);
assert.match(fd([{ is_main_offer: true, price: { value: 14.9, currency_code: 'EUR' }, payment_mode: 'SUBSCRIPTION' }]).avisos.pagamento_da_oferta, /não é pagamento único/);
console.log('funil ofertas ok');

// 12. Tráfego: anúncios PAUSADOS com headline aprovada
const estT = { headline: { saida: { headlines: ['Pilates suave para si', 'Em casa, ao seu ritmo'] } }, claquete: { saida_hash: 'vIMG', saida: { imagens_geradas: [{ id: 'img1', arquivo: 'C:\\a.jpg', versao: 'v1' }, { id: 'img2', arquivo: null }] } } };
const entT = { config: cfg, estado: estT };
const ca = rodar(C.TRAFEGO_CRIATIVOS_ARQUIVOS, { Entrada: entT }, {});
assert.equal(ca.length, 1); assert.equal(ca[0].json.arquivo, 'C:\\a.jpg');
const tP = Object.assign({}, t.json, { plano: { anuncios: [{ imagem_id: 'img1', headline_indice: 1 }] } });
const cr = rodar(C.TRAFEGO_CRIATIVOS, { Entrada: entT, 'Payload PAUSADO': tP, 'Criativos → arquivos': ca.map(i => i.json) }, {}, [{ images: { 'a.jpg': { hash: 'H1' } } }]);
assert.equal(cr.length, 1); const ls = cr[0].json.criativo.object_story_spec.link_data;
assert.equal(ls.image_hash, 'H1'); assert.equal(ls.message, 'Em casa, ao seu ritmo'); assert.equal(ls.link, 'https://exemplo.pt');
assert.equal(cr[0].json.criativo.object_story_spec.page_id, '1000');
const crFalha = rodar(C.TRAFEGO_CRIATIVOS, { Entrada: entT, 'Payload PAUSADO': tP, 'Criativos → arquivos': ca.map(i => i.json) }, {}, [{ error: { message: 'token' } }]);
assert.ok(crFalha[0].json.sem_criativos);
const estRuim = JSON.parse(JSON.stringify(estT)); estRuim.headline.saida.headlines = ['Perca 10 kg já'];
assert.throws(() => rodar(C.TRAFEGO_CRIATIVOS, { Entrada: { config: cfg, estado: estRuim }, 'Payload PAUSADO': tP, 'Criativos → arquivos': ca.map(i => i.json) }, {}, [{ images: { a: { hash: 'H1' } } }]));
const an = rodar(C.TRAFEGO_ANUNCIOS, { Entrada: entT, 'Payload PAUSADO': tP, 'Meta · criar conjunto (PAUSED)': [{ id: 's1' }, { id: 's2' }], 'Anúncios → criativos': cr.map(i => i.json) }, {}, [{ id: 'c1' }]);
assert.equal(an.length, 2); assert.ok(an.every(a => a.json.body.status === 'PAUSED' && a.json.body.creative.creative_id === 'c1'));
assert.equal(an[1].json.body.adset_id, 's2'); assert.equal(an[0].json.body.conversion_domain, 'exemplo.pt');
const idsT = rodar(C.TRAFEGO_IDS, { 'Meta · criar campanha (PAUSED)': { id: '1' }, 'Meta · criar conjunto (PAUSED)': [{ id: 's1' }, { id: 's2' }], 'Meta · criar anúncio (PAUSED)': [{ id: 'a1' }, { id: 'a2' }] }, {});
assert.deepEqual(idsT.map(i => i.json.tipo), ['campanha', 'conjunto', 'conjunto', 'anuncio', 'anuncio']);
const nosPos = { 'Payload PAUSADO': t.json, 'Meta · criar campanha (PAUSED)': { id: '1' }, 'Meta · criar conjunto (PAUSED)': [{ id: 's1' }], 'Meta · criar anúncio (PAUSED)': [{ id: 'a1' }] };
const stA = rodar(C.TRAFEGO_POS, nosPos, {}, [{ id: '1', status: 'PAUSED', effective_status: 'PAUSED' }, { id: 's1', status: 'PAUSED', effective_status: 'CAMPAIGN_PAUSED' }, { id: 'a1', status: 'PAUSED', effective_status: 'PENDING_REVIEW' }]);
assert.ok(stA[0].json.verificacoes.tudo_pausado_conferido_na_api && stA[0].json.verificacoes.anuncios_criados);
const stB = rodar(C.TRAFEGO_POS, nosPos, {}, [{ id: 'a1', status: 'PAUSED', effective_status: 'ACTIVE' }]);
assert.equal(stB[0].json.verificacoes.tudo_pausado_conferido_na_api, false);
const stC = rodar(C.TRAFEGO_POS, Object.assign({}, nosPos, { 'Meta · criar anúncio (PAUSED)': [{ error: { message: 'x' } }] }), {}, [{ id: '1', status: 'PAUSED' }]);
assert.equal(stC[0].json.verificacoes.anuncios_criados, false);
console.log('tráfego anúncios ok');
console.log('TODOS OS TESTES PASSARAM');
