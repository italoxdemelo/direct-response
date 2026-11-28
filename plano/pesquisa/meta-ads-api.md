# Meta Marketing API: anúncios pausados e Ad Library (G-02)

**Tarefa:** G-02 de `plano/DIVISAO-TAREFAS.md` · **Entrada:** `H-20261127-grok-03` · **Autor:** italo — Grok
**Pesquisado em:** 2026-11-27 (America/Bahia) · **Fonte:** só a documentação oficial em <https://developers.facebook.com/> (páginas de referência, guia de `url_tags`, lista de versões, aviso de lançamento da v27.0, limites de taxa e referência da Ad Library API).
**Alimenta:** seções 6 (Radar) e 12 (Tráfego) de `plano/PLANO-DE-ACAO.md`, T-06 e T-07.

> **Limites desta pesquisa.** Nenhuma chamada foi feita: não há credencial (P-12). Os exemplos usam **marcadores** (`<AD_ACCOUNT_ID>`, `<PAGE_ID>` etc.) e valores fictícios. O que a documentação oficial não confirma está como **não verificado**, com o link de onde procurei.

## 1. Resposta curta

1. **A versão `v23.0` do plano está vencida.** A lista oficial de versões diz que a v23.0 expirou em **2026-06-09**; a v24.0 em **2026-11-10**; a v25.0 vai até **2027-02-23**; a v26.0 (2026-07-29) e a v27.0 (2026-11-04) estão sem data de expiração ("TBD"). O `config.graph_version` do plano vale `v23.0` (§3.1). **Troque antes do primeiro teste.** Sugestão: `v26.0`, ver seção 2.
2. **A sequência é esta:** `POST /act_<AD_ACCOUNT_ID>/adimages` (devolve o `hash`) → `POST /act_<AD_ACCOUNT_ID>/adcreatives` (com `object_story_spec.link_data`, `image_hash` e `url_tags`) → `POST /act_<AD_ACCOUNT_ID>/ads` (com `adset_id`, `creative` e `status=PAUSED`). Dá para ensaiar cada passo sem criar nada com `execution_options=["validate_only"]`.
3. **O `utm_content={{ad.id}}` deve ir em `url_tags` do criativo**, e não colado na URL de destino. O guia oficial diz que as macros (`{{ad.id}}`, `{{adset.id}}`, `{{campaign.id}}` e as de nome) ficam na posição do **valor** das etiquetas. O `{{ad.id}}` só é trocado pelo número quando o anúncio é exibido; antes disso, a conferência possível é ler `url_tags` no criativo.
4. **Achado grave para Portugal: o conjunto de anúncios exige `dsa_payor` e `dsa_beneficiary`.** Ad sets que miram a UE precisam informar quem paga e quem se beneficia do anúncio (Lei dos Serviços Digitais). Sem isso a API devolve erro de parâmetro. O payload do Tráfego (§12) **não tem esses campos**. Vira pergunta para o Arthur (P-14).
5. **O anúncio exige `conversion_domain`** quando a campanha compartilha dados com um pixel (nosso caso). É só o domínio de 1.º e 2.º nível (ex.: `exemplo.pt`), então depende de D-07 (domínio).
6. **Busca de campanha por nome: não encontrei filtro por nome nas páginas oficiais.** O caminho verificado é listar, paginar e comparar o nome no n8n (seção 5).
7. **A Ad Library API não dá anúncio comercial do Brasil.** Fora da UE só devolve anúncios sobre temas sociais, eleições e política. Portugal está na UE, então o Radar funciona para Portugal e **não** para o Brasil (seção 7).

## 2. Qual versão usar

Fonte: <https://developers.facebook.com/documentation/ads-commerce/marketing-api/marketing-api-changelog/versions.md> e o aviso <https://developers.facebook.com/blog/post/2026/11/04/introducing-graph-api-v27-and-marketing-api-v27/>.

