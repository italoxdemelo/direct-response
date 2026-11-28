# Direct Response no n8n

Time de direct response para levar ofertas low ticket que escalaram no Brasil para outro país (começando por Portugal), montado no n8n local (`http://localhost:5678`) com o **GROK BOT** (xAI) orientando e supervisionando cada etapa.

Este diretório é a **fonte da verdade** do fluxo (veio do PC do Italo em 27/11/2026, `H-20261127-italo-03`). Os JSON em `workflows/` são a exportação de 26/11 e são regravados pelo `gerar.mjs` ao publicar.

Todos os workflows têm a tag **Direct Response** e o prefixo `Direct Response ·`.

| Workflow | Integração da etapa | O que o código confere |
|---|---|---|
| 00 Coordenador (GROK BOT) | chama as 7 etapas em ordem | para na primeira etapa não aprovada e entrega o progresso em lista numerada, com prazos |
| 01 Radar (minerador) | Meta Ad Library API no país de destino (por termo e pela página BR) | a API respondeu; números BR sem print ficam "não verificado" |
| 02 Headline Killer (copywriter) | baixa a página original | 10 headlines, 5 roteiros, 3 briefings; sem preço riscado, sem claim de saúde, sem "você" em pt-PT |
| 03 Construtor (página) | grava `index.html`; Graph API do pixel (`last_fired_time`) | pixel com o ID certo, PageView e UTM na página publicada; pixel disparou |
| 04 Funil (Hotmart) | OAuth + API de produtos da Hotmart; checkout no ar | produto existe, checkout responde, botões com o link do checkout |
| 05 Claquete (criativos) | xAI Images API | imagens geradas; vídeos roteirizados (render fica com o gerador que preferir) |
| 06 Revisor | página, checkout e pixel | checklist de 7 itens + revisão de idioma; só aprova com 100% |
| 07 Tráfego (sempre PAUSADO) | Meta Marketing API | campanha e conjuntos criados PAUSED, reforço PAUSED e conferência na API |

Cada etapa: **integração → GROK BOT orienta (briefing) → agente → verificações por código → GROK BOT supervisiona → saída**. Uma etapa só é aprovada se o supervisor aprovar **e** todas as verificações por código passarem.

## Como usar

1. No n8n, abra **Credentials** e cole as chaves:
   - **DR · xAI Grok** — chave da API em console.x.ai.
   - **DR · Meta (token de sistema)** — token de usuário do sistema do Business Manager com `ads_management`, `ads_read` e acesso à Ad Library API (identidade verificada em facebook.com/ID).
   - **DR · Hotmart** — campo JSON: `Authorization: Basic ...`, `client_id` e `client_secret` (Hotmart > Ferramentas > Credenciais de API).
2. Abra **Direct Response · 00 Coordenador (GROK BOT)**, edite o nó **⚙️ Configuração** e clique em **Execute workflow**.
3. Para rodar só algumas etapas, ajuste `etapas_ativas`.

Limites conhecidos (honestos):
- A Ad Library API só devolve anúncios comerciais de países da UE. Os números do Brasil vêm de prints (campo `ofertas_br`); sem print ficam "não verificado".
- A API pública da Hotmart não cria produto, checkout, bump nem upsell. O Funil entrega a ficha de configuração para o painel e confere o que dá pela API.
- O Construtor grava o HTML em `canal-dark-n8n/data/direct-response/<slug>/index.html` (pasta que o n8n pode escrever). Publicar no domínio é com você; depois preencha `url_pagina_publicada`.
- O Tráfego cria campanha e conjuntos (PAUSED). Os anúncios dentro dos conjuntos ainda não são criados.

## Robustez (desde 27/11/2026)

- **Erros:** o workflow `99 Erros` é o *Error workflow* de todos; grava um arquivo por erro em `canal-dark-n8n/data/direct-response/erros/` (Telegram opcional, desativado). Os nós Grok tentam 3 vezes; se ainda falharem, a etapa reprova com motivo e a rodada chega ao relatório.
- **Estado entre rodadas:** o coordenador lê e grava `<pasta_saida>/<slug>/estado.json`. Uma etapa pulada mantém a entrega da rodada anterior.
- **Copy congelada:** o relatório mostra a versão da copy (`v1a2b3c4d`). Com `copy_aprovada: true` e `copy_aprovada_hash` igual a essa versão, o Headline Killer não gera de novo, e Construtor e Claquete só usam essa versão.
- **Sem duplicar campanha:** o Tráfego procura a campanha pelo nome (`campanha_nome` ou `DR | <oferta> | <país>`) antes de criar; se existe, reutiliza e não altera nada.
- **Radar paginado:** lê até 25 páginas de 200 anúncios por consulta.

## Manutenção

```powershell
node tools/testar-codigos.mjs   # testa a lógica dos nós Code com dados simulados
node tools/gerar.mjs            # regenera e republica (atualiza pelo nome; precisa de N8N_API_KEY)
node tools/gerar.mjs --so-json  # só gera os JSON (sem publicar), para conferir com checar.mjs
node tools/checar.mjs           # confere sintaxe e referências dos JSON em workflows/
```

Prompts dos agentes e do supervisor: `tools/prompts.mjs`. Lógica dos nós Code: `tools/codigos.mjs`.
Os sub-workflows ficam publicados (ativos) porque o n8n 2.x só deixa chamar sub-workflow publicado; eles só têm o gatilho "Execute Workflow Trigger", então não disparam sozinhos.
