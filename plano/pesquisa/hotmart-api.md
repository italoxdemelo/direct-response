# Hotmart API hoje (G-01)

**Tarefa:** G-01 de `plano/DIVISAO-TAREFAS.md` · **Entrada:** `H-20261127-grok-02` · **Autor:** italo — Grok
**Pesquisado em:** 2026-11-27 (America/Bahia) · **Fonte:** só a documentação oficial, <https://developers.hotmart.com/docs/en/> (as páginas são renderizadas por JavaScript; li o conteúdo publicado delas).
**Alimenta:** seção 9 de `plano/PLANO-DE-ACAO.md` (workflow 04 Funil), T-08 e V-02.

> **Limites desta pesquisa.** Nenhuma chamada foi feita: não existe credencial (P-12). Tudo abaixo vem do que a documentação diz. Os exemplos de resposta usam **valores fictícios** que eu escrevi, no formato dos exemplos oficiais. O que a documentação não diz está marcado como **não verificado**, com o link de onde procurei.

## 1. Resposta curta

1. **OAuth `client_credentials` está confirmado**, com um detalhe que o plano já acerta: o token sai de `https://api-sec-vlc.hotmart.com/security/oauth/token`, com `grant_type=client_credentials`, `client_id` e `client_secret` na query e o header `Authorization: Basic <token Basic da credencial>`.
2. **O endpoint de produtos está confirmado:** `GET https://developers.hotmart.com/products/api/v1/products`. O plano acertou a URL. Mas **a lista de produtos não traz preço nem moeda**.
3. **Preço e moeda do checkout se leem em outro endpoint:** `GET /products/api/v1/products/{ucode}/offers` devolve, por oferta, `price.value`, `price.currency_code`, `payment_mode`, `is_main_offer` e `direct_offer_link_for_creator`. O `ucode` vem da lista de produtos. Com isso o workflow 04 não precisa "adivinhar" o preço lendo o HTML do checkout.
4. **A frase do plano "a API não cria checkout" está só em parte certa.** A **API de Payment Link** cria um link de checkout em EUR (`POST /payments/api/v1/link`) e ofertas extras com outro preço. Mas ela serve a "criadores que vendem e entregam fora da Hotmart" (ver seção 5). **Não encontrei** na documentação endpoint para criar produto, order bump ou upsell. Isso continua sendo feito no painel.
5. **O parâmetro `xcod` aparece na documentação só pelo lado da leitura:** o histórico de vendas devolve `purchase.tracking.external_code` (do `xcod` da URL do checkout), `source` (do `src`) e `source_sck` (do `sck`). Para atribuir a venda ao anúncio, o link do checkout precisa carregar `xcod={{ad.id}}`. O script `dr-utm` do plano **não repassa `xcod`** hoje (ver seção 7).

## 2. Autenticação

Documentação: <https://developers.hotmart.com/docs/en/start/app-auth/> e <https://developers.hotmart.com/docs/en/start/hotmart-authentication-create-credentials/>.

**Criar a credencial (feito pelo Arthur, no painel):** Ferramentas › Credenciais de Desenvolvedor › Criar credencial. O painel gera três coisas: `client_id`, `client_secret` e um token do tipo **Basic**. O tipo da credencial (**produção** ou **sandbox**) é escolhido na criação e **não muda depois**. Para testar, crie uma credencial sandbox separada.

**Pedir o token**

| Item | Valor |
|---|---|
| Método e URL | `POST https://api-sec-vlc.hotmart.com/security/oauth/token` |
| Query | `grant_type=client_credentials`, `client_id=<client_id>`, `client_secret=<client_secret>` |
| Headers | `Content-Type: application/json` e `Authorization: Basic <token Basic>` |
| Doc | <https://developers.hotmart.com/docs/en/start/app-auth/> |

```bash
# valores de exemplo: tudo fictício
curl --location --request POST \
  'https://api-sec-vlc.hotmart.com/security/oauth/token?grant_type=client_credentials&client_id=CLIENT_ID_FICTICIO&client_secret=CLIENT_SECRET_FICTICIO' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Basic BASIC_FICTICIO'
```

Resposta (formato do exemplo oficial, valores fictícios):

```json
{
  "access_token": "ACCESS_TOKEN_FICTICIO",
  "token_type": "bearer",
  "expires_in": 172799,
  "scope": "read write",
  "jti": "00000000-0000-4000-8000-000000000000"
}
```

