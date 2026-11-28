// Simulação LOCAL (sem n8n, sem rede, sem credencial) dos testes de plano/rascunhos/testes-revisor.md.
// Roda os mesmos corpos de nós Code de n8n/tools/codigos.mjs com dados fictícios e imprime o que o código responde.
// Uso (da raiz do repositório): node plano/rascunhos/simular-revisor.mjs
// Só leitura: não grava arquivo, não chama a Meta nem a Hotmart. Valores fictícios (PIXEL_DE_TESTE, domínios .invalid).
import * as C from '../../n8n/tools/codigos.mjs';

function rodar(js, nodes, $json, itens) {
  const $ = n => {
    if (!(n in nodes)) throw new Error('nó não simulado: ' + n);
    const v = nodes[n]; const arr = Array.isArray(v) ? v : [v];
    return { isExecuted: true, first: () => ({ json: arr[0] }), all: () => arr.map(j => ({ json: j })) };
  };
  const $input = { all: () => (itens || [$json]).map(j => ({ json: j })), first: () => ({ json: (itens || [$json])[0] }) };
  return new Function('$', '$input', '$json', js)($, $input, $json);
}

const cfg = { idioma: 'pt-PT', pixel_id: 'PIXEL_DE_TESTE', hotmart_checkout_url: 'https://pay.exemplo.invalid/ABC',
  preco_aprovado: '14,90 €', url_pagina_publicada: 'https://loja.invalid', pais_destino: 'PT', orcamento_diario_centavos: 1000,
  oferta_escolhida: { nome: 'Oferta de teste', slug: 'oferta-teste' }, pasta_saida: 'C:\\teste' };
const base = () => `<!doctype html><html lang="pt-PT"><head><script>fbq('init', 'PIXEL_DE_TESTE');fbq('track', 'PageView');</script></head><body><p>Por apenas 14,90 € para si.</p><a class="cta" href="https://pay.exemplo.invalid/ABC">Quero</a></body></html>`;

const linhas = [];
function revisor(id, descricao, o = {}) {
  const nodes = {
    Entrada: { config: Object.assign({}, cfg, o.cfg || {}), estado: { claquete: { saida: { imagens_geradas: o.imgs ?? [{ url: 'https://img.invalid/1.png' }] } } } },
    'Revisor · página no ar': { statusCode: o.status ?? 200, body: o.html ?? base() },
    'Revisor · checkout': { statusCode: o.chk ?? 200, body: '' },
    'Revisor · pixel': o.px ?? { last_fired_time: '2026-11-27T10:00:00Z' }
  };
  const r = rodar(C.REVISOR_DADOS, nodes, {});
  const v = r[0].json.verificacoes;
  const falsos = Object.entries(v).filter(([, x]) => !x).map(([k]) => k.split('_')[0]);
  linhas.push([id, descricao, falsos.length ? 'REPROVA (itens ' + falsos.join(', ') + ')' : 'PASSA']);
}
const troca = (a, b) => base().replace(a, b);
const sem = a => base().replace(a, '');

