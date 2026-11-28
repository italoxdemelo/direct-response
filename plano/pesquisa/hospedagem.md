# Hospedagem da página (G-03)

**Tarefa:** G-03 de `plano/DIVISAO-TAREFAS.md` · **Entrada:** `H-20261127-grok-04` · **Autor:** italo — Grok
**Pesquisado em:** 2026-11-27 (America/Bahia) · **Fonte:** só páginas oficiais de preço e documentação de cada serviço (links em cada seção).
**Alimenta:** T-05 (nó de deploy da página, `plano/PLANO-DE-ACAO.md` §15.2) e D-07 (domínio).

> **Limites desta pesquisa.** Nenhuma conta foi criada e nenhum deploy foi feito. Preços em **dólar**, como as páginas oficiais mostram. As contas de consumo (visitas por mês) são **estimativas minhas** e dizem quais suposições usei. Tudo o que não confirmei em página oficial está marcado como **não verificado**.

## 1. Recomendação

1. **Para ir ao ar e deixar o n8n publicar sozinho: Netlify.** É a única das opções em que o deploy é **uma chamada HTTP** com o site inteiro num `.zip` (`POST /api/v1/sites/{site_id}/deploys`, `Content-Type: application/zip`). O Construtor já grava o `index.html` e a página é estática, então o nó do T-05 fica pequeno. HTTPS com certificado Let's Encrypt é automático ao ligar o domínio. O Netlify também já está ligado ao GitHub do Italo (texto de G-03).
2. **O risco do Netlify é o plano grátis ter limite duro:** quando acabam os **300 créditos/mês**, **todos os sites do projeto são pausados** e o visitante vê "Site not available". Com anúncios ligados, isso queima verba. Regra proposta: **antes de ativar anúncios**, o Arthur decide entre (a) ficar no grátis só para o teste inicial, com alerta de consumo, ou (b) assinar o **Personal (US$ 9 por mês, 1.000 créditos)**. **Qualquer assinatura exige o ok do Arthur.**
3. **Plano B, mais barato e sem pausa por consumo: Cloudflare** (Workers com arquivos estáticos, ou Pages). Requisições a arquivos estáticos são **grátis e ilimitadas** na documentação. O deploy por API é **mais trabalhoso** (4 chamadas, com cálculo de hash por arquivo) ou exige o `wrangler` (Node) no servidor do n8n. Como a página é HTML puro, **trocar de uma hospedagem para outra depois é fácil** (o mesmo `.zip` serve).
4. **Render:** funciona e o plano grátis serve para site estático, mas **o deploy é por Git** (precisa de commit num repositório). Isso obriga o n8n a falar com o GitHub além de com o Render, e a página não deve ir para o repositório público do projeto. Fica em terceiro.
5. **Vercel Hobby: não usar.** Os Termos de Serviço dizem que o Hobby é só para "uso pessoal ou não comercial". Anúncio pago para vender curso é uso comercial. O Vercel Pro custa US$ 20 por mês por assento de desenvolvedor.
6. **Domínio próprio:** em qualquer opção é preciso um domínio (D-07). **Comprar domínio é gasto: só com ok do Arthur.** O repositório não tem domínio definido.

## 2. Comparação