| Versão | Lançada | Expira |
|---|---|---|
| v23.0 | 2025-05-29 | **2026-06-09 (já expirou)** |
| v24.0 | 2025-10-08 | 2026-11-10 (já expirou) |
| v25.0 | 2026-02-18 | 2027-02-23 |
| v26.0 | 2026-07-29 | sem data ("TBD") |
| v27.0 | 2026-11-04 | sem data ("TBD") |

1. A API tem o erro **2635** ("você está chamando uma versão descontinuada da Ads API") nas páginas de criação de criativo, anúncio e campanha. Ele é o sinal de que a versão venceu.
2. **Sugestão:** `v26.0`. Tem 4 meses de uso e as mudanças de padrão da v27.0 (alcance em outros aparelhos ligado por padrão em conjuntos de vendas que miram aparelhos específicos; vitrine de produto automática quando há catálogo) **não afetam** o nosso caso (sem catálogo, sem segmentação por aparelho). A v27.0 também serve; o que importa é parametrizar e **não deixar a versão fixa nos nós**. Quem decide é o Claude (C-06) com o Italo; não testei nenhuma das duas.
3. As páginas de referência mostram exemplos em v25.0 e v27.0 ao mesmo tempo; os campos que usamos são os mesmos em ambas, até onde as páginas permitem ver.
4. A mesma página anuncia "auto-upgrade" de versão em 2026-07-29. **Não verificado** como isso se comporta para chamadas com versão vencida (o erro 2635 existe); página: <https://developers.facebook.com/docs/graph-api/changelog/versions/>. Não conte com ele.

## 3. Antes de começar: o que precisa existir

| Item | O que a documentação diz | Quem fornece |
|---|---|---|
| `ad_account_id` | Formato `act_<número>` nos caminhos | Arthur/Italo (P-09), só no n8n |
| `page_id` | `object_story_spec.page_id`: a Página que assina o anúncio; "o usuário precisa ter papel de **Admin ou Editor** na Página" | Arthur (P-14) |
| `instagram_user_id` | Opcional em `object_story_spec`: a conta de Instagram que publica. **Não verificado** o que acontece com a posição do Instagram sem ele | Arthur (P-14) |
| Pixel | `promoted_object.pixel_id` no conjunto (já está no plano) | Arthur (P-09) |
| `conversion_domain` | Obrigatório para criar anúncio numa campanha que compartilha dados com um pixel. Só 1.º e 2.º nível (ex.: `exemplo.pt`) | vem de D-07 |
| `dsa_payor`, `dsa_beneficiary` | Obrigatórios no **conjunto** que mira a UE; texto de até 512 caracteres, exibido ao público | Arthur (P-14) |
| Token | Chamadas de Marketing API usam limites por conta de anúncios ("BUC"). Que **permissões e tipo de token** o app precisa (usuário de sistema, `ads_management`): **não verificado** nesta pesquisa | Italo (P-12) |
| Moeda da conta | `daily_budget` do conjunto é "na moeda da conta de anúncios" | Arthur (P-14) |

Páginas: <https://developers.facebook.com/docs/marketing-api/reference/ad-creative-object-story-spec/>, <https://developers.facebook.com/docs/marketing-api/reference/ad-campaign/> (conjuntos, DSA e orçamento) e <https://developers.facebook.com/docs/marketing-api/reference/adgroup/> (anúncios).

## 4. Passo a passo (tudo PAUSADO)

Base: `https://graph.facebook.com/<VERSÃO>/`. Em todas as chamadas, `access_token` como parâmetro ou header (nunca no Git).

### 4.1 Subir a imagem

Doc: <https://developers.facebook.com/docs/marketing-api/reference/ad-account/adimages/>

```bash
curl -X POST \
  -F 'bytes=<IMAGEM_EM_BASE64>' \
  -F 'access_token=<TOKEN>' \
  'https://graph.facebook.com/<VERSÃO>/act_<AD_ACCOUNT_ID>/adimages'
```

Resposta (a página só dá o tipo: um mapa de mapas com `hash`, `url`, `width`, `height`, `name` etc.; o formato abaixo é a minha leitura desse tipo, com valores fictícios. **Não verificado** qual chave de nome volta no mapa):