revisor('controle', 'caso limpo');
revisor('1.1', 'página devolve 404', { status: 404 });
revisor('2.1', 'um caractere do ID do pixel trocado', { html: troca('PIXEL_DE_TESTE', 'PIXEL_DE_TESTX') });
revisor('2.3', 'sem fbq PageView', { html: sem("fbq('track', 'PageView');") });
revisor('2.4', "PageView só dentro de comentário HTML", { html: sem("fbq('track', 'PageView');").replace('</body>', "<!-- fbq('track', 'PageView') --></body>") });
revisor('3.1', 'pixel sem last_fired_time', { px: {} });
revisor('3.4', 'pixel disparou em 2025-01-01', { px: { last_fired_time: '2025-01-01T00:00:00Z' } });
revisor('4.1', 'um botão com outra base de checkout', { html: troca('ABC"', 'XYZ"') });
revisor('4.2', 'sobra {{CHECKOUT_URL}}', { html: troca('</body>', '<a class="cta" href="{{CHECKOUT_URL}}">x</a></body>') });
revisor('4.4', 'checkout responde 404', { chk: 404 });
revisor('4.7', 'link sem utm nem xcod (só ?foo=1)', { html: troca('ABC"', 'ABC?foo=1"') });
revisor('4.9', 'segundo botão para domínio sem "hotmart", "pay." nem "checkout"', { html: troca('</body>', '<a class="cta" href="https://loja-outra.invalid/comprar">x</a></body>') });
revisor('4.10', 'segundo botão para /checkout/ de outro domínio', { html: troca('</body>', '<a class="cta" href="https://outra.invalid/checkout/1">x</a></body>') });
revisor('5.1', 'preço 12,90 em vez de 14,90', { html: troca('14,90', '12,90') });
revisor('5.3b', 'preço 114,90 (contém 14,90)', { html: troca('14,90', '114,90') });
revisor('5.4', '<s>29,90 €</s>', { html: troca('<p>', '<p><s>29,90 €</s> ') });
revisor('5.6', 'text-decoration: line-through', { html: troca('<p>', '<p><span style="text-decoration:line-through">29,90 €</span> ') });
revisor('5.7a', '"de 29,90 por" (sem símbolo)', { html: troca('<p>', '<p>de 29,90 por ') });
revisor('5.7b', '"de 29,90 € por" (símbolo depois, formato PT)', { html: troca('<p>', '<p>de 29,90 € por ') });
revisor('5.7c', '"de € 29,90 por" (símbolo antes)', { html: troca('<p>', '<p>de € 29,90 por ') });
revisor('5.2', 'preço removido do texto', { html: sem('Por apenas 14,90 € ') });
revisor('6.1', 'lang="pt-BR"', { html: troca('lang="pt-PT"', 'lang="pt-BR"') });
revisor('6.2', 'sem atributo lang', { html: sem(' lang="pt-PT"') });
revisor('6.2b', 'lang="en"', { html: troca('pt-PT', 'en') });
revisor('6.3', '"para você"', { html: troca('para si', 'para você') });
revisor('6.4a', '"Você" no início', { html: troca('Por apenas', 'Você paga apenas') });
revisor('6.4b', '"vocês"', { html: troca('para si', 'para vocês') });
revisor('6.4c', '"voce" sem acento', { html: troca('para si', 'para voce') });
revisor('6.6', 'vocabulário do Brasil ("celular")', { html: troca('para si', 'no seu celular') });
revisor('7.1', 'sem criativos', { imgs: [] });
revisor('7.2', 'um criativo sem url', { imgs: [{ url: 'https://a.invalid/1' }, { nome: 'sem url' }] });
revisor('7.4', 'criativo com URL que daria 404 (não é checada)', { imgs: [{ url: 'https://404.invalid/x.png' }] });

// Saída do agente (testes 8.x)
function pos(id, descricao, saidaAgente) {
  const r = rodar(C.REVISOR_POS, {}, { output: typeof saidaAgente === 'string' ? saidaAgente : JSON.stringify(saidaAgente) });
  linhas.push([id, descricao, 'revisor_aprovou = ' + r[0].json.verificacoes.revisor_aprovou + '; JSON ok = ' + r[0].json.verificacoes.saida_do_agente_em_json]);
}
pos('8.1', 'agente devolve texto livre', 'Está tudo ótimo, aprovado.');
pos('8.2', 'aprovado:true com erros[] não vazio', { aprovado: true, erros: [{ onde: 'x' }] });
pos('8.5', 'aprovado:true e erros vazio', { aprovado: true, erros: [] });
pos('8.4', 'aprovado:false', { aprovado: false, erros: [] });
linhas.push(['8.3', 'agente aprova com um item de código falso', 'NÃO TESTÁVEL neste nó: REVISOR_POS só olha a saída do agente; o cruzamento com o checklist é feito no nó de saída da etapa (ver plano §3.3). Testar na V-02.']);

