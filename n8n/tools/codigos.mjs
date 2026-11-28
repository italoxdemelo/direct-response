// Corpos dos nós Code do n8n. Cada função é convertida em texto pelo gerador
// (só o corpo entra no nó). Os nomes $, $input, $json, $now existem no n8n.
/* eslint-disable no-undef */

// ---------- utilitários (inseridos no topo dos nós que precisam) ----------
export const UTIL = String.raw`
function parseJSON(s) {
  if (s && typeof s === 'object') return s;
  if (typeof s !== 'string') return { erro_parse: true, bruto: s };
  let t = s.trim().replace(/^` + '```' + String.raw`(?:json)?\s*/i, '').replace(/` + '```' + String.raw`\s*$/, '');
  const a = t.indexOf('{'), b = t.lastIndexOf('}');
  if (a >= 0 && b > a) t = t.slice(a, b + 1);
  try { return JSON.parse(t); } catch (e) { return { erro_parse: true, bruto: s.slice(0, 4000) }; }
}
function textoDoHtml(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|h\d|li|div|section)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&')
    .replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n').trim();
}
const PRECO_RISCADO = /(<s>|<del>|line-through|\bde\s*:?\s*(R\$|€|EUR|US\$|\$)\s?\d[\d.,]*\s*(por|para|apenas|só)\b)/i;
function hashTexto(t) {
  // FNV-1a 32 bits: identifica a versão de uma entrega (ex.: a copy aprovada)
  let h = 0x811c9dc5; const s = String(t);
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return 'v' + h.toString(16).padStart(8, '0');
}
const CLAIMS_SAUDE = /(antes\s+e\s+depois|\bperd(a|e|er)\s+(até\s+)?\d+\s*(kg|quilos)|\bemagre[cç]a\s+\d|\bcura(r|do|da)?\b|resultado\s+garantido|últimas\s+vagas)/i;
`;

export function preReq(fnBody) {
  // fnBody devolve a lista "faltando" a partir de cfg e estado
  return String.raw`
const entrada = $('Entrada').first().json;
const cfg = entrada.config || {};
const estado = entrada.estado || {};
const ETAPA = '__ETAPA__';
const ativas = cfg.etapas_ativas || [];
if (ativas.length && !ativas.includes(ETAPA)) {
  return [{ json: { ok: false, pulada: true, faltando: [] } }];
}
const faltando = [];
${fnBody}
return [{ json: { ok: faltando.length === 0, pulada: false, faltando } }];`;
}

export const BLOQUEADO = String.raw`
const p = $json;
const ETAPA = '__ETAPA__';
return [{ json: {
  etapa: ETAPA, agente: '__AGENTE__',
  aprovado: false, seguir: p.pulada === true, pulada: p.pulada === true, bloqueado: p.pulada !== true,
  motivo: p.congelada ? 'copy aprovada congelada (' + p.versao + '); não foi gerada de novo' : p.pulada ? 'etapa fora de etapas_ativas nesta rodada' : 'faltando: ' + p.faltando.join('; '),
  faltando: p.faltando, em: new Date().toISOString()
} }];`;

export const SAIDA = String.raw`
${UTIL}
const ETAPA = '__ETAPA__';
const sup = parseJSON($json.output);
const dados = $('Dados da etapa').first().json;
const pos = $('__POS__').first().json;
const verificacoes = Object.assign({}, dados.verificacoes || {}, pos.verificacoes || {});
const falhas = Object.entries(verificacoes).filter(([k, v]) => v !== true).map(([k]) => k);
const aprovadoAgente = pos.saida && pos.saida.aprovado === false ? false : true; // o Revisor tem voto próprio
const aprovado = sup.aprovado === true && falhas.length === 0 && aprovadoAgente;
return [{ json: {
  etapa: ETAPA, agente: '__AGENTE__',
  aprovado, seguir: aprovado, pulada: false, bloqueado: false,
  falhas_automaticas: falhas, verificacoes, avisos: Object.assign({}, dados.avisos || {}, pos.avisos || {}),
  briefing_grok: $('Grok · briefing').first().json.output,
  saida: pos.saida, saida_hash: hashTexto(JSON.stringify(pos.saida || {})), supervisor: sup, em: new Date().toISOString()
} }];`;

// Falha do modelo (saída de erro dos nós Grok depois de 3 tentativas): a etapa reprova com motivo, sem derrubar a rodada
export const FALHA_MODELO = String.raw`
const ETAPA = '__ETAPA__';
const e = $json.error || {};
const msg = String((e && (e.message || e.description)) || (typeof e === 'string' ? e : '') || 'erro desconhecido').slice(0, 500);
return [{ json: {
  etapa: ETAPA, agente: '__AGENTE__',
  aprovado: false, seguir: false, pulada: false, bloqueado: false,
  motivo: 'falha do modelo (Grok/xAI) depois de 3 tentativas: ' + msg,
  falhas_automaticas: ['modelo_respondeu'], verificacoes: { modelo_respondeu: false },
  em: new Date().toISOString()
} }];`;