```json
{
  "images": {
    "bytes": {
      "hash": "0123456789abcdef0123456789abcdef",
      "url": "https://exemplo.invalid/imagem.jpg",
      "width": 1080,
      "height": 1080
    }
  }
}
```

1. O parâmetro documentado é `bytes` (imagem em Base64). Há também `copy_from` para copiar de outra conta pelo `hash`.
2. O que você guarda é o **`hash`**: ele entra no criativo (`image_hash`).
3. Imagens da xAI (Claquete) vêm por URL que pode expirar: baixe, converta para Base64 e suba antes (T-06). **Não verificado:** envio por arquivo (multipart) e limites de tamanho e formato; a página de imagens de anúncio (`.../creative/image-ads`) deu 404 na minha leitura. Procurar em <https://developers.facebook.com/docs/marketing-api/reference/ad-account/adimages/>.
4. Listar imagens: `GET /act_<AD_ACCOUNT_ID>/adimages` aceita `hashes`, `name`, `minwidth`, `minheight`. Útil para a idempotência (seção 5).

### 4.2 Criar o criativo (link da página + UTMs)

Doc: <https://developers.facebook.com/docs/marketing-api/reference/ad-account/adcreatives/> e <https://developers.facebook.com/docs/marketing-api/reference/ad-creative-link-data/>

```bash
curl -X POST \
  -F 'name=DR | pilates50 | PT | criativo 01' \
  -F 'object_story_spec={
        "page_id": "<PAGE_ID>",
        "link_data": {
          "link": "https://exemplo.invalid/?utm_source=meta&utm_medium=paid&utm_campaign=<NOME_DA_CAMPANHA>",
          "message": "Texto principal do anúncio (exemplo fictício)",
          "name": "Título (exemplo fictício)",
          "description": "Descrição curta (exemplo fictício)",
          "image_hash": "<HASH_DO_PASSO_4.1>",
          "call_to_action": { "type": "LEARN_MORE", "value": { "link": "https://exemplo.invalid/?utm_source=meta&utm_medium=paid&utm_campaign=<NOME_DA_CAMPANHA>" } }
        }
      }' \
  -F 'url_tags=utm_content={{ad.id}}&xcod={{ad.id}}' \
  -F 'access_token=<TOKEN>' \
  'https://graph.facebook.com/<VERSÃO>/act_<AD_ACCOUNT_ID>/adcreatives'
```

Resposta:

```json
{ "id": "120000000000001" }
```