| Critério | Netlify | Render (site estático) | Cloudflare (Workers estático / Pages) | Vercel |
|---|---|---|---|---|
| **Custo para começar** | Grátis: 300 créditos/mês, limite duro. Personal US$ 9/mês (1.000 créditos). Pro US$ 20/mês (3.000) | Plano Hobby US$ 0/mês: 5 GB de banda incluídos; passou disso, **cobra o excedente** (valor **não verificado**) | Grátis. Arquivos estáticos: requisições grátis e ilimitadas, sem custo de armazenamento | Hobby grátis, **proibido uso comercial** (Termos). Pro US$ 20/mês por assento |
| **O que acontece ao passar do grátis** | **Pausa todos os sites** até o mês virar, a menos que haja créditos comprados | Cobra o excedente de banda e minutos de build | Estático não passa de limite por requisição. Limites de arquivos (20.000) e tamanho (25 MiB por arquivo) | Em geral bloqueia o recurso por 30 dias (Hobby) |
| **Domínio próprio com HTTPS** | Sim. Certificado Let's Encrypt automático e renovação automática, com qualquer DNS | Sim. 2 domínios incluídos no Hobby; certificado TLS automático e grátis | Sim. Em Workers, o domínio precisa estar numa **zona ativa da Cloudflare** (DNS na Cloudflare). Em Pages com DNS externo: **não verificado** | Sim (50 domínios por projeto no Hobby), mas ver Termos |
| **Deploy por API a partir do n8n** | **1 chamada**: `POST` com o `.zip` (até 25.000 arquivos). Há também nó oficial do n8n para Netlify | Não direto: deploy ocorre ao **commitar num repositório** (Git). O n8n teria de fazer commit (nó do GitHub) e/ou chamar a API do Render para acionar deploy (rota exata: **não verificado**) | **Workers estático:** 4 etapas (manifesto com hash, envio dos arquivos em Base64, criar versão, criar implantação). **Pages:** `POST .../pages/projects/{nome}/deployments` com `manifest`; o envio dos arquivos por API **não está na página que li**. A via oficial simples é o `wrangler` | `POST /v13/deployments` com `files` (conteúdo embutido ou por SHA) |
| **Tempo até ficar no ar (estimativa minha)** | Minutos até o endereço `*.netlify.app`; com domínio próprio, depende da propagação do DNS | Minutos depois de conectar o repositório; com domínio, DNS | Minutos até `*.workers.dev` ou `*.pages.dev`; com domínio, o domínio já está na Cloudflare | Minutos |
| **Esforço no workflow** | **Baixo** | Médio (GitHub + Render) | **Médio a alto** (hash e 4 chamadas, ou `wrangler`) | Baixo, mas bloqueado pelos Termos |
| **Risco principal** | Pausa por consumo no grátis | Página em repositório; excedente de banda | Complexidade do deploy; domínio exige DNS na Cloudflare (Workers) | Violação dos Termos no Hobby |

## 3. Netlify

Fontes: preços <https://www.netlify.com/pricing/>; créditos <https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/>; API <https://docs.netlify.com/api-and-cli-guides/api-guides/get-started-with-api/>; HTTPS <https://docs.netlify.com/manage/domains/secure-domains-with-https/https-ssl/>.