// ---------------- RADAR ----------------
export const RADAR_ITENS = String.raw`
const cfg = $('Entrada').first().json.config;
const v = cfg.graph_version || 'v23.0';
const campos = 'id,page_id,page_name,ad_delivery_start_time,ad_snapshot_url,ad_creative_link_titles';
const pais = JSON.stringify([cfg.pais_destino]);
const itens = [];
for (const termo of (cfg.termos_busca || [])) {
  itens.push({ json: { tipo: 'termo', chave: termo, url: 'https://graph.facebook.com/' + v + '/ads_archive',
    qs: { search_terms: termo, search_type: 'KEYWORD_UNORDERED', ad_reached_countries: pais, ad_active_status: 'ACTIVE', ad_type: 'ALL', fields: campos, limit: 200 } } });
}
for (const o of (cfg.ofertas_br || [])) {
  if (!o.page_id_br) continue;
  itens.push({ json: { tipo: 'pagina_br_no_destino', chave: o.page_id_br, nome: o.nome, url: 'https://graph.facebook.com/' + v + '/ads_archive',
    qs: { search_page_ids: JSON.stringify([String(o.page_id_br)]), ad_reached_countries: pais, ad_active_status: 'ACTIVE', ad_type: 'ALL', fields: campos, limit: 200 } } });
}
if (!itens.length) itens.push({ json: { tipo: 'nenhuma_consulta', chave: '-', url: 'https://graph.facebook.com/' + v + '/ads_archive', qs: {} } });
return itens;`;

export const RADAR_DADOS = String.raw`
const cfg = $('Entrada').first().json.config;
const pedidos = $('Consultas → itens').all().map(i => i.json);
// Com paginação, a API devolve várias páginas por consulta: agrupa pelo item de origem (pairedItem)
const porPedido = pedidos.map(() => []);
$input.all().forEach((it, i) => {
  const pi = it.pairedItem;
  let idx = pi && typeof pi.item === 'number' ? pi.item : (Array.isArray(pi) && pi[0] && typeof pi[0].item === 'number' ? pi[0].item : i);
  if (idx >= porPedido.length) idx = porPedido.length - 1;
  porPedido[idx].push(it.json || {});
});
const lib = (pais, extra) => 'https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=' + pais + extra;
const consultas = pedidos.map((p, i) => {
  const paginas_resp = porPedido[i].length ? porPedido[i] : [{}];
  const comErro = paginas_resp.find(r => r && r.error);
  if (comErro) return { tipo: p.tipo, chave: p.chave, erro: String(comErro.error.message || JSON.stringify(comErro.error)).slice(0, 300) };
  const ads = [].concat(...paginas_resp.map(r => Array.isArray(r.data) ? r.data : []));
  const r = paginas_resp[paginas_resp.length - 1] || {};
  const paginas = {}; let maisAntigo = null;
  for (const a of ads) {
    const k = a.page_id || '?';
    paginas[k] = paginas[k] || { page_id: a.page_id, page_name: a.page_name, anuncios: 0 };
    paginas[k].anuncios++;
    if (a.ad_delivery_start_time && (!maisAntigo || a.ad_delivery_start_time < maisAntigo)) maisAntigo = a.ad_delivery_start_time;
  }
  return {
    tipo: p.tipo, chave: p.chave, nome: p.nome || null,
    anuncios_ativos_carregados: ads.length,
    paginas_lidas: paginas_resp.length,
    contagem_e_minimo: !!(r.paging && r.paging.next),
    anuncio_mais_antigo_carregado: maisAntigo,
    anunciantes: Object.values(paginas).sort((a, b) => b.anuncios - a.anuncios).slice(0, 15),
    exemplos: ads.slice(0, 5).map(a => ({ id: a.id, pagina: a.page_name, inicio: a.ad_delivery_start_time, link: 'https://www.facebook.com/ads/library/?id=' + a.id })),
    link_print: p.tipo === 'termo'
      ? lib(cfg.pais_destino, '&q=' + encodeURIComponent(p.chave) + '&search_type=keyword_unordered')
      : lib(cfg.pais_destino, '&view_all_page_id=' + p.chave)
  };
});
const ofertasBr = (cfg.ofertas_br || []).map(o => ({
  nome: o.nome, page_id_br: o.page_id_br || null, url_pagina: o.url_pagina || null, preco_br: o.preco_br || 'não verificado',
  anuncios_ativos_br: o.anuncios_ativos_br != null ? o.anuncios_ativos_br : 'não verificado',
  anuncio_mais_antigo_br: o.anuncio_mais_antigo_br || 'não verificado',
  print_br: o.print_br || null,
  link_print_br: o.page_id_br ? lib(cfg.pais_origem, '&view_all_page_id=' + o.page_id_br) : null
}));
const erros = consultas.filter(c => c.erro);
return [{ json: {
  dados: {
    pais_origem: cfg.pais_origem, pais_destino: cfg.pais_destino,
    ofertas_br: ofertasBr, consultas_destino: consultas,
    aviso: 'A API da Biblioteca de Anúncios só devolve anúncios comerciais de países da UE. Os números do Brasil vêm da configuração (prints) e, se não vierem, ficam como "não verificado". O Radar pagina a API (até 25 páginas de 200); contagem_e_minimo=true quer dizer que ainda havia mais anúncios depois do limite de páginas.'
  },
  verificacoes: { api_meta_destino_respondeu: consultas.length > 0 && erros.length === 0 },
  avisos: { erros_api: erros.map(e => e.chave + ': ' + e.erro) }
} }];`;