Pontos que a documentação dá:

1. `expires_in` está em segundos (o exemplo oficial mostra 172799, cerca de 48 horas). Depois disso, as chamadas com esse token devolvem **401**. A Hotmart recomenda tratar o 401 e gerar outro token. As credenciais (`client_id`, `client_secret`, Basic) não expiram.
2. O `client_secret` vai **na URL** no exemplo oficial. Isso o expõe em logs de proxy e do n8n. Para o fluxo: guardar na credencial `DR · Hotmart` (como o plano já prevê, P-12) e **não gravar a URL completa** no log da execução. Se a Hotmart aceita o `client_secret` no corpo ou em outro lugar: **não verificado** (a página de autenticação só mostra a query).
3. Em todas as chamadas seguintes: `Authorization: Bearer <access_token>`.
4. A documentação manda guardar as credenciais em segredo e permite apagá-las e gerar novas.

## 3. Endpoints que o projeto usa ou pode usar

Base de produção: `https://developers.hotmart.com`. Base do sandbox: `https://sandbox.hotmart.com` (mesmo caminho), com credencial sandbox. Cabeçalhos comuns: `Authorization: Bearer <access_token>` e `Content-Type: application/json`.

### 3.1 Listar produtos (o que o workflow 04 chama hoje)

| Item | Valor |
|---|---|
| Método e URL | `GET https://developers.hotmart.com/products/api/v1/products` |
| Query (todas opcionais) | `id` (long, 7 dígitos), `status`, `format`, `max_results` (padrão 50), `page_token` |
| Valores de `status` | DRAFT, ACTIVE, PAUSED, NOT_APPROVED, IN_REVIEW, DELETED, CHANGES_PENDING_ON_PRODUCT |
| Valores de `format` | EBOOK, SOFTWARE, MOBILE_APPS, VIDEOS, AUDIOS, TEMPLATES, IMAGES, ONLINE_COURSE, SERIAL_CODES, ETICKET, ONLINE_SERVICE, ONLINE_EVENT, BUNDLE, COMMUNITY, AGENT |
| Doc | <https://developers.hotmart.com/docs/en/v1/product/product-list/> |

Resposta (fictícia):

```json
{
  "items": [
    {
      "id": 1234567,
      "name": "Produto Exemplo",
      "ucode": "00000000-0000-4000-8000-000000000001",
      "status": "DRAFT",
      "created_at": 1700000000000,
      "format": "ONLINE_COURSE",
      "is_subscription": false,
      "warranty_period": 7
    }
  ],
  "page_info": {
    "next_page_token": "TOKEN_DE_PAGINA_FICTICIO",
    "prev_page_token": "TOKEN_DE_PAGINA_FICTICIO",
    "results_per_page": 1
  }
}
```

1. `created_at` é em milissegundos desde 1970 (UTC).
2. `warranty_period` é o prazo de garantia padrão do produto. A documentação não diz a unidade; pelos exemplos (7 e 15), são dias. **Não verificado:** a unidade. Esta é a página consultada: <https://developers.hotmart.com/docs/en/v1/product/product-list/>.
3. **Não há preço, moeda nem link de checkout aqui.** O workflow 04 deve guardar o `ucode` e seguir para 3.2.
4. Para achar o produto pelo `id` numérico (`hotmart_product_id` do plano), use `?id=<id>` em vez de percorrer a lista.

### 3.2 Ofertas do produto (aqui estão preço e moeda)

| Item | Valor |
|---|---|
| Método e URL | `GET https://developers.hotmart.com/products/api/v1/products/{ucode}/offers` |
| Path | `ucode` (UUID do produto, vem de 3.1) |
| Query | `max_results`, `page_token` |
| Doc | <https://developers.hotmart.com/docs/en/v1/product/product-offers/> |

Resposta (fictícia):

```json
{
  "items": [
    {
      "code": "abcd1234",
      "name": "Oferta principal",
      "description": "",
      "price": { "value": 12.9, "currency_code": "EUR" },
      "payment_mode": "UNIQUE_PAYMENT",
      "is_currency_conversion_enabled": true,
      "is_smart_recovery_enabled": false,
      "is_main_offer": true,
      "direct_offer_link_for_creator": "https://pay.hotmart.com/X00000000X?off=abcd1234"
    }
  ],
  "page_info": { "next_page_token": null, "prev_page_token": null, "results_per_page": 1 }
}
```

