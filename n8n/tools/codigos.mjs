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
// "de € 29,90 por", "de 29,90 € por" (formato de Portugal) e "de 29,90 por"
const PRECO_RISCADO = /(<s>|<del>|line-through|\bde\s*:?\s*(R\$|€|EUR|US\$|\$)\s?\d[\d.,]*\s*(por|para|apenas|só)\b|\bde\s*:?\s*\d+[.,]\d{2}\s*(€|EUR|euros?|R\$|reais)?\s*(por|para|apenas|só)\b)/i;
function hashTexto(t) {
  // FNV-1a 32 bits: identifica a versão de uma entrega (ex.: a copy aprovada)
  let h = 0x811c9dc5; const s = String(t);
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return 'v' + h.toString(16).padStart(8, '0');
}
// Ampliada com os casos do G-06 (H-20261127-grok-05): "Perca 10 kg", "perda de 10 kg", "Elimine 5 quilos", "Cure", "Só hoje", "Últimas 10 vagas", "antes/depois"
const CLAIMS_SAUDE = /(antes\s*(e|\/)\s*depois|\b(perd(a|e|er)|perca|elimin(e|a|ar)|emagre[cç](a|e|er))\s+(de\s+)?(até\s+)?\d+([.,]\d+)?\s*(kg|quilos)|\bemagre[cç]a\s+\d|\bcur(a|ar|ado|ada|e|em)\b|resultado\s+garantido|últimas\s+(\d+\s+)?vagas|\bsó\s+hoje\b)/i;
// Marcadores que não podem sobrar na página publicada
const MARCADOR_PENDENTE = /\[[A-ZÇÃÕÁÉÍÓÚÊÂÔ][A-ZÇÃÕÁÉÍÓÚÊÂÔ \-]{2,}\]|\{\{[^}]+\}\}/;
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
  motivo: p.congelada ? 'entrega aprovada congelada (' + p.versao + '); não foi gerada de novo' : p.pulada ? 'etapa fora de etapas_ativas nesta rodada' : 'faltando: ' + p.faltando.join('; '),
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
const v = cfg.graph_version || 'v26.0';
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
  dados: { oferta: cfg.oferta_escolhida, idioma_destino: cfg.idioma, pais_destino: cfg.nome_pais, texto_da_pagina_original: texto, riscos_detectados_na_original: riscos,
    // decisões do dono (vazio = não decidido: o agente usa marcador, nunca inventa)
    decisoes: Object.assign({}, cfg.decisoes || {}, { preco_aprovado: cfg.preco_aprovado || '', entregaveis_confirmados: cfg.entregaveis_confirmados || [] }) },
  verificacoes: { pagina_original_baixada: texto.length > 500 },
  avisos: {}
} }];`;

export const HEADLINE_POS = String.raw`
${UTIL}
const cfg = $('Entrada').first().json.config;
const saida = parseJSON($json.output);
// Só o texto que vai para o público: removido_por_risco e pendencias_do_dono ficam de fora (citam o que foi tirado)
const txt = JSON.stringify({ pagina: saida.pagina, headlines: saida.headlines, roteiros_video: saida.roteiros_video, briefings_imagem: saida.briefings_imagem });
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
const UTM = '<!-- dr-utm: repassa utm_*, fbclid, src/sck e xcod para os links de checkout -->\n<script id="dr-utm">\n(function(){var q=new URLSearchParams(location.search);var keep=["utm_source","utm_medium","utm_campaign","utm_content","utm_term","fbclid","src","sck","xcod"];var p=new URLSearchParams();keep.forEach(function(k){if(q.get(k))p.set(k,q.get(k));});if(!p.get("src")&&q.get("utm_source"))p.set("src",q.get("utm_source"));if(!p.get("sck")){var s=[q.get("utm_source"),q.get("utm_campaign"),q.get("utm_content")].filter(Boolean).join("|");if(s)p.set("sck",s);}if(![...p.keys()].length)return;document.querySelectorAll("a.cta,a[href*=\'hotmart\'],a[href*=\'pay.\']").forEach(function(a){try{var u=new URL(a.href);p.forEach(function(v,k){if(!u.searchParams.get(k))u.searchParams.set(k,v);});a.href=u.toString();}catch(e){}});})();\n</script>\n';
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
const alvo = $('URL da página').first().json;
const pag = $('Página publicada · baixar').first().json;
const px = $('Pixel · último disparo').first().json;
const htmlNoAr = typeof pag.body === 'string' ? pag.body : (typeof pag.data === 'string' ? pag.data : '');
const pixel = String(cfg.pixel_id || '');
const reInit = new RegExp("fbq\\(\\s*['\"]init['\"]\\s*,\\s*['\"]" + pixel + "['\"]");
const ultimo = px && px.last_fired_time ? px.last_fired_time : null;
const recente = ultimo ? (Date.now() - new Date(ultimo).getTime()) < 7 * 24 * 3600 * 1000 : false;
return [{ json: {
  saida: Object.assign({}, montado.saida, { arquivo: montado.arquivo, html: montado.html, url_publicada: alvo.url || null, netlify: alvo.netlify, pixel_ultimo_disparo: ultimo }),
  verificacoes: Object.assign({}, montado.verificacoes, alvo.netlify ? { netlify_publicou: alvo.netlify.publicou } : {}, {
    pagina_publicada_no_ar: !!alvo.url && pag.statusCode === 200,
    pixel_certo_na_pagina_publicada: pixel.length > 5 && reInit.test(htmlNoAr),
    pageview_na_pagina_publicada: /fbq\(\s*['"]track['"]\s*,\s*['"]PageView['"]/.test(htmlNoAr),
    utm_na_pagina_publicada: htmlNoAr.includes('dr-utm'),
    pixel_disparou_nos_ultimos_7_dias: recente
  }),
  avisos: { como_publicar: alvo.netlify ? 'Página publicada pelo Netlify em ' + (alvo.url || '?') + '. Abra a página uma vez no navegador para o PageView disparar e rode de novo.' : 'Preencha netlify_site_id (o fluxo publica sozinho) ou suba o arquivo ' + montado.arquivo + ' no seu domínio e preencha url_pagina_publicada. Abra a página uma vez no navegador para o PageView disparar e rode de novo.' }
} }];`;

// URL da página: a da configuração ou a que o Netlify devolveu (Construtor)
export const URL_DA_PAGINA = String.raw`
const ran = n => { try { return $(n).isExecuted === true; } catch (e) { return false; } };
const cfg = $('Entrada').first().json.config;
const pub = ran('Netlify · publicar') ? $('Netlify · publicar').first().json : null;
const conf = ran('Netlify · conferir deploy') ? $('Netlify · conferir deploy').first().json : null;
const d = Object.assign({}, pub || {}, conf && conf.id ? conf : {});
const url = String(cfg.url_pagina_publicada || d.ssl_url || d.url || '');
return [{ json: { url, netlify: pub ? { publicou: !!d.id && !pub.error && d.state !== 'error', deploy_id: d.id || null, estado: d.state || null, url_site: d.ssl_url || d.url || null,
  erro: pub.error ? String(pub.error.message || JSON.stringify(pub.error)).slice(0, 200) : (d.error_message || null) } : null } }];`;

// Preparar deploy: o HTML final vira index.html dentro do zip
export const PREPARAR_DEPLOY = String.raw`
return [{ json: { html: $('__ORIGEM__').first().json.html } }];`;

// ---------------- FUNIL ----------------
export const FUNIL_DADOS = String.raw`
const cfg = $('Entrada').first().json.config;
const tok = $('Hotmart · token').first().json;
const prod = $('Hotmart · produtos').first().json;
const ofs = $('Hotmart · ofertas').first().json;
const chk = $('Checkout · conferir').first().json;
const lista = Array.isArray(prod.items) ? prod.items : (Array.isArray(prod.data) ? prod.data : []);
const alvo = String(cfg.hotmart_product_id || '');
const achado = lista.find(p => String(p.id) === alvo || String(p.ucode) === alvo) || null;
const corpo = typeof chk.body === 'string' ? chk.body : '';
const preco = String(cfg.preco_aprovado || '').replace(/[^\d,\.]/g, '');
// "14,90 €" ou "1.234,90" -> 14.9 / 1234.9 (vírgula decimal, como em Portugal e no Brasil)
const precoNum = preco ? Number(preco.replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.')) : NaN;
const ofertas = Array.isArray(ofs.items) ? ofs.items : (Array.isArray(ofs.data) ? ofs.data : []);
const principal = ofertas.find(o => o && o.is_main_offer === true) || (ofertas.length === 1 ? ofertas[0] : null);
const valor = principal && principal.price ? Number(principal.price.value) : NaN;
const moedaOferta = principal && principal.price ? String(principal.price.currency_code || '') : '';
return [{ json: {
  dados: {
    pais: cfg.nome_pais, moeda: cfg.moeda, preco_aprovado: cfg.preco_aprovado,
    produto_hotmart: achado, produtos_na_conta: lista.slice(0, 20).map(p => ({ id: p.id, nome: p.name, status: p.status })),
    oferta_principal: principal ? { codigo: principal.code || null, valor: isNaN(valor) ? null : valor, moeda: moedaOferta, pagamento: principal.payment_mode || null, conversao_de_moeda: principal.is_currency_conversion_enabled === true, link_direto: principal.direct_offer_link_for_creator || null } : null,
    checkout_url: cfg.hotmart_checkout_url, checkout_status_http: chk.statusCode || null,
    entregaveis_confirmados: cfg.entregaveis_confirmados || [], oferta: cfg.oferta_escolhida
  },
  verificacoes: {
    hotmart_api_autenticou: !!tok.access_token,
    produto_existe_na_hotmart: !!achado,
    oferta_principal_encontrada: !!principal,
    preco_da_oferta_igual_ao_aprovado: !isNaN(precoNum) && !isNaN(valor) && Math.abs(valor - precoNum) < 0.005,
    moeda_da_oferta_igual_a_config: !!moedaOferta && moedaOferta === String(cfg.moeda || ''),
    checkout_no_ar: chk.statusCode === 200
  },
  avisos: {
    pagamento_da_oferta: principal ? (['UNIQUE_PAYMENT', 'PAY_IN_FULL'].includes(principal.payment_mode) ? 'pagamento único' : 'a oferta principal não é pagamento único (' + principal.payment_mode + '): confira se é o formato decidido') : '',
    conversao_de_moeda: principal && principal.is_currency_conversion_enabled === true ? 'a Hotmart converte a moeda para compradores de fora: o preço mostrado pode variar' : '',
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
const ran = n => { try { return $(n).isExecuted === true; } catch (e) { return false; } };
const l = $('Link do checkout nos botões').first().json;
const gravou = !$('Regravar index.html').first().json.error;
const extra = { pagina_regravada_no_disco: gravou };
let netlify = null;
if (ran('Netlify · publicar')) {
  const pub = $('Netlify · publicar').first().json;
  const conf = ran('Netlify · conferir deploy') ? $('Netlify · conferir deploy').first().json : {};
  const d = Object.assign({}, pub, conf && conf.id ? conf : {});
  netlify = { deploy_id: d.id || null, estado: d.state || null, url_site: d.ssl_url || d.url || null };
  extra.netlify_republicou_com_checkout = !!d.id && !pub.error && d.state !== 'error';
}
return [{ json: { saida: Object.assign({}, l.saida, { html: l.html, arquivo: l.arquivo, netlify }), verificacoes: Object.assign({}, l.verificacoes, extra) } }];`;

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
return imgs.slice(0, 6).map(i => ({ json: { id: i.id, prompt: [i.prompt, i.texto_na_imagem ? 'Text on image: "' + i.texto_na_imagem + '"' : ''].filter(Boolean).join('. '), formato: i.formato, texto_na_imagem: i.texto_na_imagem || '' } }));`;

// Cada imagem (base64 da xAI) vira um arquivo <pasta_saida>\<slug>\criativos\<id>-<versão>.jpg
// A versão no nome muda quando a imagem muda: a aprovação (criativos_aprovados_hash) vale só para estas imagens.
export const CLAQUETE_ARQUIVOS = String.raw`
${UTIL}
const cfg = $('Entrada').first().json.config;
const pedidos = $('Imagens → itens').all().map(i => i.json);
const slug = String(cfg.oferta_escolhida && cfg.oferta_escolhida.slug || 'oferta').replace(/[^a-z0-9-]/gi, '-');
const pasta = String(cfg.pasta_saida || '').replace(/[\\/]+$/, '') + '\\' + slug + '\\criativos';
return $input.all().map((it, i) => {
  const r = it.json || {};
  const p = pedidos[i] || {};
  const d = Array.isArray(r.data) ? r.data[0] : null;
  const b64 = d && d.b64_json ? String(d.b64_json).replace(/^data:[^,]+,/, '') : '';
  const base = { id: p.id || ('img' + (i + 1)), formato: p.formato || null, texto_na_imagem: p.texto_na_imagem || '' };
  if (!b64) return { json: Object.assign(base, { arquivo: null, versao: null, erro: r.error ? String(r.error.message || JSON.stringify(r.error)).slice(0, 200) : 'a xAI não devolveu imagem' }) };
  const versao = hashTexto(b64);
  const nome = String(base.id).replace(/[^a-z0-9-]/gi, '-') + '-' + versao + '.jpg';
  return { json: Object.assign(base, { arquivo: pasta + '\\' + nome, versao, erro: null }),
    binary: { data: { data: b64, mimeType: 'image/jpeg', fileName: nome, fileExtension: 'jpg' } } };
});`;

export const CLAQUETE_POS = String.raw`
${UTIL}
const plano = parseJSON($('Agente · Claquete').first().json.output);
const arquivos = $('Imagens → arquivos').all().map(i => i.json);
const gravacao = $input.all().map(i => i.json || {});
const geradas = arquivos.map((a, i) => {
  const falhou = !!(gravacao[i] && gravacao[i].error);
  return { id: a.id, arquivo: a.arquivo && !falhou ? a.arquivo : null, versao: a.versao, formato: a.formato, texto_na_imagem: a.texto_na_imagem,
    erro: a.erro || (falhou ? 'não gravou no disco: ' + String(gravacao[i].error.message || gravacao[i].error).slice(0, 160) : null) };
});
return [{ json: { saida: { plano, imagens_geradas: geradas, pasta: geradas[0] && geradas[0].arquivo ? geradas[0].arquivo.replace(/\\[^\\]+$/, '') : null }, verificacoes: {
  saida_do_agente_em_json: !plano.erro_parse,
  imagens_geradas_e_gravadas: geradas.length > 0 && geradas.every(g => !!g.arquivo),
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
const ancoras = [...html.matchAll(/<a\b[^>]*>/gi)].map(m => m[0]);
const hrefDe = a => (a.match(/href=["']([^"']+)["']/i) || [])[1] || '';
// todos os botões a.cta + qualquer link que pareça checkout
const linksCheckout = ancoras.filter(a => /class=["'][^"']*\bcta\b/i.test(a) || /hotmart|pay\.|checkout/i.test(hrefDe(a))).map(hrefDe);
const urlChk = String(cfg.hotmart_checkout_url || '');
const precoNum = String(cfg.preco_aprovado || '').replace(/[^\d,\.]/g, '');
const rePreco = precoNum ? new RegExp('(^|[^\\d.,])' + precoNum.replace(/[.,]/g, m => '\\' + m) + '(?![\\d])') : null;
const idi = String(cfg.idioma || '').toLowerCase();
const lang = (html.match(/<html[^>]*\blang=["']([^"']+)["']/i) || [])[1] || '';
const texto = textoDoHtml(html);
const imgs = (est.claquete && est.claquete.saida && est.claquete.saida.imagens_geradas) || [];
const checklist = {
  '1_pagina_no_ar': pag.statusCode === 200,
  '2_pixel_certo_e_pageview': pixel.length > 5 && reInit.test(html) && /fbq\(\s*['"]track['"]\s*,\s*['"]PageView['"]/.test(html),
  '3_pixel_ja_disparou': !!(px && px.last_fired_time),
  '4_links_de_checkout_certos_e_no_ar': linksCheckout.length > 0 && linksCheckout.every(h => h.split('?')[0] === urlChk.split('?')[0]) && !html.includes('{{CHECKOUT_URL}}') && chk.statusCode === 200,
  '5_preco_aprovado_e_sem_preco_riscado': !!rePreco && rePreco.test(texto) && !PRECO_RISCADO.test(html),
  '6_idioma_do_destino': (idi.includes('-') ? lang.toLowerCase() === idi : lang.toLowerCase().split('-')[0] === idi) && (idi !== 'pt-pt' || !/(^|[^\p{L}])voc[eê]s?(?![\p{L}])/iu.test(texto)),
  '7_criativos_prontos_e_aprovados': imgs.length > 0 && imgs.every(i => !!(i.arquivo || i.url)) && cfg.criativos_aprovados === true && !!cfg.criativos_aprovados_hash && !!est.claquete && est.claquete.saida_hash === cfg.criativos_aprovados_hash,
  '8_sem_marcadores_pendentes': !!html && !MARCADOR_PENDENTE.test(html)
};
return [{ json: {
  dados: { checklist, decisoes_usadas: (est.headline && est.headline.saida && est.headline.saida.decisoes_usadas) || null, decisoes: cfg.decisoes || {}, url: cfg.url_pagina_publicada, lang_da_pagina: lang, links_de_checkout: linksCheckout, preco_aprovado: cfg.preco_aprovado, texto_da_pagina: texto.slice(0, 20000), criativos: imgs },
  verificacoes: checklist, avisos: {}
} }];`;

export const REVISOR_POS = String.raw`
${UTIL}
const saida = parseJSON($json.output);
return [{ json: { saida, verificacoes: { saida_do_agente_em_json: !saida.erro_parse, revisor_aprovou: saida.aprovado === true && (!saida.erros || saida.erros.length === 0) } } }];`;

// ---------------- TRÁFEGO ----------------
export const TRAFEGO_DADOS = String.raw`
const e = $('Entrada').first().json;
const cfg = e.config, est = e.estado || {};
const headlines = (est.headline && est.headline.saida && est.headline.saida.headlines) || [];
const imgs = ((est.claquete && est.claquete.saida && est.claquete.saida.imagens_geradas) || []).filter(i => i && i.arquivo);
return [{ json: { dados: {
  pais: cfg.pais_destino, oferta: cfg.oferta_escolhida, url_pagina: cfg.url_pagina_publicada,
  orcamento_diario_centavos: cfg.orcamento_diario_centavos, publico_sugerido: cfg.publico || null,
  headlines_aprovadas: headlines.map((h, i) => ({ indice: i, texto: h })),
  imagens_aprovadas: imgs.map(i => ({ id: i.id, texto_na_imagem: i.texto_na_imagem || '' }))
}, verificacoes: { tem_headlines_aprovadas: headlines.length > 0, tem_imagens_aprovadas: imgs.length > 0 }, avisos: {} } }];`;

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
  // DSA: conjuntos que miram a UE exigem pagador e beneficiário (G-02, P-14)
  dsa_payor: cfg.dsa_pagador || undefined, dsa_beneficiary: cfg.dsa_beneficiario || undefined,
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

// Imagens aprovadas da Claquete (arquivos no disco) -> uma por item, para subir na conta de anúncios
export const TRAFEGO_CRIATIVOS_ARQUIVOS = String.raw`
const est = $('Entrada').first().json.estado || {};
const imgs = ((est.claquete && est.claquete.saida && est.claquete.saida.imagens_geradas) || []).filter(i => i && i.arquivo).slice(0, 6);
if (!imgs.length) return [{ json: { id: null, arquivo: '', sem_imagens: true } }];
return imgs.map(i => ({ json: { id: i.id, arquivo: i.arquivo, versao: i.versao || null } }));`;

// Um criativo por imagem. Texto: SÓ headlines aprovadas (o modelo escolhe o índice, não escreve texto novo).
export const TRAFEGO_CRIATIVOS = String.raw`
${UTIL}
const e = $('Entrada').first().json;
const cfg = e.config, est = e.estado || {};
const plano = $('Payload PAUSADO').first().json.plano || {};
const arquivos = $('Criativos → arquivos').all().map(i => i.json);
const subidas = $input.all().map(i => i.json || {});
const headlines = (est.headline && est.headline.saida && est.headline.saida.headlines) || [];
const url = String(cfg.url_pagina_publicada || '');
const escolhas = Array.isArray(plano.anuncios) ? plano.anuncios : [];
const out = [];
arquivos.forEach((a, i) => {
  const r = subidas[i] || {};
  const img = r.images && typeof r.images === 'object' ? Object.values(r.images)[0] : null;
  if (!a.id || !img || !img.hash) return;
  const esc = escolhas.find(x => x && x.imagem_id === a.id) || {};
  const k = Number.isInteger(esc.headline_indice) && headlines[esc.headline_indice] ? esc.headline_indice : (i % Math.max(headlines.length, 1));
  const texto = String(headlines[k] || '');
  const titulo = String(headlines[(k + 1) % Math.max(headlines.length, 1)] || texto);
  if (CLAIMS_SAUDE.test(texto + ' ' + titulo) || PRECO_RISCADO.test(texto + ' ' + titulo)) throw new Error('Trava do Tráfego: texto do anúncio com claim de saúde, escassez ou preço riscado. Nada foi criado.');
  out.push({ json: { imagem_id: a.id, image_hash: img.hash, criativo: {
    name: $('Payload PAUSADO').first().json.campanha.name + ' | ' + a.id + (a.versao ? '-' + a.versao : ''),
    object_story_spec: { page_id: String(cfg.facebook_page_id), link_data: {
      link: url, message: texto, name: titulo, image_hash: img.hash,
      call_to_action: { type: cfg.cta_anuncio || 'LEARN_MORE', value: { link: url } } } },
    url_tags: 'utm_source=meta&utm_medium=paid&utm_campaign={{campaign.name}}&utm_content={{ad.id}}&xcod={{ad.id}}'
  } } });
});
if (!out.length) return [{ json: { sem_criativos: true, criativo: null, erros_upload: subidas.filter(s => s.error).map(s => String(s.error.message || JSON.stringify(s.error)).slice(0, 200)) } }];
return out;`;

// Anúncios: cada conjunto criado x cada criativo criado, sempre PAUSED
export const TRAFEGO_ANUNCIOS = String.raw`
const cfg = $('Entrada').first().json.config;
const conjuntos = $('Meta · criar conjunto (PAUSED)').all().map(i => i.json).filter(c => c && c.id);
const pedidos = $('Anúncios → criativos').all().map(i => i.json);
const criados = $input.all().map(i => i.json || {});
const criativos = pedidos.map((p, i) => ({ imagem_id: p.imagem_id, id: criados[i] && criados[i].id })).filter(c => c.imagem_id && c.id);
const nomeBase = $('Payload PAUSADO').first().json.campanha.name;
const out = [];
conjuntos.forEach((c, ci) => criativos.forEach(cr => out.push({ json: { body: Object.assign({
  name: nomeBase + ' | conjunto ' + (ci + 1) + ' | ' + cr.imagem_id,
  adset_id: c.id, creative: { creative_id: cr.id }, status: 'PAUSED'
}, cfg.dominio_conversao ? { conversion_domain: String(cfg.dominio_conversao) } : {}) } })));
const tudo = JSON.stringify(out);
if (/"status"\s*:\s*"(?!PAUSED)/.test(tudo) || /ACTIVE/.test(tudo)) throw new Error('Trava do Tráfego: anúncio com status diferente de PAUSED. Nada foi enviado.');
if (!out.length) return [{ json: { sem_anuncios: true, body: null } }];
return out;`;

export const TRAFEGO_IDS = String.raw`
const ran = n => { try { return $(n).isExecuted === true; } catch (e) { return false; } };
const camp = $('Meta · criar campanha (PAUSED)').first().json;
const ids = [];
if (camp && camp.id) ids.push({ json: { id: camp.id, tipo: 'campanha' } });
for (const r of $('Meta · criar conjunto (PAUSED)').all()) if (r.json && r.json.id) ids.push({ json: { id: r.json.id, tipo: 'conjunto' } });
if (ran('Meta · criar anúncio (PAUSED)')) for (const r of $('Meta · criar anúncio (PAUSED)').all()) if (r.json && r.json.id) ids.push({ json: { id: r.json.id, tipo: 'anuncio' } });
if (!ids.length) return [{ json: { id: 'nenhum', tipo: 'nenhum' } }];
return ids;`;

export const TRAFEGO_EXISTENTE = String.raw`
// Compara o nome no código (o filtro por nome da Graph API não está documentado; G-02).
// Se a busca falhar, PARA: sem saber se a campanha existe, criar poderia duplicar.
const nome = $('Payload PAUSADO').first().json.campanha.name;
const r = $json || {};
if (r.error || !Array.isArray(r.data)) throw new Error('Tráfego: a busca de campanhas falhou (' + String((r.error && r.error.message) || 'resposta sem data').slice(0, 200) + '). Nada foi criado.');
const achada = r.data.find(c => c && c.name === nome) || null;
if (!achada && r.paging && r.paging.next) throw new Error('Tráfego: a conta tem mais campanhas do que uma página da busca e a campanha "' + nome + '" não apareceu na primeira. Nada foi criado; confira no Gerenciador.');
return [{ json: { existe: !!achada, campanha: achada } }];`;

export const TRAFEGO_REUSAR = String.raw`
// A campanha com este nome já existe: não cria nada de novo e NÃO mexe no status (o Arthur pode já ter ativado).
const camp = $('Campanha existente').first().json.campanha;
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
    avisos: { reutilizada: 'A campanha já existia com este nome: nada foi criado nem alterado nesta rodada (sem duplicar). Os anúncios dela não são conferidos aqui; veja no Gerenciador. Para subir de novo, troque campanha_nome.',
      ativos: ativos.length ? 'Itens já ativos (ativados fora do fluxo): ' + ativos.map(a => a.id + ' ' + a.status).join(', ') : '' }
  } }];
}
const camp = $('Meta · criar campanha (PAUSED)').first().json;
const conj = $('Meta · criar conjunto (PAUSED)').all().map(i => i.json);
const ads = ran('Meta · criar anúncio (PAUSED)') ? $('Meta · criar anúncio (PAUSED)').all().map(i => i.json || {}) : [];
const st = $input.all().map(i => i.json).filter(s => s && s.id);
// Pausado = status PAUSED e nunca entregando. Anúncio novo fica em PENDING_REVIEW / IN_PROCESS: isso não é ativo.
const naoPausados = st.filter(s => s.status !== 'PAUSED' || s.effective_status === 'ACTIVE');
const erro = x => x && x.error ? String(x.error.message || JSON.stringify(x.error)).slice(0, 200) : null;
return [{ json: {
  saida: { plano, campanha: camp && camp.id ? { id: camp.id } : { erro: erro(camp) || 'não criada' },
    conjuntos: conj.map(c => c.id ? { id: c.id } : { erro: erro(c) || 'não criado' }),
    anuncios: ads.map(a => a.id ? { id: a.id } : { erro: erro(a) || 'não criado' }), status_conferido: st },
  verificacoes: {
    campanha_criada: !!(camp && camp.id),
    conjuntos_criados: conj.length > 0 && conj.every(c => !!c.id),
    anuncios_criados: ads.length > 0 && ads.every(a => !!a.id),
    tudo_pausado_conferido_na_api: st.length > 0 && naoPausados.length === 0
  },
  avisos: { quem_ativa: 'Tudo ficou PAUSADO. Quem ativa é o Arthur, no Gerenciador de Anúncios.' }
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
const u = estado.construtor && estado.construtor.saida && estado.construtor.saida.url_publicada;
const cfg = Object.assign({}, config, !config.url_pagina_publicada && u ? { url_pagina_publicada: u } : {});
return [{ json: { config: cfg, estado, arquivo_estado: $('Arquivo de estado').first().json.arquivo_estado } }];`;

export const COORD_ESTADO = String.raw`
const base = JSON.parse(JSON.stringify($('__PREV__').first().json));
const anterior = base.estado['__ETAPA__'];
// Etapa pulada nesta rodada mantém a entrega salva da rodada anterior (não apaga a copy aprovada, por exemplo)
if ($json.pulada === true && anterior && anterior.de_rodada_anterior) base.estado['__ETAPA__'] = Object.assign({}, anterior, { seguir: true, motivo_nesta_rodada: $json.motivo });
else base.estado['__ETAPA__'] = $json;
// Página publicada pelo fluxo (Netlify): o endereço vale para Revisor e Tráfego sem editar a configuração
const u = base.estado.construtor && base.estado.construtor.saida && base.estado.construtor.saida.url_publicada;
if (!base.config.url_pagina_publicada && u) base.config.url_pagina_publicada = u;
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
const cq = p.estado.claquete;
let texto = $json.output;
if (!texto) texto = '(relatório do modelo indisponível)\n' + p.prazos.map(l => l.n + '. ' + l.agente + ': ' + l.status + (l.motivo ? ' (' + l.motivo + ')' : '')).join('\n');
if (h && h.saida_hash) texto += '\n\nVersão da copy: ' + h.saida_hash + (p.config.copy_aprovada_hash === h.saida_hash ? ' (é a aprovada)' : ' (para aprovar esta versão, o Arthur confere a copy e o Italo põe este código em copy_aprovada_hash e copy_aprovada: true)');
if (cq && cq.saida_hash && cq.saida && (cq.saida.imagens_geradas || []).length) texto += '\nVersão dos criativos: ' + cq.saida_hash + (p.config.criativos_aprovados_hash === cq.saida_hash ? ' (é a aprovada)' : ' (imagens em ' + (cq.saida.pasta || 'pasta_saida') + '; para aprovar, ponha este código em criativos_aprovados_hash e criativos_aprovados: true)');
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

  // Decisões do produto: ENTRADAS OPCIONAIS. O fluxo roda com tudo vazio; campo vazio vira marcador na página
  // (ex.: [GARANTIA A DEFINIR PELO PRODUTOR]) e o Revisor segura a página até ele ser preenchido. Nada é inventado.
  decisoes: {
    formato: '',
    garantia: { dias: null, texto_aprovado: '', renuncia_14_dias: null },
    instrutora: { assina: '', nome_autorizado: '', autorizacao_por_escrito: false },
    depoimentos_verificados: [],   // { texto, nome, autorizacao }
    numeros_confirmados: [],       // { frase, prova }
    bumps: [],                     // { nome, preco, entregavel }
    upsell: null,                  // { nome, preco, entregavel }
    aviso_saude: '',
    ortografia: ''
  },

  // Aprovações do dono (só você muda isto).
  copy_aprovada: false,      // libera Construtor e Claquete (junto com copy_aprovada_hash)
  copy_aprovada_hash: '',    // versão aprovada da copy (ex.: 'v1a2b3c4d', sai no relatório). Congela a copy: o Headline Killer não gera de novo
  preco_aprovado: '',        // ex.: '14,90 €' — libera o Funil (conferido contra a oferta principal na Hotmart)
  entregaveis_confirmados: [],
  criativos_aprovados: false,     // libera o Tráfego (junto com criativos_aprovados_hash)
  criativos_aprovados_hash: '',   // versão aprovada das imagens (sai no relatório). Congela os criativos: a Claquete não gera de novo

  // CONSTRUTOR / PIXEL
  pixel_id: '',
  pasta_saida: 'C:\\Users\\italo\\Downloads\\claude\\canal-dark-n8n\\data\\direct-response',
  netlify_site_id: '',       // preenchido = o fluxo publica a página no Netlify sozinho (credencial DR · Netlify)
  url_pagina_publicada: '',  // vazio + Netlify = usa o endereço do Netlify; preencha se usar domínio próprio
  url_privacidade: '',
  url_termos: '',

  // FUNIL (Hotmart)
  hotmart_product_id: '',
  hotmart_checkout_url: '',

  // TRÁFEGO (Meta Ads) — campanhas sempre PAUSADAS
  ad_account_id: '',         // formato act_1234567890
  facebook_page_id: '',      // página do Facebook que assina os anúncios
  dominio_conversao: '',     // opcional: domínio da página para o Meta (ex.: exemplo.pt)
  cta_anuncio: 'LEARN_MORE', // botão do anúncio (LEARN_MORE, SHOP_NOW...)
  campanha_nome: '',         // vazio = 'DR | <oferta> | <país>'. É pelo nome que o fluxo evita duplicar campanha
  dsa_pagador: '',           // UE: quem paga os anúncios (P-14). Obrigatório para anunciar em Portugal
  dsa_beneficiario: '',      // UE: quem se beneficia dos anúncios (P-14)
  orcamento_diario_centavos: 1000,   // 10,00 na moeda da conta
  publico: 'mulheres 50+ em Portugal',

  // CLAQUETE
  modelo_imagem: 'grok-2-image',

  // Prazos por agente (AAAA-MM-DD)
  prazos: { radar: '', headline: '', construtor: '', funil: '', claquete: '', revisor: '', trafego: '' },

  graph_version: 'v26.0'      // v23.0 expirou em 2026-06-09 (G-02)
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