export const POS_SIMPLES = String.raw`
${UTIL}
const saida = parseJSON($json.output);
return [{ json: { saida, verificacoes: { saida_do_agente_em_json: !saida.erro_parse } } }];`;

// ---------------- HEADLINE KILLER ----------------
export const HEADLINE_DADOS = String.raw`
${UTIL}
const cfg = $('Entrada').first().json.config;
const html = typeof $json.data === 'string' ? $json.data : '';
const texto = textoDoHtml(html).slice(0, 25000);
const riscos = [];
if (PRECO_RISCADO.test(html)) riscos.push('a original usa preço riscado / de-por');
if (CLAIMS_SAUDE.test(texto)) riscos.push('a original tem claim de saúde ou escassez (antes/depois, kg, cura, últimas vagas)');
return [{ json: {
  dados: { oferta: cfg.oferta_escolhida, idioma_destino: cfg.idioma, pais_destino: cfg.nome_pais, texto_da_pagina_original: texto, riscos_detectados_na_original: riscos },
  verificacoes: { pagina_original_baixada: texto.length > 500 },
  avisos: {}
} }];`;

export const HEADLINE_POS = String.raw`
${UTIL}
const cfg = $('Entrada').first().json.config;
const saida = parseJSON($json.output);
const txt = JSON.stringify(saida);
const v = {
  saida_do_agente_em_json: !saida.erro_parse,
  sem_preco_riscado: !PRECO_RISCADO.test(txt),
  sem_claims_de_saude_ou_escassez: !CLAIMS_SAUDE.test(txt),
  dez_headlines: Array.isArray(saida.headlines) && saida.headlines.length >= 10,
  cinco_roteiros_video: Array.isArray(saida.roteiros_video) && saida.roteiros_video.length >= 5,
  tres_briefings_imagem: Array.isArray(saida.briefings_imagem) && saida.briefings_imagem.length >= 3
};
if (String(cfg.idioma).toLowerCase() === 'pt-pt') v.sem_voce_em_pt_pt = !/(^|[^\p{L}])voc[eê]s?(?![\p{L}])/iu.test(txt);
return [{ json: { saida, verificacoes: v } }];`;

// ---------------- CONSTRUTOR ----------------
export const CONSTRUTOR_DADOS = String.raw`
const e = $('Entrada').first().json;
return [{ json: {
  dados: { copy_aprovada: e.estado.headline.saida, idioma: e.config.idioma, pais: e.config.nome_pais, oferta: e.config.oferta_escolhida },
  verificacoes: {}, avisos: {}
} }];`;

export const CONSTRUTOR_HTML = String.raw`
${UTIL}
const cfg = $('Entrada').first().json.config;
const saida = parseJSON($json.output);
let html = String(saida.html || '');
const pixel = String(cfg.pixel_id || '').trim();
const PIXEL = '<!-- Meta Pixel (injetado pelo n8n) -->\n<script>\n!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");\nfbq(\'init\', \'' + pixel + '\');\nfbq(\'track\', \'PageView\');\n</script>\n<noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=' + pixel + '&ev=PageView&noscript=1"/></noscript>\n';
const UTM = '<!-- dr-utm: repassa utm_*, fbclid e src/sck para os links de checkout -->\n<script id="dr-utm">\n(function(){var q=new URLSearchParams(location.search);var keep=["utm_source","utm_medium","utm_campaign","utm_content","utm_term","fbclid","src","sck"];var p=new URLSearchParams();keep.forEach(function(k){if(q.get(k))p.set(k,q.get(k));});if(!p.get("src")&&q.get("utm_source"))p.set("src",q.get("utm_source"));if(!p.get("sck")){var s=[q.get("utm_source"),q.get("utm_campaign"),q.get("utm_content")].filter(Boolean).join("|");if(s)p.set("sck",s);}if(![...p.keys()].length)return;document.querySelectorAll("a.cta,a[href*=\'hotmart\'],a[href*=\'pay.\']").forEach(function(a){try{var u=new URL(a.href);p.forEach(function(v,k){if(!u.searchParams.get(k))u.searchParams.set(k,v);});a.href=u.toString();}catch(e){}});})();\n</script>\n';
if (html && !html.includes("fbq('init'")) html = /<\/head>/i.test(html) ? html.replace(/<\/head>/i, PIXEL + '</head>') : PIXEL + html;
if (html && !html.includes('dr-utm')) html = /<\/body>/i.test(html) ? html.replace(/<\/body>/i, UTM + '</body>') : html + UTM;
html = html.split('{{URL_PRIVACIDADE}}').join(cfg.url_privacidade || '#privacidade')
           .split('{{URL_TERMOS}}').join(cfg.url_termos || '#termos');
const slug = String(cfg.oferta_escolhida && cfg.oferta_escolhida.slug || 'oferta').replace(/[^a-z0-9-]/gi, '-');
const arquivo = String(cfg.pasta_saida).replace(/[\\/]+$/, '') + '\\' + slug + '\\index.html';
delete saida.html;
return [{ json: { html, arquivo, saida, verificacoes: {
  saida_do_agente_em_json: !saida.erro_parse,
  html_completo: /<html[\s>]/i.test(html) && /<\/html>/i.test(html),
  pixel_injetado: pixel.length > 5 && html.includes("fbq('init', '" + pixel + "')"),
  pageview_injetado: html.includes("fbq('track', 'PageView')"),
  utm_injetado: html.includes('dr-utm'),
  botoes_marcados_para_checkout: html.includes('{{CHECKOUT_URL}}')
} } }];`;