1. **Planos (contas novas desde 2025-09-04 usam créditos):** Free US$ 0 (300 créditos, limite duro); Personal US$ 9/mês (1.000 créditos, pode comprar mais); Pro US$ 20/mês (3.000 créditos). Pacote de créditos Personal: 500 por US$ 5; recarga automática (desligada por padrão, só o dono da equipe liga).
2. **Consumo:** deploy de produção **15 créditos** cada; **banda 20 créditos por GB**; **requisições 2 créditos por 10.000**; deploy preview e deploy falho ou rollback não gastam. Formulários grátis.
3. **Quanto dura o grátis (estimativa minha, não medida):** supondo página de 1,5 MB e 15 requisições por visita, cada visita custa cerca de 0,03 crédito (banda 0,03 + requisições 0,003). Com 5 deploys no mês (75 créditos), sobram ~225 créditos, ou **uns 6 a 7 mil visitantes por mês** antes da pausa. Página mais leve rende mais. Para o teste inicial isso costuma bastar; para escalar, não.
4. **API de deploy (documentada):** autenticação OAuth2 com **token de acesso pessoal** (`Authorization: Bearer <token>`; o token é invalidado se a senha da conta for redefinida). Rotas: `POST https://api.netlify.com/api/v1/sites/{site_id}/deploys` com `Content-Type: application/zip` e o `.zip` no corpo; depois `GET /api/v1/deploys/{deploy_id}` até `state: "ready"` ("deploy no ar"). Site novo: o mesmo `POST` em `/api/v1/sites` com o zip. O limite é **25.000 arquivos** por zip e é sempre **um zip com todos os arquivos**. Chamadas acima de 30 s são cortadas (relevante para o modo por digest, não para zip pequeno). A API também tem limite de taxa (valor **não verificado**).
5. **Fluxo proposto para o T-05:** `Compression` do n8n (gera o zip do `index.html` e assets) → `HTTP Request` `POST` com o zip → laço de `GET` até `ready` → grava `url_pagina_publicada`. A Construtor deve regravar o HTML antes e o Funil de novo depois (como o plano já prevê).
6. **Domínio:** adicionar o domínio no painel; com DNS externo, apontar os registros que o painel mostrar; o certificado sai sozinho quando o DNS valida. A página de domínio do Netlify que consultei devolveu 404; a regra de DNS externo veio de um resumo de busca (<https://docs.netlify.com/manage/domains/secure-domains-with-https/https-ssl/> confirma só o certificado automático). **Não verificado:** tempo de propagação e registros exatos.

## 4. Render

Fontes: <https://render.com/docs/static-sites>, <https://render.com/docs/deploys>, <https://render.com/pricing>, <https://render.com/docs/api>.

1. **Site estático:** CDN global, HTTPS e certificado automáticos, redirecionamento de HTTP para HTTPS, cabeçalhos personalizados, deploys atômicos. Preço do site: **grátis**; consome **banda de saída** e **minutos de build** do workspace.
2. **Hobby:** US$ 0 por mês, 5 GB de banda inclusos, 2 domínios próprios inclusos (cada domínio extra US$ 0,25 por mês). Pro US$ 25/mês (25 GB).
3. **Deploy:** "ligue o repositório Git e o Render atualiza o site a cada push". Deploys manuais podem ser acionados por painel ou programaticamente; **serviços de repositório público por URL e imagens Docker só fazem deploy manual**. A API REST (`https://api.render.com/v1/...`, chave `Authorization: Bearer`) cobre "deploys de serviço". A rota exata para acionar deploy **não li**. **Não verificado.**
4. **Consequência para o projeto:** sem repositório, não há deploy. O n8n teria que gravar o HTML num repositório (nó do GitHub). O repositório do projeto é **público** e não deve receber a página (ela leva pixel e link de checkout): seria preciso um repositório **separado e privado**. Mais peças, mais pontos de falha.

## 5. Cloudflare

Fontes: <https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/>, <https://developers.cloudflare.com/workers/static-assets/direct-upload/>, <https://developers.cloudflare.com/pages/get-started/direct-upload/>, <https://developers.cloudflare.com/pages/platform/limits/>, <https://developers.cloudflare.com/api/resources/pages/subresources/projects/subresources/deployments/methods/create/>, <https://developers.cloudflare.com/workers/configuration/routing/custom-domains/>.

1. **Custo:** requisições a arquivos estáticos são "grátis e ilimitadas"; armazenar arquivos não tem custo extra. Só requisições que **invocam um Worker** contam. Atenção ao `run_worker_first`: no plano grátis, passar do limite devolve **429** para esses caminhos.
2. **Pages × Workers:** o Pages **não está descontinuado**, mas a Cloudflare recomenda **começar projetos novos em Workers com arquivos estáticos** (resumo de busca; confira em <https://developers.cloudflare.com/pages/get-started/>). Limites do Pages grátis: 20.000 arquivos, **25 MiB por arquivo**, 500 builds por mês (só vale para build por Git), 100 projetos por conta, 100 domínios por projeto, retenção de 30 dias das implantações antigas.
3. **Deploy por API, Workers (documentado, 4 etapas):** (a) `POST /accounts/{account_id}/workers/scripts/{script_name}/assets-upload-session` com o manifesto `{"/index.html": {"hash": "...", "size": N}}`, que devolve um JWT (válido por 1 hora) e as "buckets" de arquivos a enviar; (b) enviar os arquivos em `multipart/form-data`, **em Base64** e com `base64=true`; (c) criar a versão do Worker com os ativos; (d) criar a implantação. O **hash** é de 32 caracteres hexadecimais; no exemplo oficial em código, é `sha256(conteúdo_em_base64 + extensão)`. Dá para fazer em nós `Code` e `HTTP Request` do n8n, mas é bem mais coisa que um zip.
4. **Deploy por API, Pages:** `POST /accounts/{account_id}/pages/projects/{project_name}/deployments`, formulário com `manifest` (JSON de caminho → hash, até 20.000 entradas) "obrigatório para Direct Upload". O **envio do conteúdo dos arquivos** por API não está na página que li. **Não verificado.** O caminho oficial é `npx wrangler pages deploy <pasta>` (aceita pasta, **não zip**). Se escolher Direct Upload no Pages, **não dá para migrar para integração Git depois**.
5. **Domínio:** em Workers, "Custom Domain" exige **zona ativa na Cloudflare** e cria o DNS e o certificado sozinho. Isso significa **ter o DNS do domínio na Cloudflare**. Se o domínio for comprado em outro lugar, é preciso mudar os servidores de nome. Não vale em hostname que já tem um registro CNAME. Em Pages com DNS externo: **não verificado**.
6. **Wrangler no n8n:** exigiria Node no servidor e o nó `Execute Command` do n8n. **Não verificado** se esse nó está habilitado na instalação do Italo.

## 6. Vercel (descartado)

Fontes: Termos <https://vercel.com/legal/terms> (seção do plano Hobby), <https://vercel.com/docs/plans/hobby>, <https://vercel.com/docs/rest-api/reference/endpoints/deployments/create-a-new-deployment>.

1. Texto dos Termos: o Hobby é oferecido "a nosso exclusivo critério" e o usuário "só deve usar os Serviços no plano Hobby para uso **pessoal ou não comercial**"; a Vercel pode desativar ou remover deploys do Hobby "com ou sem aviso". Vender com anúncio pago **não** é uso pessoal ou não comercial.
2. No plano Pro, assentos de desenvolvedor custam US$ 20 por usuário por mês (página do Hobby). A API (`POST /v13/deployments`) aceita arquivos embutidos ou por SHA, então tecnicamente seria fácil. Seria uma segunda opção paga ao lado do Netlify Personal, sem vantagem para uma página estática.

## 7. O que depende do Arthur (dinheiro e decisão)

| Item | Custo | Quando | Quem decide |
|---|---|---|---|
| Domínio da página (D-07) | preço do registro, **não definido** | Antes de ligar pixel e conferir UTM | Arthur (qualquer compra) |
| Netlify Personal | US$ 9 por mês | Antes de ativar anúncios, se o consumo passar de ~60% dos 300 créditos ou se o Arthur não quiser risco de pausa | Arthur |
| Créditos extras Netlify (pacote ou recarga automática) | US$ 5 por 500 créditos (Personal) | Só se o Arthur quiser | Arthur |
| Conta Cloudflare (plano B) | grátis | Só se migrar | Arthur |

## 8. Passos sugeridos para o T-05 (se o Arthur aprovar o Netlify)

1. Italo cria a conta e o projeto no Netlify e gera um **token de acesso pessoal**. Esse token vai para uma credencial do n8n (`DR · Netlify`), **nunca** para o Git nem para o chat (P-12 e regra fixa 6).
2. Primeiro deploy à mão, só para criar o `site_id`. O `site_id` fica no `config` do n8n (não no repositório).
3. Nó `Publicar página`: zip → `POST /sites/{site_id}/deploys` → espera `ready` → grava `url_pagina_publicada`.
4. Depois do deploy, o Revisor confere links, pixel, UTM e `PageView` na **URL publicada** (T-08).
5. Se o consumo chegar a ~60% dos créditos, avisar o Arthur com o link do painel de uso.

## 9. Resumo do que ficou não verificado

| Tema | Onde procurei |
|---|---|
| Valor do excedente de banda do Render | <https://render.com/docs/static-sites> e <https://render.com/pricing> (só diz que cobra) |
| Rota exata da API do Render para acionar deploy | <https://render.com/docs/deploys>, <https://render.com/docs/api> |
| Envio dos arquivos do Pages por API (depois do manifesto) | <https://developers.cloudflare.com/api/resources/pages/subresources/projects/subresources/deployments/methods/create/> |
| Pages com DNS externo (domínio fora da Cloudflare) | <https://developers.cloudflare.com/pages/platform/limits/> |
| Nó `Execute Command` habilitado no n8n do Italo | depende da instalação |
| Registros DNS exatos e tempo de propagação no Netlify | <https://docs.netlify.com/manage/domains/secure-domains-with-https/https-ssl/> (a página de domínios deu 404) |
| Limite de taxa da API do Netlify (valor) | <https://docs.netlify.com/api-and-cli-guides/api-guides/get-started-with-api/> |
| Pages "não descontinuado, Workers recomendado" (resumo de busca) | <https://developers.cloudflare.com/pages/get-started/> |
| Contas de visitas por mês | são estimativas minhas (página de 1,5 MB, 15 requisições por visita) |
| Preço de domínio e de registrador | não consultado (sem domínio definido) |