1. `price.currency_code` aceita (nos exemplos da doc) BRL, USD, EUR, MXN. Dá para **conferir por código** que a oferta principal está em EUR e com o valor de `preco_aprovado`.
2. `payment_mode` aceita UNIQUE_PAYMENT, SUBSCRIPTION, MULTIPLE_PAYMENTS, PAY_IN_FULL, NOT_DEFINED, INVOICE, SMART_INSTALLMENT, BILLET_INSTALLMENT e FINANCED_BILLET. O exemplo oficial usa `PAY_IN_FULL`. **Não verificado:** qual dos dois valores a Hotmart usa para "pagamento único" em produto novo; aceite os dois na verificação.
3. `is_currency_conversion_enabled` indica se há conversão de moeda em vendas internacionais. Se o preço em EUR tem de ser exato para quem compra de Portugal, **confira esse campo** (o comportamento da conversão não está descrito nessa página; **não verificado**).
4. `direct_offer_link_for_creator` é um campo recente: "link direto de checkout da oferta, para o criador". Pode servir de `hotmart_checkout_url` para o workflow 04 **sem o Arthur copiar do painel**. **Não verificado:** se é o mesmo link que o comprador deve receber (o formato do exemplo oficial é `https://pay.hotmart.com/<código>?off=<oferta>`).
5. Esta rota **não lista order bump nem upsell**. **Não verificado** se existe outra rota; procurei no menu da API de produtos e não achei: <https://developers.hotmart.com/docs/en/>.
6. Para produtos de assinatura existe a rota irmã `GET /products/api/v1/products/{ucode}/plans` (<https://developers.hotmart.com/docs/en/v1/product/product-plans/>). Não se aplica a pagamento único.

### 3.3 Criar link de pagamento (checkout em EUR por API)

| Item | Valor |
|---|---|
| Método e URL | `POST https://developers.hotmart.com/payments/api/v1/link` |
| Headers | `Authorization: Bearer <access_token>`, `Content-Type: application/json` |
| Obrigatórios no corpo | `name` (string), `value` (double, ex. 12.90), `currency` (BRL, COP, EUR, MXN ou USD) |
| Opcionais | `checkout_configuration` (Pix, PayPal, saldo Hotmart, boleto, páginas de agradecimento `purchase_approved_url` etc., cupom, pedir endereço, telefone ou documento), `link_configuration.link_callback_url` (webhook), `subscription` |
| Doc | <https://developers.hotmart.com/docs/en/v1/payment-link/create-pl/> |

Corpo mínimo (fictício):

```json
{
  "name": "Desafio Exemplo",
  "value": 12.9,
  "currency": "EUR",
  "checkout_configuration": {
    "is_offer_paypal": true,
    "custom_thanks_page": { "purchase_approved_url": "https://exemplo.invalid/obrigado" }
  },
  "link_configuration": { "link_callback_url": "https://exemplo.invalid/webhook-hotmart" }
}
```

Resposta (fictícia):

```json
{
  "ucode": "00000000-aaaa-4000",
  "name": "Desafio Exemplo",
  "url": "https://app-hotmart-checkout.com/link/00000000-aaaa-4000"
}
```

1. O tutorial oficial diz que o sucesso é **HTTP 201**. Cartão de crédito e débito ficam sempre ligados e não dá para desligar.
2. A página mostra o valor na moeda base e **converte sozinha** para a moeda do comprador, conforme a localização. Com `currency: EUR`, a base é o euro.
3. O link recém-criado pode demorar para ficar ativo; antes disso o checkout dá erro. O aviso de que ficou pronto vem por webhook (`PAYMENT_LINK_APPROVED`) para `link_callback_url`. Sem o webhook, é preciso esperar e tentar de novo. Doc: <https://developers.hotmart.com/docs/en/v1/payment-link/before-starting/>.
4. O corpo tem muitos campos marcados "coming soon" (campos de formulário, páginas de agradecimento em alguns casos). Confie só no que está na tabela de parâmetros da página.
5. **Não verificado:** se o checkout do Payment Link tem **order bump e upsell**, caixa de **consentimento à renúncia do prazo de 14 dias** da UE, política de **garantia/reembolso** e **entrega de conteúdo**. A página "Intro" diz que a ferramenta é para quem **entrega o conteúdo fora da Hotmart**: <https://developers.hotmart.com/docs/en/v1/payment-link/about-pl/>.

### 3.4 Listar os links de pagamento já criados

| Item | Valor |
|---|---|
| Método e URL | `GET https://developers.hotmart.com/payments/api/v1/link` |
| Parâmetros | **nenhum filtro** (a página diz "no filters and no parameters") |
| Doc | <https://developers.hotmart.com/docs/en/v1/payment-link/get-pl/> |

```json
{
  "items": [
    { "ucode": "00000000-aaaa-4000", "name": "Desafio Exemplo",
      "url": "https://app-hotmart-checkout.com/link/00000000-aaaa-4000" }
  ],
  "page_info": { "total_results": 1, "next_page_token": null, "prev_page_token": null, "results_per_page": 20 }
}
```

Para **idempotência** do workflow 04 (não criar o mesmo link duas vezes): como não há filtro, é preciso listar tudo, paginar e comparar `name` no n8n. O corpo da lista pode ter `next_page_token`; siga até acabar.

### 3.5 Criar oferta extra (outro preço no mesmo link)

| Item | Valor |
|---|---|
| Método e URL | `POST https://developers.hotmart.com/payments/api/v1/link/{payment_link_ucode}/offer` |
| Corpo | `name` (obrigatório), `value`, `currency` (BRL, COP, EUR, MXN, USD), `is_main_offer` (opcional) |
| Resposta | `ucode`, `name`, `offer_code`, `offer_name`, `url` (ex.: `https://app-hotmart-checkout.com/link/<ucode>?off=<offer_code>`) |
| Doc | <https://developers.hotmart.com/docs/en/v1/payment-link/create-additional-offer/> |

1. Só para link de **pagamento único** (assinatura tem outra rota). Se o link ainda está sendo criado, a API devolve a mensagem "Payment link ... is not fully created yet".
2. **Inconsistência na própria documentação:** a tabela de parâmetros chama o campo `name`, mas o exemplo de `curl` envia `offer_name`. **Não verificado** qual vale; teste no sandbox antes.
3. Isto é um **preço alternativo do mesmo produto**, não um order bump (item extra no carrinho). A página oferece "carrinho de compras" como tutorial (<https://developers.hotmart.com/docs/en/tutorials/create-shopping-cart/>), mas montá-lo é feito **na nossa plataforma**, não na Hotmart.

### 3.6 Ler vendas (para fechar o ciclo anúncio → venda)

| Item | Valor |
|---|---|
| Método e URL | `GET https://developers.hotmart.com/payments/api/v1/sales/history` |
| Query | `product_id`, `start_date`, `end_date` (milissegundos), `sales_source` (o `src`), `transaction`, `transaction_status`, `offer_code`, `payment_type`, `buyer_email`, `buyer_name`, `commission_as`, `max_results`, `page_token` |
| Padrão | sem `transaction` nem `transaction_status`, só devolve `APPROVED` e `COMPLETE` |
| Doc | <https://developers.hotmart.com/docs/en/v1/sales/sales-history/> |

Trecho da resposta (fictício). **Tem dado pessoal do comprador** (nome, e-mail): nunca grave isto no Git.

```json
{
  "items": [
    {
      "product": { "name": "Produto Exemplo", "id": 1234567 },
      "buyer": { "name": "Comprador Exemplo", "email": "comprador@exemplo.invalid" },
      "purchase": {
        "transaction": "HP00000000000000",
        "status": "APPROVED",
        "price": { "value": 12.9, "currency_code": "EUR" },
        "payment": { "type": "CREDIT_CARD", "installments_number": 1 },
        "tracking": { "source": "pilates50-pt", "source_sck": "meta|exemplo", "external_code": "120000000000000" },
        "offer": { "code": "abcd1234", "payment_mode": "UNIQUE_PAYMENT" },
        "warranty_expire_date": 1700600000000
      }
    }
  ],
  "page_info": { "total_results": 1, "results_per_page": 50 }
}
```

1. **Rastreio:** `tracking.source` = `src` do link, `tracking.source_sck` = `sck`, `tracking.external_code` = `xcod` da URL do checkout. Descrições na própria página de resposta.
2. Há também `GET /payments/api/v1/sales/price/details` (quebra do preço, impostos, cupom): <https://developers.hotmart.com/docs/en/v1/sales/sales-price-details/>, e rotas de resumo e comissões na mesma seção. Não são necessárias para a primeira rodada.
3. Os exemplos oficiais misturam moedas (`USD` no preço, `EUR` na taxa). **Não tire conclusão** de moeda a partir deles.

## 4. Limites gerais da API

| Tema | O que a documentação diz | Doc |
|---|---|---|
| Rate limit | 500 chamadas por minuto (leitura e escrita). Passou disso: **429**. Headers `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`, `X-RateLimit-Limit-Minute`, `X-RateLimit-Remaining-Minute` | <https://developers.hotmart.com/docs/en/start/rate-limit/> |
| Paginação | Por cursor: `page_token` com o valor de `next_page_token` (ou `prev_page_token`). `max_results` pede o tamanho da página; cada rota tem seu máximo | <https://developers.hotmart.com/docs/en/start/pagination/> |
| Erros | 400 `invalid_parameter` (e variações), 401 `unauthorized`/`token_expired`/`invalid_token`, 403 `unauthorized_client`, 404 `not_found`, 429 `too_many_requests`, 500, 502 (consulta passou de 30 s), 503 | <https://developers.hotmart.com/docs/en/start/http-response-codes/> |
| Sandbox | Base `https://sandbox.hotmart.com`, credencial do tipo sandbox, dados **fictícios**. Cada página tem uma tabela de valores de teste (ex.: um `ucode` fixo para a rota de ofertas). Valores fora da tabela dão 404 | <https://developers.hotmart.com/docs/en/start/sandbox/> |

Recomendação para o n8n: `retryOnFail` só para 429 e 5xx, como o plano já diz; em 401, pedir token novo **uma vez** e repetir.

## 5. Payment Link × produto normal: uma decisão que ninguém tomou ainda

A documentação do Payment Link diz que a ferramenta é "para criadores que gerenciam suas vendas e entregam conteúdo **fora** da Hotmart, mas fazem a transação pelo checkout Hotmart", e que dispensa a revisão do produto e o envio de conteúdo à plataforma (<https://developers.hotmart.com/docs/en/v1/payment-link/about-pl/>).

| | Produto normal (painel) | Payment Link (API) |
|---|---|---|
| Criação | Pelo Arthur, no painel | Pelo n8n, por API |
| Preço em EUR | Sim (oferta) | Sim (`currency: EUR`) |
| Order bump e upsell | Sim, no painel (plano atual, `passos_no_painel`) | **Não verificado** |
| Área de membros, entrega | Da Hotmart | **Nossa**: a Hotmart não entrega nada |
| Garantia e reembolso | Configuração do produto (`warranty_period`) | **Não verificado** |
| Revisão da Hotmart antes de vender | Existe (status `IN_REVIEW`) | Documentação diz que dispensa |

Esta tabela não decide nada. Se o Arthur quiser order bump, upsell e garantia padrão, o caminho é o **produto normal pelo painel** (como o plano já assume), e a API só **confere**. O Payment Link vale se a oferta for só "pagar e receber por e-mail/WhatsApp" e o time montar a entrega.

## 6. O que a API da Hotmart NÃO faz (ou que não encontrei)

1. **Não encontrei** endpoint para criar ou editar **produto**. A rota de configuração de produto só liga ou desliga os e-mails transacionais (`PUT /products/api/v1/product/configuration/{product_id}`, <https://developers.hotmart.com/docs/en/v1/product/product-configuration/>).
2. **Não encontrei** endpoint para **order bump** nem **upsell** (não verificado, ver 3.2).
3. **Não lê** o HTML nem o visual do checkout. O plano já sabe que o preço no HTML é desenhado por JavaScript. Por isso, a conferência de preço deve usar 3.2 e **não** a leitura do HTML.
4. **Não mostra** visitas, cliques ou conversão do checkout. O que existe é o histórico de **vendas** (3.6). Quem mede visita é o pixel.
5. **Não faz** campanha, pixel nem Meta. O envio de eventos para a Meta (por exemplo, Conversions API) é da Meta. **Não verificado** se a Hotmart envia o evento de compra ao pixel por conta própria; o plano atual não depende disso.
6. **Cupom:** existe API de cupom (`POST /products/api/v1/product/{product_id}/coupon`, desconto entre 0 e 0,99, <https://developers.hotmart.com/docs/en/v1/coupon/coupon-post-coupon/>). O projeto tem a regra "sem preço riscado falso"; cupom é outra coisa, mas **qualquer desconto exige ok do Arthur**.
7. **Webhooks de compra** (aprovada, reembolso etc.): as páginas de webhook não abriram na minha leitura. **Não verificado.** O que li: o formato dos eventos do Payment Link (`PAYMENT_LINK_APPROVED`, `PAYMENT_LINK_TOKEN`) em <https://developers.hotmart.com/docs/en/v1/payment-link/before-starting/>, e a recomendação de combinar webhook com API em <https://developers.hotmart.com/docs/en/tutorials/learn-good-usage-practices/>. Página de webhooks para conferir depois: <https://developers.hotmart.com/docs/en/>.

## 7. O que muda no plano (propostas, não alterei o plano)

| # | Onde no plano | Proposta | Por quê |
|---|---|---|---|
| 1 | §9, nó `Hotmart · produtos` ("endpoint a confirmar") | Marcar como **confirmado pela doc**. Acrescentar `?id={{hotmart_product_id}}` | Rota e método coincidem com 3.1 |
| 2 | §9, nó `Dados da etapa` | Depois de achar o produto, chamar `GET /products/{ucode}/offers` e conferir `price.value`, `price.currency_code == "EUR"` e `is_main_offer` | A lista de produtos não tem preço; o HTML do checkout não mostra o preço sem JavaScript |
| 3 | §9, "Limite conhecido" | Trocar "a API pública **não cria** produto, checkout…" por "a API **não cria produto, bump nem upsell**; o Payment Link cria checkout (seção 5 de `plano/pesquisa/hotmart-api.md`)" | Payment Link existe e cria checkout em EUR |
| 4 | §9/§10, `hotmart_checkout_url` | Opcional: ler `direct_offer_link_for_creator` da oferta principal (3.2) em vez de pedir o link ao Arthur, **depois de validar** que é o link público | Menos um dado manual |
| 5 | Script `dr-utm` (§8) e item 2 do Revisor (§11) | Repassar também `xcod` aos links da Hotmart e verificar `xcod={{ad.id}}` | A regra fixa do projeto é "na Hotmart, `xcod={{ad.id}}`"; a doc mostra que é o `xcod` que volta em `purchase.tracking.external_code` |
| 6 | §1.2 (credencial `DR · Hotmart`) | Anotar que a URL do token carrega o `client_secret` e que o log do n8n não pode guardá-la | A doc coloca o segredo na query |
| 7 | T-08 e V-02 | Em T-08, o **preço** passa a ser conferido pela API (proposta 2); o navegador headless fica só para o **PageView**. Em V-02, primeiro teste no **sandbox**, com o `ucode` de teste da página de ofertas, antes da credencial de produção | Sandbox é o ambiente oficial de teste, com dados fictícios |

## 8. Resumo do que ficou não verificado

| Tema | Onde procurei |
|---|---|
| Unidade de `warranty_period` (dias?) | <https://developers.hotmart.com/docs/en/v1/product/product-list/> |
| Valor de `payment_mode` para pagamento único em produto novo (`UNIQUE_PAYMENT` ou `PAY_IN_FULL`) | <https://developers.hotmart.com/docs/en/v1/product/product-offers/> |
| Se `direct_offer_link_for_creator` é o link público do comprador | mesma página |
| Comportamento da conversão de moeda para comprador em Portugal | mesma página |
| Se existe API para produto, order bump, upsell | <https://developers.hotmart.com/docs/en/> (menu de produtos e pagamentos) |
| Order bump, upsell, garantia, consentimento de 14 dias e entrega no Payment Link | <https://developers.hotmart.com/docs/en/v1/payment-link/about-pl/> |
| Qual nome vale no corpo da oferta extra: `name` ou `offer_name` | <https://developers.hotmart.com/docs/en/v1/payment-link/create-additional-offer/> |
| Alternativa ao `client_secret` na query do token | <https://developers.hotmart.com/docs/en/start/app-auth/> |
| Webhooks de compra (formato dos eventos, reembolso) | <https://developers.hotmart.com/docs/en/> (as páginas não abriram) |
| Se a Hotmart envia a compra ao pixel da Meta sozinha | não encontrado na documentação oficial de API |
| Tudo o que depende de chamada real (campos exatos, limites por rota) | exige credencial, D-03 e P-12 |