export const CONSTRUTOR_PAGEVIEW = String.raw`
const cfg = $('Entrada').first().json.config;
const montado = $('Montar HTML final').first().json;
const pag = $('Página publicada · baixar').first().json;
const px = $('Pixel · último disparo').first().json;
const htmlNoAr = typeof pag.body === 'string' ? pag.body : (typeof pag.data === 'string' ? pag.data : '');
const pixel = String(cfg.pixel_id || '');
const reInit = new RegExp("fbq\\(\\s*['\"]init['\"]\\s*,\\s*['\"]" + pixel + "['\"]");
const ultimo = px && px.last_fired_time ? px.last_fired_time : null;
const recente = ultimo ? (Date.now() - new Date(ultimo).getTime()) < 7 * 24 * 3600 * 1000 : false;
return [{ json: {
  saida: Object.assign({}, montado.saida, { arquivo: montado.arquivo, html: montado.html, url_publicada: cfg.url_pagina_publicada || null, pixel_ultimo_disparo: ultimo }),
  verificacoes: Object.assign({}, montado.verificacoes, {
    pagina_publicada_no_ar: !!cfg.url_pagina_publicada && pag.statusCode === 200,
    pixel_certo_na_pagina_publicada: pixel.length > 5 && reInit.test(htmlNoAr),
    pageview_na_pagina_publicada: /fbq\(\s*['"]track['"]\s*,\s*['"]PageView['"]/.test(htmlNoAr),
    utm_na_pagina_publicada: htmlNoAr.includes('dr-utm'),
    pixel_disparou_nos_ultimos_7_dias: recente
  }),
  avisos: { como_publicar: 'Suba o arquivo ' + montado.arquivo + ' no seu domínio e preencha url_pagina_publicada. Abra a página uma vez no navegador para o PageView disparar e rode de novo.' }
} }];`;

// ---------------- FUNIL ----------------
export const FUNIL_DADOS = String.raw`
const cfg = $('Entrada').first().json.config;
const tok = $('Hotmart · token').first().json;
const prod = $('Hotmart · produtos').first().json;
const chk = $('Checkout · conferir').first().json;
const lista = Array.isArray(prod.items) ? prod.items : (Array.isArray(prod.data) ? prod.data : []);
const alvo = String(cfg.hotmart_product_id || '');
const achado = lista.find(p => String(p.id) === alvo || String(p.ucode) === alvo) || null;
const corpo = typeof chk.body === 'string' ? chk.body : '';
const preco = String(cfg.preco_aprovado || '').replace(/[^\d,\.]/g, '');
return [{ json: {
  dados: {
    pais: cfg.nome_pais, moeda: cfg.moeda, preco_aprovado: cfg.preco_aprovado,
    produto_hotmart: achado, produtos_na_conta: lista.slice(0, 20).map(p => ({ id: p.id, nome: p.name, status: p.status })),
    checkout_url: cfg.hotmart_checkout_url, checkout_status_http: chk.statusCode || null,
    entregaveis_confirmados: cfg.entregaveis_confirmados || [], oferta: cfg.oferta_escolhida
  },
  verificacoes: {
    hotmart_api_autenticou: !!tok.access_token,
    produto_existe_na_hotmart: !!achado,
    checkout_no_ar: chk.statusCode === 200
  },
  avisos: {
    checkout_mostra_preco_no_html: preco ? corpo.includes(preco) : false,
    nota: 'O checkout da Hotmart desenha o preço por JavaScript; se este aviso vier false, confira o preço no navegador.'
  }
} }];`;

export const FUNIL_LINK = String.raw`
${UTIL}
const e = $('Entrada').first().json;
const saida = parseJSON($json.output);
const url = String(e.config.hotmart_checkout_url || '');
let html = String((e.estado.construtor && e.estado.construtor.saida && e.estado.construtor.saida.html) || '');
const antes = (html.match(/\{\{CHECKOUT_URL\}\}/g) || []).length;
html = html.split('{{CHECKOUT_URL}}').join(url);
return [{ json: { html, arquivo: e.estado.construtor.saida.arquivo, saida, verificacoes: {
  saida_do_agente_em_json: !saida.erro_parse,
  botoes_com_link_do_checkout: antes > 0 && url.length > 10 && !html.includes('{{CHECKOUT_URL}}'),
  sem_preco_riscado_na_ficha: !PRECO_RISCADO.test(JSON.stringify(saida))
} } }];`;

export const FUNIL_FIM = String.raw`
const l = $('Link do checkout nos botões').first().json;
return [{ json: { saida: Object.assign({}, l.saida, { html: l.html, arquivo: l.arquivo }), verificacoes: Object.assign({}, l.verificacoes, { pagina_regravada_no_disco: !$json.error }) } }];`;