1. **Obrigatórios para esse tipo de criativo:** `object_story_spec.page_id` e, dentro de `link_data`, `link` e `image_hash` (ou `picture`, mas só um dos dois). `name` do criativo é boa prática (a página o descreve como o nome na biblioteca da conta). `message`, `name` (título) e `description` aparecem no anúncio. A página diz que o `link` **precisa ser igual** ao link do `call_to_action`. A lista de campos **obrigatórios** do `adcreatives` em si não está marcada com `[required]` na página; o que está acima vem das descrições de `object_story_spec`, `link_data` e `image_hash`.
2. **`url_tags`** é uma string `chave=valor&chave=valor`. Macros oficiais para o valor: `{{campaign.id}}`, `{{adset.id}}`, `{{ad.id}}`, `{{campaign.name}}`, `{{adset.name}}`, `{{ad.name}}`. Os de nome usam o nome da hora da publicação (uma "foto" dele). Fonte: <https://developers.facebook.com/docs/instagram/ads-api/guides/url-tags-for-tracking/>.
3. A página do criativo diz que `url_tags` "substitui ou é anexado" aos URLs clicados em **anúncios de publicação de Página** (é o caso de `object_story_spec`), texto do post e criativos de instalação de app. **Para evitar ambiguidade, não repita a mesma chave** (ex.: `utm_content`) no `link` e em `url_tags`: deixe só em `url_tags`. **Não verificado:** a regra exata quando a chave se repete.
4. **Por que `xcod` junto:** na Hotmart, o que volta no histórico de vendas como `external_code` é o `xcod` da URL do checkout (<https://developers.hotmart.com/docs/en/v1/sales/sales-history/>). O script `dr-utm` do site precisa repassar `xcod` ao link da Hotmart (proposta 4 abaixo, e `plano/pesquisa/hotmart-api.md`).
5. **Não coloque `{{ad.id}}` direto na URL do `link`.** A documentação oficial manda usar `url_tags`; um tópico do fórum de desenvolvedores da Meta relata macros que não foram trocadas quando colocadas fora do lugar certo (fonte secundária: <https://developers.facebook.com/community/threads/264166065300493/>). Não li a conversa inteira.
6. Se o `object_story_id` já estiver em uso por outro criativo, a API **devolve o criativo existente** em vez de criar outro (aviso na página). Não vale para `object_story_spec`.
7. **Ensaio sem criar nada:** `-F 'execution_options=["validate_only"]'`. Se passar, a resposta é `{"success": true}`; se não, vem o erro. Doc: mesma página.
8. **Melhorias automáticas de criativo:** o campo `degrees_of_freedom_spec` controla transformações do criativo pela Meta. O valor padrão quando ele é omitido **não está descrito** na página que li; **não verificado**. Se o Arthur não quiser mudança automática, é preciso definir explicitamente, depois de conferir a estrutura em <https://developers.facebook.com/docs/marketing-api/reference/ad-account/adcreatives/>.

### 4.3 Criar o anúncio (PAUSED)

Doc: <https://developers.facebook.com/docs/marketing-api/reference/ad-account/ads/>

```bash
curl -X POST \
  -F 'name=DR | pilates50 | PT | anúncio 01' \
  -F 'adset_id=<AD_SET_ID>' \
  -F 'creative={"creative_id":"<CREATIVE_ID>"}' \
  -F 'status=PAUSED' \
  -F 'conversion_domain=<DOMINIO_DA_PAGINA>' \
  -F 'access_token=<TOKEN>' \
  'https://graph.facebook.com/<VERSÃO>/act_<AD_ACCOUNT_ID>/ads'
```

Resposta:

```json
{ "id": "120000000000002" }
```

| Campo | Situação | Observação oficial |
|---|---|---|
| `name` | obrigatório | |
| `adset_id` | obrigatório na criação (a menos que use `adset_spec`) | |
| `creative` | obrigatório | `{"creative_id": "<id>"}` ou especificação completa |
| `status` | valores válidos na criação: `ACTIVE` e `PAUSED` | "Ao criar, o anúncio passa pela **revisão** e fica em `PENDING_REVIEW` até terminar; depois volta ao status escolhido." A própria página recomenda `PAUSED` em testes |
| `conversion_domain` | obrigatório quando a campanha compartilha dados com um pixel | só 1.º e 2.º nível de domínio |
| `tracking_specs` | opcional | |
| `execution_options` | opcional | `validate_only`, `synchronous_ad_review` (sempre junto com `validate_only`) |

1. **Pré-revisão sem criar:** `execution_options=["validate_only","synchronous_ad_review"]` roda as verificações de integridade (idioma, regra de texto na imagem etc.) **sem criar o anúncio**. A página avisa: o resultado **não** é a decisão final da revisão completa. Serve para pegar erro cedo.
2. **A trava de `PAUSED` do plano continua valendo:** o JSON do `Payload PAUSADO` deve recusar qualquer `status` diferente de `PAUSED` também para o anúncio.
3. Limite do conjunto: no máximo **50 anúncios não arquivados** por conjunto; conta com até 5000 conjuntos (<https://developers.facebook.com/docs/marketing-api/reference/ad-campaign/>).
4. O conjunto precisa estar com `dsa_payor` e `dsa_beneficiary` (seção 3). Se faltarem, a página mostra os erros "No payor provided in DSA regulated region" e "No payor/beneficiary provided in DSA regulated location".
5. Se o conjunto estiver `PAUSED`, os anúncios ativos dentro dele aparecem com `effective_status = ADSET_PAUSED`; com a campanha `PAUSED`, `CAMPAIGN_PAUSED` (páginas de conjunto e de campanha).

### 4.4 Conferir pela API

```bash
curl -G \
  -d 'fields=id,name,status,effective_status,creative{id,url_tags}' \
  -d 'access_token=<TOKEN>' \
  'https://graph.facebook.com/<VERSÃO>/<AD_ID>'
```

1. Valores possíveis de `effective_status` (enum oficial): `ACTIVE`, `PAUSED`, `DELETED`, `PENDING_REVIEW`, `DISAPPROVED`, `PREAPPROVED`, `PENDING_BILLING_INFO`, `CAMPAIGN_PAUSED`, `ARCHIVED`, `ADSET_PAUSED`, `IN_PROCESS`, `WITH_ISSUES`.
2. **Regra de conferência proposta para o anúncio:** aprovado se `status == "PAUSED"` **e** `effective_status != "ACTIVE"`. Logo depois da criação o `effective_status` tende a ser `PENDING_REVIEW` ou `IN_PROCESS`; isso **não é erro**. A conferência atual do plano (`effective_status` só em `PAUSED`, `CAMPAIGN_PAUSED`, `ADSET_PAUSED`) **reprovaria** um anúncio recém-criado e perfeitamente pausado. **Não verificado** na prática; é o que o enum e a frase sobre `PENDING_REVIEW` indicam.
3. `creative{id,url_tags}` na mesma chamada permite o Revisor conferir que `url_tags` contém a macro `{{ad.id}}` literal. A expansão em número real só acontece na entrega, então o teste de "o link chega com o id do anúncio" fica em duas partes: (a) `url_tags` correto no criativo (API); (b) o clique real, já com o anúncio ativado pelo Arthur, mostra o número no endereço da página.
4. **Não verificado:** a lista exata de campos que se pode pedir via `creative{...}` na expansão de campos; a sintaxe `campo{subcampo}` é padrão da Graph API, mas não abri a página que a define.

## 5. Buscar campanha por nome (idempotência, T-07)

Doc: <https://developers.facebook.com/docs/marketing-api/reference/ad-account/campaigns/>

1. **Filtro por nome (`filtering`): não verificado.** As páginas de referência de campanhas, conjuntos e anúncios que li **não listam** esse parâmetro. Procurei em <https://developers.facebook.com/docs/marketing-api/reference/ad-account/campaigns/>, <https://developers.facebook.com/docs/marketing-api/reference/ad-account/ads/> e <https://developers.facebook.com/docs/marketing-api/reference/ad-campaign/>. Não use sem testar.
2. **Caminho verificado:** `GET /act_<AD_ACCOUNT_ID>/campaigns?fields=id,name,effective_status&limit=<N>` e depois comparar o `name` no n8n. A página diz que, sem filtros, **só voltam campanhas não arquivadas e não apagadas**, então campanhas `PAUSED` aparecem. `effective_status` é o único filtro de status documentado (lista, ex.: `["ACTIVE","PAUSED"]`).
3. Resposta paginada: o corpo traz `data`, `paging` (cursores e `next`). Siga `paging.next` até acabar (o padrão geral da Graph API está na própria página: "para detalhes de paginação, veja o guia da Graph API"; o guia não foi aberto: **não verificado** o tamanho máximo de `limit`).
4. **Chave de idempotência (atualizado após `H-20261127-italo-06`):** o gerador já usa um nome **fixo** para a campanha (`config.campanha_nome`, senão `DR | <oferta> | <país>`, sem data nem id de rodada) e, se achar uma campanha com esse nome, **reaproveita** e não altera nada. É uma escolha coerente com o objetivo (duas rodadas da mesma oferta não duplicam), e **substitui** a minha sugestão anterior de `id_da_rodada`. O custo é que uma campanha antiga com o mesmo nome (por exemplo, de um teste) será reaproveitada; para uma campanha nova da mesma oferta, o Arthur precisa mudar `campanha_nome`.
5. Para anúncios: `GET /act_<AD_ACCOUNT_ID>/ads?fields=id,name,adset_id,effective_status` (rota documentada) e comparar `name`. Para criativos: `GET /act_<AD_ACCOUNT_ID>/adcreatives?fields=id,name`. Para imagens: `GET .../adimages?name=<nome>` (o filtro `name` está documentado como "usado no filtro de nomes de imagem").
6. **Por nome é frágil:** se o Arthur renomear algo no painel, a busca não acha e a rodada cria de novo. Registrar os `id` criados em `estado` (já existe no plano) é a segunda defesa. Plano atual: nunca `retryOnFail` em POST de criação, e isso continua certo.

7. **Conferência do código atual do Tráfego (`n8n/tools/codigos.mjs` e `gerar.mjs`, commit `3354704`; li o código, não rodei contra a Meta):**
   - O nó `Meta · buscar campanha` manda `filtering=[{"field":"name","operator":"EQUAL","value":<nome>}]` e `limit=50`. **Esse filtro não aparece nas páginas oficiais que li** (item 1), então segue **não verificado**; o `H-20261127-italo-06` já admite isso.
   - **Risco:** o nó `Campanha já existe?` testa só `data.length > 0` e o `Reusar campanha` pega `data[0]`, **sem comparar o `name`**. Se a Meta ignorar o filtro (ou aceitar de outro jeito), qualquer campanha da conta seria "reaproveitada" e o fluxo não criaria a do Arthur. **Proposta barata:** depois da busca, exigir `data.find(c => c.name === nome)` e, se vier outra coisa, tratar como "não existe". Vale também para quando houver mais de 50 campanhas (não há paginação nessa busca).
   - O payload de conjunto do código **não tem** `dsa_payor` nem `dsa_beneficiary` (nem existe `conversion_domain`, que só entra quando os anúncios forem criados, C-06): para Portugal, ver as seções 1 e 8.
   - `graph_version` continua `v23.0` em `CONFIG_PADRAO`, no valor de reserva do Radar (`cfg.graph_version || 'v23.0'`) e no `testar-codigos.mjs`. Trocar nos três lugares.
   - Nada disso foi alterado por mim (as tarefas C-xx são do Claude).

## 6. Limites de taxa

Doc: <https://developers.facebook.com/docs/graph-api/overview/rate-limiting/>

1. Marketing API usa limite por **caso de uso de negócio (BUC)**, aplicado por **conta de anúncios**. "Ads Management" (criar e editar) divide a mesma cota entre todos os endpoints do tipo.
2. Cota por hora (janela móvel): **acesso padrão `300 + 40 × (nº de anúncios ativos)`**; com Acesso Avançado, `100000 + 40 × (nº de anúncios ativos)`. O nível padrão de um app novo é `development_access`. **Não verificado:** se um app que só gerencia a conta do próprio dono precisa pedir o Acesso Avançado.
3. Erro de limite do Ads Management: código **80004**, subcódigo **2446079**. O erro 613 ("chamadas acima do limite de taxa") também aparece nas páginas de criação. O cabeçalho `X-Business-Use-Case-Usage` mostra a folga e `estimated_time_to_regain_access` o tempo de espera.
4. Boas práticas oficiais: ao atingir o limite, **pare** (continuar aumenta a espera); espalhe as consultas no tempo; "é melhor criar um anúncio novo do que mudar os existentes".
5. **Conta recém-aberta, sem anúncios ativos:** a fórmula dá **300 chamadas/hora**. Para 1 oferta com 3 conjuntos e ~10 criativos, a rodada faz, por estimativa minha, algumas dezenas de chamadas (criativos, anúncios e listagens), então deve caber com folga; **não medido**.

## 7. Ad Library API: limites fora da UE

Doc: <https://developers.facebook.com/docs/graph-api/reference/ads_archive/> e <https://developers.facebook.com/docs/graph-api/reference/archived-ad/>

1. **Parâmetro obrigatório:** `ad_reached_countries` (lista de códigos de país ou `ALL`). Nota oficial: "anúncios que **não alcançaram nenhum local da UE** só retornam se forem sobre temas sociais, eleições ou política."
2. **Consequência para o Brasil:** a API **não devolve anúncio comercial** (como o do Pilates) que alcançou só o Brasil. Para temas políticos no Brasil existe `br_total_reach`. Os números do Brasil continuam vindo dos **prints** (campo `ofertas_br`), como o plano já diz. Não tente contornar.
3. **Para Portugal (UE) funciona:** há campos só para anúncios entregues na UE e Reino Unido: `eu_total_reach`, `target_ages`, `target_gender`, `target_locations`, `age_country_gender_reach_breakdown`, `beneficiary_payers`, `total_reach_by_location`. O Radar do plano pede só `id,page_id,page_name,ad_delivery_start_time,ad_snapshot_url,ad_creative_link_titles`; **todos existem** na referência. Sugestão: acrescentar `eu_total_reach`, `target_ages`, `target_gender`, `languages`, `publisher_platforms` e `ad_creative_bodies` para dar força à classificação.
4. **Sem gasto nem impressões para anúncio comercial:** `spend`, `impressions`, `estimated_audience_size`, `currency` e `demographic_distribution` são "disponíveis apenas para `POLITICAL_AND_ISSUE_ADS`". O Radar não pode estimar gasto de concorrente em Portugal; só alcance estimado na UE (`eu_total_reach`) e tempo no ar (`ad_delivery_start_time`).
5. **Janela de retenção e tipo de token:** pelo resumo da página oficial da Ad Library API (<https://www.facebook.com/ads/library/api/>, que **não abriu** na minha leitura; li só um resumo de busca): anúncios da UE e do Reino Unido ficam disponíveis por **1 ano**, e anúncios políticos e de temas sociais por **7 anos**; o acesso exige **token de usuário** cuja conta tenha feito a **confirmação de identidade** (`facebook.com/ID`). **Não verificado.** Se isso for verdade, um token de **usuário de sistema** pode não servir para o Radar; testar com a credencial real (D-02).
6. **Busca:** `search_terms` até 100 caracteres, sem tradução (escrever em português para anúncios em português); `search_type` `KEYWORD_UNORDERED` (padrão) ou `KEYWORD_EXACT_PHRASE`; `search_page_ids` aceita até **10** páginas por chamada; `ad_active_status` padrão `ACTIVE`; `ad_type` padrão `ALL`; `languages` em ISO 639-1 (ex.: `['pt']`).
7. **Paginação:** acabou quando `data` vem vazio. Tamanho máximo de `limit` (o plano usa 200) **não está na referência**: **não verificado**; páginas: <https://developers.facebook.com/docs/graph-api/reference/ads_archive/>.
8. Limites numéricos de taxa da Ad Library API: a referência só cita o erro **613** ("chamadas passaram do limite de taxa"); o número **não está documentado** na página lida. **Não verificado.**
9. Termos de uso (do `ad_snapshot_url`): o ad pode ser baixado para **análise individual**, respeitando os termos de armazenamento de dados da Meta; não é possível baixar em lote. Não faça raspagem da Biblioteca.

## 8. O que muda no plano (propostas; não alterei o plano)

| # | Onde | Proposta | Por quê |
|---|---|---|---|
| 1 | §3.1 `graph_version` | `v23.0` → `v26.0` (ou `v27.0`); no código, em `CONFIG_PADRAO`, no valor de reserva do Radar e em `testar-codigos.mjs` | v23.0 expirou em 2026-06-09 |
| 2 | §12 `Payload PAUSADO` (conjuntos) | Acrescentar `dsa_payor` e `dsa_beneficiary` (texto, até 512 caracteres) vindos do `config.decisoes` | Portugal é UE; sem eles a API recusa o conjunto |
| 3 | §12 `Conferência PAUSADO` para anúncios | Aprovar se `status == PAUSED` e `effective_status != ACTIVE`; aceitar `PENDING_REVIEW`, `IN_PROCESS`, `WITH_ISSUES`, `ADSET_PAUSED`, `CAMPAIGN_PAUSED` | Anúncio novo nasce em revisão, mesmo pausado |
| 4 | §8 `dr-utm` e item 2 do Revisor (§11) | Repassar também `xcod` aos links da Hotmart. Conferir no criativo (`url_tags`) a presença de `utm_content={{ad.id}}` e `xcod={{ad.id}}` | A Hotmart devolve `xcod` como `external_code` |
| 5 | §12 e T-06 | Novos nós, nesta ordem: `adimages` (Base64) → `adcreatives` (com `url_tags`) → `ads` (PAUSED, `conversion_domain`). Antes de cada POST de criação, rodar o mesmo corpo com `execution_options=["validate_only"]` | Falha cedo, sem criar nada |
| 6 | §12 e T-07 | Manter o nome fixo da campanha (já feito); **comparar o `name` do resultado** em vez de só `data.length > 0`; testar o `filtering` com conta de teste (V-02); para conjuntos, criativos e anúncios, listar e comparar nomes; gravar os `id` em `estado` | O filtro por nome não está na doc oficial e o código aceita qualquer resultado |
| 7 | §3.1 | Novo campo `dominio_conversao` derivado de `url_pagina_publicada` (1.º e 2.º nível) | `conversion_domain` é obrigatório no anúncio |
| 8 | §3.1/§12 | Novos campos `page_id` e (opcional) `instagram_user_id` | O criativo precisa deles |
| 9 | §6 Radar | Acrescentar campos da UE (item 3 da seção 7); nota: não há gasto nem impressões para anúncios comerciais | Confirmado na referência de `archived-ad` |
| 10 | G-05 e P-14 | Perguntar ao Arthur: Página, Instagram, moeda da conta, **pagador e beneficiário** (DSA) | Dependências acima |

## 9. Resumo do que ficou não verificado

| Tema | Onde procurei |
|---|---|
| Filtro por nome de campanha, conjunto ou anúncio (`filtering`) | <https://developers.facebook.com/docs/marketing-api/reference/ad-account/campaigns/>, `.../ad-account/ads/`, `.../ad-campaign/` |
| Envio de imagem por arquivo (multipart), limites de tamanho e formato | <https://developers.facebook.com/docs/marketing-api/reference/ad-account/adimages/> (a página de imagens de anúncio `.../creative/image-ads` deu 404) |
| Regra exata de `url_tags` quando a chave também está no `link` | <https://developers.facebook.com/docs/marketing-api/reference/ad-account/adcreatives/> |
| Macros não trocadas quando colocadas na URL (relato do fórum) | <https://developers.facebook.com/community/threads/264166065300493/> (conversa não lida por inteiro) |
| Padrão do `degrees_of_freedom_spec` quando omitido | <https://developers.facebook.com/docs/marketing-api/reference/ad-account/adcreatives/> |
| Posição do Instagram sem `instagram_user_id` | <https://developers.facebook.com/docs/marketing-api/reference/ad-creative-object-story-spec/> |
| Permissões e tipo de token do app (usuário de sistema, `ads_management`) | não aberto: <https://developers.facebook.com/docs/marketing-api/> |
| Se o app precisa de Acesso Avançado para a conta própria | <https://developers.facebook.com/docs/graph-api/overview/rate-limiting/> |
| Como o "auto-upgrade" trata chamadas com versão vencida | <https://developers.facebook.com/docs/graph-api/changelog/versions/> |
| Tamanho máximo de `limit` na Graph API e na Ad Library API | <https://developers.facebook.com/docs/graph-api/reference/ads_archive/> |
| Retenção de 1 ano (UE/RU) e 7 anos (políticos); token de usuário com confirmação de identidade | <https://www.facebook.com/ads/library/api/> (não abriu); só vi um resumo de busca |
| Limite numérico de taxa da Ad Library API | <https://developers.facebook.com/docs/graph-api/reference/ads_archive/> (só o erro 613) |
| Tudo o que depende de chamada real (campos exatos devolvidos, tempo de revisão) | exige credencial (D-01 a D-04) |