// Copy: regex de claims de saúde e escassez (HEADLINE_POS usa o mesmo CLAIMS_SAUDE)
const f = new Function(C.UTIL + '; return { CLAIMS_SAUDE };')();
const claim = (id, texto) => linhas.push([id, 'claims: ' + JSON.stringify(texto), f.CLAIMS_SAUDE.test(texto) ? 'PEGA' : 'passa']);
claim('B2.1', 'Cura a sua artrose em 7 dias.');
claim('B2.1b', 'Cure as suas dores.');
claim('B2.2a', 'Perde 10 kg em 1 semana.');
claim('B2.2b', 'Perca 10 kg em 1 semana.');
claim('B2.2c', 'perda de 10 kg');
claim('B2.2d', 'Elimine 5 quilos');
claim('B2.3', 'Sabemos que sofre de dores nas costas.');
claim('B2.7a', 'Últimas vagas');
claim('B2.7b', 'Últimas 10 vagas');
claim('B2.7c', 'Só hoje');
claim('B2.x', 'Antes e depois');
claim('B2.xb', 'Antes/depois');
claim('B2.y', JSON.stringify({ removido_por_risco: ['antes e depois', 'últimas vagas'] }) + ' (lista que o próprio prompt do Headline Killer manda preencher)');

// Tráfego: trava de PAUSED (B3.1 a B3.4) com plano do modelo contendo ACTIVE
function trafego(id, descricao, plano) {
  try {
    const r = rodar(C.TRAFEGO_PAYLOAD, { Entrada: { config: cfg } }, { output: JSON.stringify(plano) });
    linhas.push([id, descricao, 'passou sem erro; status enviados: ' + [r[0].json.campanha.status].concat(r[0].json.conjuntos.map(c => c.status)).join(', ')]);
  } catch (e) { linhas.push([id, descricao, 'ERRO (nada enviado): ' + e.message]); }
}
trafego('B3.0', 'plano normal', { conjuntos: [{ nome: '50-65 mulheres', idade_min: 50, idade_max: 65 }] });
trafego('B3.3', 'modelo põe "ACTIVE" no nome do conjunto', { conjuntos: [{ nome: 'ACTIVE teste', idade_min: 50, idade_max: 65 }] });
trafego('B3.1', 'modelo tenta mandar status ACTIVE (o código ignora o campo)', { conjuntos: [{ nome: 'x', status: 'ACTIVE' }], status: 'ACTIVE' });

function conferencia(id, descricao, st, ids = ['campanha']) {
  const nodes = { 'Payload PAUSADO': { plano: {} }, 'Meta · criar campanha (PAUSED)': { id: '111' }, 'Meta · criar conjunto (PAUSED)': [{ id: '222' }] };
  const r = rodar(C.TRAFEGO_POS, nodes, {}, st);
  linhas.push([id, descricao, 'tudo_pausado_conferido_na_api = ' + r[0].json.verificacoes.tudo_pausado_conferido_na_api]);
}
conferencia('B3.4', 'API devolve status ACTIVE', [{ id: '111', status: 'ACTIVE' }]);
conferencia('B3.5', 'PAUSED com ADSET_PAUSED', [{ id: '111', status: 'PAUSED', effective_status: 'PAUSED' }, { id: '222', status: 'PAUSED', effective_status: 'ADSET_PAUSED' }]);
conferencia('B3.6', 'PAUSED com effective_status PENDING_REVIEW', [{ id: '111', status: 'PAUSED', effective_status: 'PENDING_REVIEW' }]);
conferencia('B3.6b', 'PAUSED com effective_status IN_PROCESS', [{ id: '111', status: 'PAUSED', effective_status: 'IN_PROCESS' }]);
conferencia('B3.7', 'status PAUSED, effective_status ACTIVE', [{ id: '111', status: 'PAUSED', effective_status: 'ACTIVE' }]);
conferencia('B3.7b', 'nenhuma resposta da API (lista vazia)', []);

console.log('Simulação local dos testes do Revisor (código de n8n/tools/codigos.mjs)\n');
for (const [id, d, r] of linhas) console.log(id.padEnd(10) + d.slice(0, 90).padEnd(92) + r);