// ---------------- CLAQUETE ----------------
export const CLAQUETE_DADOS = String.raw`
const e = $('Entrada').first().json;
const hk = e.estado.headline.saida || {};
return [{ json: { dados: { roteiros_video: hk.roteiros_video || [], briefings_imagem: hk.briefings_imagem || [], idioma: e.config.idioma, oferta: e.config.oferta_escolhida }, verificacoes: { tem_roteiros: (hk.roteiros_video || []).length > 0 }, avisos: {} } }];`;

export const CLAQUETE_ITENS = String.raw`
${UTIL}
const plano = parseJSON($json.output);
const imgs = Array.isArray(plano.imagens) ? plano.imagens : [];
if (!imgs.length) return [{ json: { id: null, prompt: '', sem_imagens: true } }];
return imgs.slice(0, 6).map(i => ({ json: { id: i.id, prompt: [i.prompt, i.texto_na_imagem ? 'Text on image: "' + i.texto_na_imagem + '"' : ''].filter(Boolean).join('. '), formato: i.formato } }));`;

export const CLAQUETE_POS = String.raw`
${UTIL}
const plano = parseJSON($('Agente · Claquete').first().json.output);
const pedidos = $('Imagens → itens').all().map(i => i.json);
const resp = $input.all().map(i => i.json);
const geradas = pedidos.map((p, i) => {
  const r = resp[i] || {};
  const d = Array.isArray(r.data) ? r.data[0] : null;
  return { id: p.id, url: d && d.url ? d.url : null, erro: r.error ? String(r.error.message || JSON.stringify(r.error)).slice(0, 200) : null };
});
return [{ json: { saida: { plano, imagens_geradas: geradas }, verificacoes: {
  saida_do_agente_em_json: !plano.erro_parse,
  imagens_geradas: geradas.length > 0 && geradas.every(g => !!g.url),
  videos_roteirizados: Array.isArray(plano.videos) && plano.videos.length > 0
} } }];`;

// ---------------- REVISOR ----------------
export const REVISOR_DADOS = String.raw`
${UTIL}
const e = $('Entrada').first().json;
const cfg = e.config, est = e.estado || {};
const pag = $('Revisor · página no ar').first().json;
const chk = $('Revisor · checkout').first().json;
const px = $('Revisor · pixel').first().json;
const html = typeof pag.body === 'string' ? pag.body : '';
const pixel = String(cfg.pixel_id || '');
const reInit = new RegExp("fbq\\(\\s*['\"]init['\"]\\s*,\\s*['\"]" + pixel + "['\"]");
const links = [...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>/gi)].map(m => m[1]);
const linksCheckout = links.filter(h => /hotmart|pay\.|checkout/i.test(h));
const urlChk = String(cfg.hotmart_checkout_url || '');
const precoNum = String(cfg.preco_aprovado || '').replace(/[^\d,\.]/g, '');
const lang = (html.match(/<html[^>]*\blang=["']([^"']+)["']/i) || [])[1] || '';
const texto = textoDoHtml(html);
const imgs = (est.claquete && est.claquete.saida && est.claquete.saida.imagens_geradas) || [];
const checklist = {
  '1_pagina_no_ar': pag.statusCode === 200,
  '2_pixel_certo_e_pageview': pixel.length > 5 && reInit.test(html) && /fbq\(\s*['"]track['"]\s*,\s*['"]PageView['"]/.test(html),
  '3_pixel_ja_disparou': !!(px && px.last_fired_time),
  '4_links_de_checkout_certos_e_no_ar': linksCheckout.length > 0 && linksCheckout.every(h => h.split('?')[0] === urlChk.split('?')[0]) && !html.includes('{{CHECKOUT_URL}}') && chk.statusCode === 200,
  '5_preco_aprovado_e_sem_preco_riscado': !!precoNum && texto.includes(precoNum) && !PRECO_RISCADO.test(html),
  '6_idioma_do_destino': lang.toLowerCase().startsWith(String(cfg.idioma || '').toLowerCase().slice(0, 2)) && (String(cfg.idioma).toLowerCase() !== 'pt-pt' || !/(^|[^\p{L}])voc[eê]s?(?![\p{L}])/iu.test(texto)),
  '7_criativos_prontos': imgs.length > 0 && imgs.every(i => !!i.url)
};
return [{ json: {
  dados: { checklist, url: cfg.url_pagina_publicada, lang_da_pagina: lang, links_de_checkout: linksCheckout, preco_aprovado: cfg.preco_aprovado, texto_da_pagina: texto.slice(0, 20000), criativos: imgs },
  verificacoes: checklist, avisos: {}
} }];`;

export const REVISOR_POS = String.raw`
${UTIL}
const saida = parseJSON($json.output);
return [{ json: { saida, verificacoes: { saida_do_agente_em_json: !saida.erro_parse, revisor_aprovou: saida.aprovado === true && (!saida.erros || saida.erros.length === 0) } } }];`;

// ---------------- TRÁFEGO ----------------
export const TRAFEGO_DADOS = String.raw`
const cfg = $('Entrada').first().json.config;
return [{ json: { dados: {
  pais: cfg.pais_destino, oferta: cfg.oferta_escolhida, url_pagina: cfg.url_pagina_publicada,
  orcamento_diario_centavos: cfg.orcamento_diario_centavos, publico_sugerido: cfg.publico || null
}, verificacoes: {}, avisos: {} } }];`;

export const TRAFEGO_PAYLOAD = String.raw`
${UTIL}
const cfg = $('Entrada').first().json.config;
const plano = parseJSON($json.output);
const hoje = new Date().toISOString().slice(0, 10);
// Nome fixo (não vem do modelo): é por ele que o fluxo acha a campanha numa segunda rodada e não duplica.
const nomeBase = String(cfg.campanha_nome || ('DR | ' + ((cfg.oferta_escolhida && cfg.oferta_escolhida.nome) || 'oferta') + ' | ' + cfg.pais_destino));
const campanha = {
  name: nomeBase,
  objective: 'OUTCOME_SALES', buying_type: 'AUCTION', special_ad_categories: [],
  is_adset_budget_sharing_enabled: false,
  status: 'PAUSED'
};
const conjuntos = (Array.isArray(plano.conjuntos) && plano.conjuntos.length ? plano.conjuntos : [{ nome: 'aberto' }]).slice(0, 3).map((c, i) => ({
  name: nomeBase + ' | ' + (c.nome || ('conjunto ' + (i + 1))) + ' | ' + hoje,
  status: 'PAUSED',
  daily_budget: Number(cfg.orcamento_diario_centavos),
  billing_event: 'IMPRESSIONS', optimization_goal: 'OFFSITE_CONVERSIONS', bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
  promoted_object: { pixel_id: String(cfg.pixel_id), custom_event_type: 'PURCHASE' },
  targeting: {
    geo_locations: { countries: [cfg.pais_destino] },
    age_min: Number(c.idade_min) || 18, age_max: Number(c.idade_max) || 65,
    genders: Array.isArray(c.generos) && c.generos.length === 1 ? c.generos : undefined,
    targeting_automation: { advantage_audience: 0 }
  }
}));
// Trava: nada pode sair com status diferente de PAUSED
const tudo = JSON.stringify({ campanha, conjuntos });
if (/"status"\s*:\s*"(?!PAUSED)/.test(tudo) || /ACTIVE/.test(tudo)) throw new Error('Trava do Tráfego: payload com status diferente de PAUSED. Nada foi enviado.');
return [{ json: { plano, campanha, conjuntos } }];`;

export const TRAFEGO_CONJUNTOS = String.raw`
const p = $('Payload PAUSADO').first().json;
const camp = $json;
const id = camp && camp.id ? camp.id : null;
return p.conjuntos.map(c => ({ json: { campaign_id: id, body: Object.assign({}, c, { campaign_id: id, status: 'PAUSED' }) } }));`;

export const TRAFEGO_IDS = String.raw`
const camp = $('Meta · criar campanha (PAUSED)').first().json;
const ids = [];
if (camp && camp.id) ids.push({ json: { id: camp.id, tipo: 'campanha' } });
for (const r of $input.all()) if (r.json && r.json.id) ids.push({ json: { id: r.json.id, tipo: 'conjunto' } });
if (!ids.length) return [{ json: { id: 'nenhum', tipo: 'nenhum' } }];
return ids;`;

export const TRAFEGO_REUSAR = String.raw`
// A campanha com este nome já existe: não cria nada de novo e NÃO mexe no status (o Arthur pode já ter ativado).
const camp = $('Meta · buscar campanha').first().json.data[0];
const r = $json || {};
const lista = Array.isArray(r.data) ? r.data : [];
return [{ json: { id: camp.id, tipo: 'campanha', reutilizada: true } }].concat(lista.map(c => ({ json: { id: c.id, tipo: 'conjunto', reutilizada: true } })));`;

export const TRAFEGO_POS = String.raw`
const ran = n => { try { return $(n).isExecuted === true; } catch (e) { return false; } };
const plano = $('Payload PAUSADO').first().json.plano;
if (ran('Reusar campanha')) {
  const ids = $('Reusar campanha').all().map(i => i.json);
  const st0 = $input.all().map(i => i.json).filter(s => s && s.id);
  const ativos = st0.filter(s => s.status !== 'PAUSED');
  return [{ json: {
    saida: { plano, campanha: { id: ids[0].id, reutilizada: true }, conjuntos: ids.slice(1).map(c => ({ id: c.id, reutilizado: true })), status_conferido: st0 },
    verificacoes: {
      campanha_criada: true,
      conjuntos_criados: ids.length > 1,
      tudo_pausado_conferido_na_api: st0.length > 0 && ativos.length === 0
    },
    avisos: { reutilizada: 'A campanha já existia com este nome: nada foi criado nem alterado nesta rodada (sem duplicar).',
      ativos: ativos.length ? 'Itens já ativos (ativados fora do fluxo): ' + ativos.map(a => a.id + ' ' + a.status).join(', ') : '' }
  } }];
}
const camp = $('Meta · criar campanha (PAUSED)').first().json;
const conj = $('Meta · criar conjunto (PAUSED)').all().map(i => i.json);
const st = $input.all().map(i => i.json).filter(s => s && s.id);
const naoPausados = st.filter(s => s.status !== 'PAUSED' || (s.effective_status && !['PAUSED', 'CAMPAIGN_PAUSED', 'ADSET_PAUSED'].includes(s.effective_status)));
return [{ json: {
  saida: { plano, campanha: camp && camp.id ? { id: camp.id } : { erro: camp && camp.error ? camp.error.message : 'não criada' },
    conjuntos: conj.map(c => c.id ? { id: c.id } : { erro: c.error ? c.error.message : 'não criado' }), status_conferido: st },
  verificacoes: {
    campanha_criada: !!(camp && camp.id),
    conjuntos_criados: conj.length > 0 && conj.every(c => !!c.id),
    tudo_pausado_conferido_na_api: st.length > 0 && naoPausados.length === 0
  },
  avisos: { anuncios: 'Os anúncios (criativos) dentro dos conjuntos ainda não são criados por este fluxo; suba os criativos da Claquete e crie os anúncios também PAUSADOS.' }
} }];`;

// ---------------- COORDENADOR ----------------
export const COORD_ARQUIVO_ESTADO = String.raw`
// Caminho do arquivo que guarda o estado entre rodadas: <pasta_saida>\<slug>\estado.json
const cfg = $json;
const slug = String(cfg.oferta_escolhida && cfg.oferta_escolhida.slug || 'oferta').replace(/[^a-z0-9-]/gi, '-');
return [{ json: { arquivo_estado: String(cfg.pasta_saida || '').replace(/[\\/]+$/, '') + '\\' + slug + '\\estado.json' } }];`;

export const COORD_ESTADO_INICIAL = String.raw`
const config = $('⚙️ Configuração').first().json;
const ETAPAS = ['radar', 'headline', 'construtor', 'funil', 'claquete', 'revisor', 'trafego'];
let salvo = {};
try { const d = $('Estado salvo · extrair').first().json; salvo = d && d.data && typeof d.data === 'object' && !Array.isArray(d.data) ? d.data : {}; } catch (e) { salvo = {}; }
const estado = { plano_do_coordenador: $json.output || '(plano indisponível: o modelo não respondeu)', inicio_rodada: new Date().toISOString() };
// Etapas de rodadas anteriores entram marcadas: valem como entrega (ex.: copy congelada), nunca como aprovação "desta rodada"
for (const k of ETAPAS) if (salvo[k] && typeof salvo[k] === 'object') estado[k] = Object.assign({}, salvo[k], { de_rodada_anterior: true });
return [{ json: { config, estado, arquivo_estado: $('Arquivo de estado').first().json.arquivo_estado } }];`;

export const COORD_ESTADO = String.raw`
const base = JSON.parse(JSON.stringify($('__PREV__').first().json));
const anterior = base.estado['__ETAPA__'];
// Etapa pulada nesta rodada mantém a entrega salva da rodada anterior (não apaga a copy aprovada, por exemplo)
if ($json.pulada === true && anterior && anterior.de_rodada_anterior) base.estado['__ETAPA__'] = Object.assign({}, anterior, { seguir: true, motivo_nesta_rodada: $json.motivo });
else base.estado['__ETAPA__'] = $json;
return [{ json: base }];`;

export const COORD_SALVAR = String.raw`
// Grava o estado da rodada para a próxima (sem o plano do coordenador, que é refeito a cada rodada)
const p = $('Prazos e resumo').first().json;
const ETAPAS = ['radar', 'headline', 'construtor', 'funil', 'claquete', 'revisor', 'trafego'];
const guardar = { salvo_em: new Date().toISOString() };
for (const k of ETAPAS) if (p.estado[k]) { guardar[k] = Object.assign({}, p.estado[k]); delete guardar[k].de_rodada_anterior; }
return [{ json: { texto: JSON.stringify(guardar, null, 2), arquivo: $('Estado inicial').first().json.arquivo_estado } }];`;

export const COORD_PROGRESSO = String.raw`
const p = $('Prazos e resumo').first().json;
const h = p.estado.headline;
let texto = $json.output;
if (!texto) texto = '(relatório do modelo indisponível)\n' + p.prazos.map(l => l.n + '. ' + l.agente + ': ' + l.status + (l.motivo ? ' (' + l.motivo + ')' : '')).join('\n');
if (h && h.saida_hash) texto += '\n\nVersão da copy: ' + h.saida_hash + (p.config.copy_aprovada_hash === h.saida_hash ? ' (é a aprovada)' : ' (para aprovar esta versão, o Arthur confere a copy e o Italo põe este código em copy_aprovada_hash e copy_aprovada: true)');
return [{ json: { progresso: texto, prazos: p.prazos, estado: p.estado } }];`;

export const COORD_PRAZOS = String.raw`
const { config, estado } = $json;
const nomes = { radar: 'Radar', headline: 'Headline Killer', construtor: 'Construtor', funil: 'Funil', claquete: 'Claquete', revisor: 'Revisor', trafego: 'Tráfego' };
const agora = new Date();
const linhas = Object.keys(nomes).map((k, i) => {
  const s = estado[k];
  const status = !s ? 'não começou nesta rodada' : s.pulada ? 'pulada (fora de etapas_ativas)' : s.aprovado ? 'aprovado' : s.bloqueado ? 'bloqueado' : 'reprovado pelo supervisor/verificações';
  const prazo = (config.prazos || {})[k] || null;
  const atrasado = prazo && !(s && s.aprovado) ? new Date(prazo + 'T23:59:59-03:00') < agora : false;
  return { n: i + 1, agente: nomes[k], status, prazo, atrasado, motivo: s ? (s.motivo || (s.falhas_automaticas || []).join(', ') || null) : null };
});
const resumo = {};
for (const k of Object.keys(nomes)) if (estado[k]) {
  const s = estado[k];
  resumo[k] = { aprovado: s.aprovado, bloqueado: s.bloqueado, motivo: s.motivo, falhas: s.falhas_automaticas, avisos: s.avisos, supervisor: s.supervisor, versao: s.saida_hash || null, de_rodada_anterior: !!s.de_rodada_anterior };
}
return [{ json: { config, estado, prazos: linhas, resumo } }];`;

export const CONFIG_PADRAO = String.raw`
// ⚙️ CONFIGURAÇÃO DA RODADA — edite aqui e clique em "Execute workflow".
// Campos vazios bloqueiam as etapas que dependem deles (o relatório diz o que falta).
return [{ json: {
  // País de destino (ISO-2). O projeto começou por Portugal; troque se quiser outro país.
  pais_origem: 'BR',
  pais_destino: 'PT',
  nome_pais: 'Portugal',
  idioma: 'pt-PT',
  moeda: 'EUR',

  // Etapas que rodam nesta rodada (tire as que não quer repetir).
  etapas_ativas: ['radar', 'headline', 'construtor', 'funil', 'claquete', 'revisor', 'trafego'],

  // RADAR — termos para buscar concorrência no destino e ofertas candidatas do Brasil.
  // A API da Meta não devolve anúncios comerciais do Brasil: os números BR vêm dos prints (senão ficam "não verificado").
  termos_busca: ['desafio pilates', 'pilates em casa', 'pilates mulheres 50'],
  ofertas_br: [
    { nome: 'Desafio Pilates em Casa 50+', page_id_br: '2016271568674266', url_pagina: 'https://pilates.laystrancoso.com/', preco_br: 'R$ 29,90',
      anuncios_ativos_br: null, anuncio_mais_antigo_br: null, print_br: null }
  ],

  // HEADLINE KILLER — oferta escolhida pelo dono.
  oferta_escolhida: { nome: 'Desafio Pilates em Casa 50+', slug: 'pilates50-pt', url_pagina_original: 'https://pilates.laystrancoso.com/' },

  // Aprovações do dono (só você muda isto).
  copy_aprovada: false,      // libera Construtor e Claquete (junto com copy_aprovada_hash)
  copy_aprovada_hash: '',    // versão aprovada da copy (ex.: 'v1a2b3c4d', sai no relatório). Congela a copy: o Headline Killer não gera de novo
  preco_aprovado: '',        // ex.: '14,90 €' — libera o Funil
  entregaveis_confirmados: [],

  // CONSTRUTOR / PIXEL
  pixel_id: '',
  pasta_saida: 'C:\\Users\\italo\\Downloads\\claude\\canal-dark-n8n\\data\\direct-response',
  url_pagina_publicada: '',
  url_privacidade: '',
  url_termos: '',

  // FUNIL (Hotmart)
  hotmart_product_id: '',
  hotmart_checkout_url: '',

  // TRÁFEGO (Meta Ads) — campanhas sempre PAUSADAS
  ad_account_id: '',         // formato act_1234567890
  campanha_nome: '',         // vazio = 'DR | <oferta> | <país>'. É pelo nome que o fluxo evita duplicar campanha
  orcamento_diario_centavos: 1000,   // 10,00 na moeda da conta
  publico: 'mulheres 50+ em Portugal',

  // CLAQUETE
  modelo_imagem: 'grok-2-image',

  // Prazos por agente (AAAA-MM-DD)
  prazos: { radar: '', headline: '', construtor: '', funil: '', claquete: '', revisor: '', trafego: '' },

  graph_version: 'v23.0'
} }];`;

// ---------------- 99 ERROS ----------------
export const ERROS_ALERTA = String.raw`
const ex = $json.execution || {};
const wf = $json.workflow || {};
const err = ex.error || {};
const quando = new Date().toISOString();
const msg = String(err.message || err.description || 'sem mensagem').slice(0, 800);
const texto = ['⚠️ Erro no fluxo Direct Response',
  'Workflow: ' + (wf.name || '?'),
  'Nó: ' + (ex.lastNodeExecuted || (err.node && err.node.name) || '?'),
  'Erro: ' + msg,
  'Execução: ' + (ex.url || ex.id || '?'),
  'Quando: ' + quando].join('\n');
const nome = 'erro-' + quando.replace(/[:.]/g, '-') + '.json';
const registro = JSON.stringify({ quando, workflow: wf.name || null, workflow_id: wf.id || null, no: ex.lastNodeExecuted || null, erro: msg, execucao: ex.url || ex.id || null, modo: ex.mode || null }, null, 2);
return [{ json: { texto, registro, nome_arquivo: nome, arquivo: '__PASTA__' + '\\' + nome } }];`;
