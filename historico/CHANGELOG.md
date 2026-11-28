# Histórico de decisões e mudanças

Log de tudo o que muda no projeto, **entrada mais recente no topo**. Toda IA lê este arquivo antes de agir e acrescenta uma entrada depois de agir (regras em `AGENTS.md`, modelo em `historico/MODELO-ENTRADA.md`, ligações entre entradas em `historico/MAPA-DEPENDENCIAS.md`).

- Não apague nem reescreva entradas antigas. Para corrigir uma, crie outra com **Tipo: correção** e **Continua:** apontando para ela.
- O que aconteceu **antes** deste repositório está nos marcos `C-01` a `C-07` do mapa e em `contexto/00-LEIA-PRIMEIRO.md`.

<!-- NOVAS ENTRADAS AQUI (logo abaixo desta linha) -->

### H-20261127-grok-06 — Revisar os prompts dos agentes (G-04)

- **Data/hora:** 2026-11-27 22:34 (America/Bahia UTC-3)
- **Autor:** italo — Grok
- **Tipo:** mudança de arquivo
- **O que mudou:** Criado `plano/rascunhos/prompts-revisados.md`: achados por agente (14), blocos novos `REGRAS_PT_PT` e `REGRAS_SAUDE_META`, prompt completo do Headline Killer que recebe `config.decisoes`, acréscimos para Construtor, Revisor, Funil, Claquete, Radar e Tráfego, contrato dos campos de `config.decisoes` e lista de mudanças de código (para a C-05). Proposta de nova pendência P-15 (consentimento de cookies e pixel). **Nenhum arquivo de `n8n/` foi alterado.** G-04 estava marcada "espera C-01": a C-01 foi cumprida com a entrada `H-20261127-italo-03` (o `prompts.mjs` entrou no `main`).
- **Por quê:** Tarefa G-04 de `plano/DIVISAO-TAREFAS.md` (T-04, C-05).
- **Arquivos tocados:** `plano/rascunhos/prompts-revisados.md`, `plano/DIVISAO-TAREFAS.md` (status G-04), `historico/CHANGELOG.md`, `historico/MAPA-DEPENDENCIAS.md`
- **Continua:** H-20261127-grok-05
- **Depende de:** H-20261127-italo-03
- **Resolve:** —
- **Abre:** P-15
- **Verificação:** Li `n8n/tools/prompts.mjs` e `codigos.mjs` (commit 3354704) e rodei a lógica dos nós com dados simulados (`plano/rascunhos/simular-revisor.mjs`). Políticas da Meta de atributos pessoais (27/06/2024) e de saúde e bem-estar (27/12/2024) lidas no site oficial; documentação do pixel da Meta sobre consentimento lida. **Não verificado:** efeito dos textos no modelo (sem chave da xAI, I-01), lista de brasileirismos (conhecimento linguístico meu), obrigatoriedade do consentimento (Termos da Meta não abriram), regra do direito de livre resolução na UE. Sem segredo, `pixel_id` real nem dado pessoal.
- **Próximo passo:** Claude (C-05) cola os blocos no `prompts.mjs`, cria `config.decisoes` e corrige as regex (seção 5 do arquivo); Arthur e um jurista decidem P-15; o Arthur responde as perguntas de `plano/rascunhos/perguntas-arthur.md` antes de a C-05 ter o que preencher.

### H-20261127-grok-05 — Roteiro de testes do Revisor (G-06)

- **Data/hora:** 2026-11-27 22:34 (America/Bahia UTC-3)
- **Autor:** italo — Grok
- **Tipo:** mudança de arquivo
- **O que mudou:** Criado `plano/rascunhos/testes-revisor.md`: para cada um dos 7 itens do checklist do Revisor (§11 do plano), as quebras de propósito, o que o Revisor deve responder e onde o código atual provavelmente deixa passar (lacunas). Inclui três itens que o plano ainda não cobre (UTM e `xcod`, copy, campanhas e anúncios PAUSADOS), testes da saída do agente e da aprovação a 100%, e tabela de execução.
- **Por quê:** Tarefa G-06 de `plano/DIVISAO-TAREFAS.md` (V-02). A seção 11 do plano manda "quebrar de propósito cada item" e não dizia como.
- **Arquivos tocados:** `plano/rascunhos/testes-revisor.md`, `plano/rascunhos/simular-revisor.mjs`, `plano/DIVISAO-TAREFAS.md` (status G-06), `historico/CHANGELOG.md`, `historico/MAPA-DEPENDENCIAS.md`
- **Continua:** H-20261127-grok-04
- **Depende de:** —
- **Resolve:** —
- **Abre:** —
- **Verificação:** Como `n8n/tools/codigos.mjs` já está no `main` (3354704), rodei os nós Code do Revisor, da regex de claims e do Tráfego com dados simulados (sem rede, sem n8n, sem credencial) com o script novo `plano/rascunhos/simular-revisor.mjs` (`node plano/rascunhos/simular-revisor.mjs`); o resultado está na seção 1A do arquivo. Lacunas **confirmadas em código**: PageView dentro de comentário passa; `lang="pt-BR"` passa no item 6; "de 29,90 € por" (símbolo depois do número) passa como preço normal; "114,90" casa com o preço "14,90"; link sem `utm`/`xcod` passa; botão para domínio fora do filtro `hotmart|pay.|checkout` não é conferido; pixel que disparou há anos passa; URL de criativo não é checada; "Perca 10 kg", "Só hoje" e "Últimas 10 vagas" passam na regex de claims; e a lista `removido_por_risco` do Headline Killer **dispara** a regex (falso positivo). A trava de PAUSED funciona (payload com "ACTIVE" lança erro e nada é enviado). **Não verificado:** comportamento no n8n real (HTTP, `neverError`) e o item 8.3 (cruzamento do checklist com o agente, que fica em outro nó); nada foi chamado na Meta nem na Hotmart. Os itens do checklist do plano diferem da lista citada na conversa: UTM, copy e PAUSADAS ficaram como propostas B1 a B3. Sem segredo, `pixel_id` real nem dado pessoal (só `PIXEL_DE_TESTE` e domínios `.invalid`).
- **Próximo passo:** Claude abre T-xx para cada lacuna da seção 1A (resumo na seção 5 de `plano/rascunhos/prompts-revisados.md`); Italo roda a tabela da seção 6 na V-02 com credencial real. Decidir se B1 a B3 entram no checklist (§11).

### H-20261127-grok-04 — Comparar hospedagens para a página (G-03)

- **Data/hora:** 2026-11-27 22:34 (America/Bahia UTC-3)
- **Autor:** italo — Grok
- **Tipo:** mudança de arquivo
- **O que mudou:** Criado `plano/pesquisa/hospedagem.md`: comparação de Netlify, Render, Cloudflare (Workers com arquivos estáticos e Pages) e Vercel por custo, domínio próprio com HTTPS, deploy por API a partir do n8n e tempo até ir ao ar. Recomendação: Netlify (deploy por zip em uma chamada), com aviso do limite duro do plano grátis; Cloudflare como plano B; Render em terceiro; Vercel Hobby descartado (Termos proíbem uso comercial).
- **Por quê:** Tarefa G-03 de `plano/DIVISAO-TAREFAS.md` (D-07, T-05). Só preços e documentação oficial de cada serviço.
- **Arquivos tocados:** `plano/pesquisa/hospedagem.md`, `plano/DIVISAO-TAREFAS.md` (status G-03), `historico/CHANGELOG.md`, `historico/MAPA-DEPENDENCIAS.md`
- **Continua:** H-20261127-grok-03
- **Depende de:** —
- **Resolve:** —
- **Abre:** —
- **Verificação:** Nenhuma conta criada, nenhum deploy feito. Preços em dólar, conforme as páginas oficiais em 2026-11-27. Termos da Vercel lidos na fonte. Contas de visitas por mês são estimativas e dizem as suposições. Ficaram **não verificado**: excedente de banda do Render, rota de deploy da API do Render, envio de arquivos do Pages por API, Pages com DNS externo, registros DNS do Netlify (página de domínios deu 404) e se o nó `Execute Command` está ligado no n8n (seção 9 do arquivo). Sem segredo nem dado pessoal.
- **Próximo passo:** Arthur aprova a escolha de hospedagem e o domínio (gasto: só com ok dele); Italo cria a conta, o token e a credencial `DR · Netlify` no n8n; Claude implementa o T-05.

### H-20261127-grok-03 — Pesquisar a Meta Marketing API para anúncios pausados e a Ad Library (G-02)

- **Data/hora:** 2026-11-27 22:34 (America/Bahia UTC-3)
- **Autor:** italo — Grok
- **Tipo:** mudança de arquivo
- **O que mudou:** Criado `plano/pesquisa/meta-ads-api.md`: passo a passo `adimages` → `adcreatives` (com `url_tags` `utm_content={{ad.id}}` e `xcod={{ad.id}}`) → `ads` com `status=PAUSED`, campos obrigatórios, ensaio com `validate_only`, conferência por API, busca de campanha por nome, limites de taxa, limites da Ad Library API fora da UE e 10 propostas de ajuste no plano. Também ajustados: pergunta 10 de `plano/rascunhos/perguntas-arthur.md` e a pendência P-14 (agora inclui pagador e beneficiário DSA).
- **Por quê:** Tarefa G-02 de `plano/DIVISAO-TAREFAS.md` (T-06, T-07, risco R-6). Só documentação oficial da Meta.
- **Arquivos tocados:** `plano/pesquisa/meta-ads-api.md`, `plano/rascunhos/perguntas-arthur.md`, `plano/DIVISAO-TAREFAS.md` (status G-02), `historico/CHANGELOG.md`, `historico/MAPA-DEPENDENCIAS.md`
- **Continua:** H-20261127-grok-02
- **Depende de:** —
- **Resolve:** —
- **Abre:** —
- **Verificação:** Nenhuma chamada real (sem credencial, P-12). Achados da leitura da documentação: (1) `graph_version` do plano (`v23.0`) expirou em 2026-06-09; (2) conjuntos que miram a UE exigem `dsa_payor` e `dsa_beneficiary`, e o payload do Tráfego não tem; (3) anúncio exige `conversion_domain` com pixel; (4) a conferência `effective_status` do plano reprovaria anúncio recém-criado (fica em `PENDING_REVIEW`); (5) a Ad Library API não devolve anúncio comercial só do Brasil. Filtro por nome de campanha, upload multipart de imagem, permissões do token e retenção/token da Ad Library ficaram **não verificado** (seção 9 do arquivo). Sem segredo, `pixel_id`, `ad_account_id`, `page_id` nem dado pessoal: só marcadores. O plano **não foi alterado**.
- **Conferido também contra o código do `main` (3354704):** o Tráfego usa o filtro `filtering` por nome, que não está na documentação oficial que li, e reaproveita o 1.º resultado sem comparar o nome (seção 5, item 7 do arquivo); `v23.0` continua em três lugares do código. **Próximo passo:** Claude (C-06, C-07) aplica as propostas 1 a 8 no workflow 07 Tráfego depois de o Italo confirmar a versão. Arthur responde a pergunta 10 (Página, moeda, pagador e beneficiário).

### H-20261127-grok-02 — Pesquisar a API da Hotmart na documentação oficial (G-01)

- **Data/hora:** 2026-11-27 22:34 (America/Bahia UTC-3)
- **Autor:** italo — Grok
- **Tipo:** mudança de arquivo
- **O que mudou:** Criado `plano/pesquisa/hotmart-api.md`: OAuth `client_credentials` (URL, headers, resposta), `GET /products/api/v1/products` (confirmado, sem preço), `GET /products/{ucode}/offers` (preço, moeda, `payment_mode`), API de Payment Link (cria checkout em EUR e ofertas extras), histórico de vendas (traz `src`, `sck` e `xcod`), rate limit, paginação, sandbox, o que a API não faz e 7 propostas de ajuste no plano.
- **Por quê:** Tarefa G-01 de `plano/DIVISAO-TAREFAS.md` (risco R-3: o endpoint de produtos estava "a confirmar"). Só documentação oficial, <https://developers.hotmart.com/docs/en/>.
- **Arquivos tocados:** `plano/pesquisa/hotmart-api.md`, `plano/DIVISAO-TAREFAS.md` (status G-01), `historico/CHANGELOG.md`, `historico/MAPA-DEPENDENCIAS.md`
- **Continua:** H-20261127-grok-01
- **Depende de:** —
- **Resolve:** —
- **Abre:** —
- **Verificação:** Nenhuma chamada real (não há credencial, P-12): tudo vem da leitura da documentação. Exemplos de resposta com valores fictícios. Sem segredo, `pixel_id`, `ad_account_id` nem dado pessoal. Itens que a documentação não confirma ficaram como **não verificado**, com o link (seção 8 do arquivo). Achado importante: o plano diz que a API "não cria checkout"; a API de Payment Link cria, mas é para quem entrega o conteúdo fora da Hotmart. O `dr-utm` do plano não repassa `xcod`. O plano **não foi alterado**: as mudanças estão só como proposta (seção 7).
- **Próximo passo:** Claude (C-02/C-05) decide quais propostas da seção 7 entram no plano e no workflow 04. Arthur decide se usa produto normal ou Payment Link (seção 5). Teste real no sandbox quando houver credencial (D-03).

### H-20261127-grok-01 — Preparar as perguntas para o Arthur (G-05)

- **Data/hora:** 2026-11-27 22:34 (America/Bahia UTC-3)
- **Autor:** italo — Grok
- **Tipo:** mudança de arquivo
- **O que mudou:** Criado `plano/rascunhos/perguntas-arthur.md` com a mensagem pronta (PT-BR, 12 perguntas em múltipla escolha) que cobre P-01 a P-08 e D-08, mais bumps e upsell, pixel, Página do Facebook, moeda da conta de anúncios e domínio. Cada pergunta diz o que a resposta destrava. Abertas duas pendências novas no mapa: P-13 (bumps e upsell) e P-14 (Página e moeda da conta).
- **Por quê:** Tarefa G-05 de `plano/DIVISAO-TAREFAS.md`: as decisões do Arthur são o maior gargalo (risco R-1). O Italo pediu ao Grok para assumir as tarefas na ordem sugerida.
- **Arquivos tocados:** `plano/rascunhos/perguntas-arthur.md`, `plano/DIVISAO-TAREFAS.md` (status G-05), `historico/CHANGELOG.md`, `historico/MAPA-DEPENDENCIAS.md`
- **Continua:** H-20261127-italo-07
- **Depende de:** —
- **Resolve:** —
- **Abre:** P-13, P-14
- **Verificação:** Perguntas conferidas contra `contexto/00-LEIA-PRIMEIRO.md` §5 e `historico/MAPA-DEPENDENCIAS.md` (P-01 a P-09, D-07, D-08). Nenhuma senha, token, `pixel_id` ou `ad_account_id` no arquivo. A mensagem **ainda não foi enviada** ao Arthur. A copy do Método EIXO 7 não está no repositório (só a primeira adaptação, em `contexto/`), então o Italo precisa anexá-la. Sobre garantia e 14 dias, o texto da Diretiva 2011/83/UE **não foi aberto** (EUR-Lex bloqueou a leitura): ficou como **não verificado**, com a fonte.
- **Próximo passo:** Italo (I-03) envia a mensagem ao Arthur, anexa a copy do Método EIXO 7 e registra as respostas em nova entrada, fechando P-01 a P-08 conforme o caso.

### H-20261127-italo-07 — Publicar no n8n o gerador com 99 Erros, estado e Tráfego sem duplicar

- **Data/hora:** 2026-11-27 22:16 (America/Bahia UTC-3)
- **Autor:** italo — Claude
- **Tipo:** ação externa
- **O que mudou:** A 1.ª tentativa de publicar (`node tools/gerar.mjs`) criou o `99 Erros` e parou no Radar com `PUT /workflows/ZEwHqbQbTRpqwbZm -> 400: "The selected error workflow has no published version."`: o n8n 2.x exige que o *Error workflow* tenha versão publicada (ativa). O gerador foi corrigido para ativar o `99 Erros` logo depois de criá-lo ou atualizá-lo (o gatilho de erro não dispara sozinho). Com a correção, a 2.ª execução ainda recebeu o mesmo 400 logo após ativar; a 3.ª saiu inteira (o `99 Erros` já estava publicado). Publicados: 99 Erros `rUNQVY24WtvxDK5l`, 01 Radar `ZEwHqbQbTRpqwbZm`, 02 Headline `HcVTPRfIrVr5pEpS`, 03 Construtor `dIRHcPq6GOQjGjlf`, 04 Funil `4ZrBWdTNmlj5cnez`, 05 Claquete `b0Mtxcsxf2hZPAQZ`, 06 Revisor `cqkhx6Mc2PENjylp`, 07 Tráfego `8nsN0jKDEmNyID9M`, 00 Coordenador `WiHxKHcgbaLG7iFy` (inativo, gatilho manual); tag `Direct Response` `rD9Y1ZKqaz3Oh8nn`. Os JSON regravados em `n8n/workflows/` (inclusive `99-erros.json` e `ids.json`) entram no repositório; só têm IDs internos do n8n, nenhuma chave.
- **Por quê:** fechar a publicação de C-02, C-03 e C-04 (T-02, T-03, T-07).
- **Arquivos tocados:** `n8n/tools/gerar.mjs`, `n8n/workflows/*.json`, `historico/CHANGELOG.md`, `historico/MAPA-DEPENDENCIAS.md`, `plano/PLANO-DE-ACAO.md`
- **Continua:** H-20261127-italo-06
- **Depende de:** H-20261127-italo-03
- **Resolve:** —
- **Abre:** —
- **Verificação:** `testar-codigos.mjs` passou; `checar.mjs` ok nos 9 JSON (00: 38 nós, 01: 16, 02: 15, 03: 19, 04: 20, 05: 17, 06: 17, 07: 27, 99: 6). Pela API (`GET /api/v1/workflows/<id>`): os 8 workflows têm `settings.errorWorkflow = rUNQVY24WtvxDK5l`; os 7 sub-workflows estão ativos com a versão atual publicada e só com o gatilho `executeWorkflowTrigger` (o Tráfego inclusive); o `99 Erros` está ativo com o `errorTrigger`; o Coordenador segue inativo. O Coordenador não foi rodado.
- **Próximo passo:** forçar um erro (chave xAI errada) quando a chave existir, e conferir que o `99 Erros` grava o arquivo em `erros\`. Numa instalação nova, se o 1.º `gerar.mjs` der o mesmo 400, rodar de novo.

### H-20261127-italo-06 — Evitar campanha duplicada no Tráfego e paginar o Radar (código)

- **Data/hora:** 2026-11-27 23:10 (America/Bahia UTC-3)
- **Autor:** italo — Claude
- **Tipo:** mudança de arquivo
- **O que mudou:** No gerador (`n8n/tools/`): o Tráfego agora procura a campanha pelo nome (`GET /{act}/campaigns` com `filtering name EQUAL`) antes de criar. Se já existe, reutiliza a campanha e os conjuntos e **não cria nem altera nada** (nem reforça PAUSED, porque o Arthur pode já ter ativado). O nome da campanha deixou de vir do modelo: é `config.campanha_nome` ou `DR | <oferta> | <país>`, senão a busca não acharia nada. O Radar pagina a Ad Library pelo cursor `after` (até 25 páginas de 200 por consulta) e agrupa as páginas por consulta. Testes novos em `testar-codigos.mjs`.
- **Por quê:** tarefa C-04 / T-07.
- **Arquivos tocados:** `n8n/tools/codigos.mjs`, `n8n/tools/gerar.mjs`, `n8n/tools/prompts.mjs`, `n8n/tools/testar-codigos.mjs`, `n8n/README.md`, `plano/PLANO-DE-ACAO.md`, `plano/DIVISAO-TAREFAS.md`
- **Continua:** H-20261127-italo-05
- **Depende de:** H-20261127-italo-03
- **Resolve:** —
- **Abre:** —
- **Verificação:** `testar-codigos.mjs` passou (inclui reutilização de campanha, nome fixo e 3 páginas de 2 consultas); `gerar.mjs --so-json` + `checar.mjs` ok nos 9 workflows. **Não verificado contra a API real:** os nomes dos parâmetros de paginação do nó HTTP do n8n 2.46 e o filtro por nome da Graph API precisam ser conferidos na primeira rodada com credencial (V-02).
- **Próximo passo:** publicar no n8n do PC (`node tools/gerar.mjs`) e testar o Tráfego só com conta de teste ou com o Arthur ciente.

### H-20261127-italo-05 — Guardar o estado entre rodadas e congelar a copy aprovada (código)

- **Data/hora:** 2026-11-27 23:00 (America/Bahia UTC-3)
- **Autor:** italo — Claude
- **Tipo:** mudança de arquivo
- **O que mudou:** O coordenador lê `<pasta_saida>\<slug>\estado.json` no início (se não existir, começa vazio) e grava as etapas da rodada no fim. Etapas salvas entram marcadas `de_rodada_anterior`; uma etapa pulada mantém a entrega salva. Toda saída de etapa ganhou `saida_hash` (versão). Novo campo `copy_aprovada_hash`: com ele igual à versão da copy, o Headline Killer não gera de novo (fica "congelada") e Construtor e Claquete só rodam com essa versão. O Tráfego não aceita aprovação do Revisor de rodada anterior. O relatório mostra a versão da copy e, se o modelo falhar, sai montado por código.
- **Por quê:** tarefa C-03 / T-03 (risco R-5: o Construtor podia publicar uma copy que ninguém aprovou).
- **Arquivos tocados:** `n8n/tools/codigos.mjs`, `n8n/tools/gerar.mjs`, `n8n/tools/testar-codigos.mjs`, `n8n/README.md`, `plano/PLANO-DE-ACAO.md`, `plano/DIVISAO-TAREFAS.md`
- **Continua:** H-20261127-italo-04
- **Depende de:** H-20261127-italo-03
- **Resolve:** —
- **Abre:** —
- **Verificação:** `testar-codigos.mjs` passou (estado salvo, primeira rodada sem arquivo, etapa congelada mantida, hash estável, relatório de reserva). **Não verificado no n8n:** leitura do arquivo pelo `extractFromFile` quando ele ainda não existe.
- **Próximo passo:** publicar no n8n do PC. A aprovação da copy passa a ser: o Arthur aprova a versão mostrada no relatório e o Italo põe `copy_aprovada: true` e `copy_aprovada_hash`.

### H-20261127-italo-04 — Criar o workflow de erros e as repetições dos nós Grok e HTTP (código)

- **Data/hora:** 2026-11-27 22:50 (America/Bahia UTC-3)
- **Autor:** italo — Claude
- **Tipo:** mudança de arquivo
- **O que mudou:** Novo workflow `Direct Response · 99 Erros` no gerador (gatilho de erro, grava um arquivo por erro na pasta `erros` do n8n, Telegram opcional desativado), ligado como *Error workflow* dos outros 8. Nós Grok: 3 tentativas com 5 s; nas etapas, a falha final vai para o nó `Falha do modelo` (etapa reprovada com motivo) em vez de derrubar a rodada; no coordenador, a rodada segue até o relatório. HTTP: 3 tentativas em leituras (GET) e no token da Hotmart; POST de criação na Meta continua **sem** repetição.
- **Por quê:** tarefa C-02 / T-02 (risco R-4: uma falha da xAI derrubava a rodada sem aviso).
- **Arquivos tocados:** `n8n/tools/codigos.mjs`, `n8n/tools/gerar.mjs`, `n8n/tools/testar-codigos.mjs`, `n8n/README.md`, `plano/PLANO-DE-ACAO.md`, `plano/DIVISAO-TAREFAS.md`
- **Continua:** H-20261127-italo-03
- **Depende de:** H-20261127-italo-03
- **Resolve:** —
- **Abre:** —
- **Verificação:** `testar-codigos.mjs` passou (falha do modelo e alerta de erro); `gerar.mjs --so-json` gerou 9 workflows e `checar.mjs` deu ok em todos. Ainda não publicado no n8n: os JSON em `n8n/workflows/` continuam sendo a exportação de 26/11 até o próximo `gerar.mjs` no PC.
- **Próximo passo:** publicar no n8n do PC e forçar um erro (chave da xAI errada) para ver o arquivo de erro aparecer (critério 6 da seção 14 do plano).

### H-20261127-italo-03 — Trazer o código gerador do fluxo n8n para o repositório

- **Data/hora:** 2026-11-27 22:30 (America/Bahia UTC-3)
- **Autor:** italo — Claude
- **Tipo:** mudança de arquivo
- **O que mudou:** Copiado para `n8n/` o gerador que estava só no PC do Italo (`Downloads\claude\automacoes\direct-response-n8n`): `README.md`, `tools/` (`gerar.mjs`, `prompts.mjs`, `codigos.mjs`, `checar.mjs`, `testar-codigos.mjs`) e `workflows/` (os 8 JSON exportados em 26/11 + `ids.json`). Conferido antes que nenhum arquivo tem chave, token ou senha: as credenciais aparecem só pelo nome e pelo ID interno do n8n; `act_1234567890` é exemplo de formato.
- **Por quê:** tarefa C-01 / T-01 de `plano/DIVISAO-TAREFAS.md` (risco R-2: o gerador não tinha versionamento e a outra máquina não tinha a fonte). O Italo pediu para o Claude começar as suas tarefas.
- **Arquivos tocados:** `n8n/**`, `historico/CHANGELOG.md`, `historico/MAPA-DEPENDENCIAS.md`, `plano/PLANO-DE-ACAO.md`, `plano/DIVISAO-TAREFAS.md`
- **Continua:** H-20261127-italo-02
- **Depende de:** H-20261125-italo-03
- **Resolve:** —
- **Abre:** —
- **Verificação:** `node n8n/tools/checar.mjs` (8 workflows ok) e `node n8n/tools/testar-codigos.mjs` ("TODOS OS TESTES PASSARAM") rodados na cópia do repositório em 2026-11-27 (V-01).
- **Próximo passo:** a partir de agora, a fonte da verdade do gerador é `n8n/` neste repositório; a pasta do PC passa a ser só cópia de trabalho. Claude segue com C-02 a C-04.

### H-20261127-italo-02 — Avaliar a estrutura do projeto e dividir tarefas entre Claude e Grok

- **Data/hora:** 2026-11-27 22:00 (America/Bahia UTC-3)
- **Autor:** italo — Claude
- **Tipo:** decisão
- **O que mudou:** Criado `plano/DIVISAO-TAREFAS.md` com a avaliação da estrutura (o que existe, 9 riscos R-1 a R-9) e a divisão do trabalho: Claude fica com o código e o n8n (C-01 a C-08), o Grok (assistente que o Italo usa no PC) com pesquisa de APIs, prompts e textos para o Arthur (G-01 a G-06), e o Italo com acessos e decisões (I-01 a I-05). Define regras de convivência: IDs `H-AAAAMMDD-grok-NN` para o Grok, dono de cada pasta, Grok não mexe no n8n nem no gerador.
- **Por quê:** o Italo pediu uma avaliação da estrutura, registrada no GitHub, e a divisão de tarefas com o Grok para acelerar.
- **Arquivos tocados:** `plano/DIVISAO-TAREFAS.md`, `historico/CHANGELOG.md`, `historico/MAPA-DEPENDENCIAS.md`
- **Continua:** H-20261127-italo-01
- **Depende de:** —
- **Resolve:** —
- **Abre:** —
- **Verificação:** no PC do Italo, em 2026-11-27, `node tools/checar.mjs` deu ok nos 8 workflows e `node tools/testar-codigos.mjs` terminou em "TODOS OS TESTES PASSARAM" (lógica dos nós Code com dados simulados; nada testado com credencial real). Notado que a pasta do gerador está dentro de um repositório git de outro projeto, sem versionamento próprio (risco R-2).
- **Próximo passo:** Grok começa por G-05 (perguntas para o Arthur) e G-01; Claude por C-01 (trazer o gerador para `n8n/`); Italo por I-01 e I-02.

### H-20261127-italo-01 — Reescrever o plano de ação como especificação técnica do fluxo no n8n

- **Data/hora:** 2026-11-27 00:30 (America/Bahia UTC-3)
- **Autor:** italo — Claude
- **Tipo:** correção
- **O que mudou:** `plano/PLANO-DE-ACAO.md` foi reescrito. Deixou de ser uma lista de tarefas de gestão e virou a especificação técnica do fluxo Direct Response no n8n, para outra IA entender e construir: ambiente e IDs dos 8 workflows, credenciais (só nomes e permissões), contrato de dados (`config`, `estado`, saída de etapa e regra de aprovação), padrão comum das etapas e, para cada workflow de 00 a 07, gatilho, nós em ordem com tipo e configuração, formato de saída do agente, verificações por código, limites, lacunas e como testar. Inclui tratamento de erros, critério de "funcionando perfeitamente" e o backlog (decisões D-01 a D-08, construção T-01 a T-09, validação V-01 a V-04) com colunas de status e quem fez. A descrição de `plano/` no `AGENTS.md` e no `README.md` foi ajustada.
- **Por quê:** o Italo disse que o plano de 26/11 não era o que ele queria: precisa de um plano para a outra IA entender como cada etapa do fluxo no n8n deve ser construída e arquitetada.
- **Arquivos tocados:** `plano/PLANO-DE-ACAO.md`, `AGENTS.md`, `README.md`, `historico/CHANGELOG.md`, `historico/MAPA-DEPENDENCIAS.md`
- **Continua:** H-20261126-italo-02 (corrige o conteúdo do plano)
- **Depende de:** H-20261125-italo-03
- **Resolve:** —
- **Abre:** —
- **Verificação:** a especificação foi escrita a partir do código gerador e dos JSON exportados dos workflows (`automacoes/direct-response-n8n` no PC do Italo), lidos em 2026-11-27. Nenhuma chave, token ou ID de conta foi copiado; as credenciais aparecem só pelo nome. O endpoint de produtos da Hotmart está marcado como "a confirmar".
- **Próximo passo:** Italo e Arthur fecham D-01 a D-08; a IA de construção começa por T-01 (trazer o gerador para o repositório) e T-02 (erros).

### H-20261126-italo-02 — Criar o plano de ação editável

- **Data/hora:** 2026-11-26 00:30 (America/Bahia UTC-3)
- **Autor:** italo — Claude
- **Tipo:** mudança de arquivo
- **O que mudou:** Criado `plano/PLANO-DE-ACAO.md`, com 10 fases (0 a 9) que vão da organização do repositório até a ativação das campanhas pelo Arthur. Cada tarefa tem as colunas Depende de, Responsável, Status, Feito por, Data e Evidência, e no fim há um "Registro de quem fez o quê". As tarefas saem das pendências P-01 a P-12 e das etapas E-01 a E-07 do mapa, mais o que falta no n8n (credenciais `DR · xAI Grok`, `DR · Meta (token de sistema)`, `DR · Hotmart`; `copy_aprovada`, `preco_aprovado`, `pixel_id`, `ad_account_id`). Acrescentada a linha de `plano/` na tabela do mapa do repositório em `AGENTS.md` e na estrutura do `README.md`.
- **Por quê:** o Italo pediu um plano de ação para colocar o projeto em prática, num documento editável onde o time marque o que já foi feito e quem fez.
- **Arquivos tocados:** `plano/PLANO-DE-ACAO.md`, `AGENTS.md`, `README.md`, `historico/CHANGELOG.md`, `historico/MAPA-DEPENDENCIAS.md`
- **Continua:** H-20261126-italo-01
- **Depende de:** —
- **Resolve:** —
- **Abre:** —
- **Verificação:** o plano não tem senhas, tokens nem IDs de conta; nenhum preço, data ou número foi decidido nele (só tarefas e quem decide).
- **Próximo passo:** Italo e Arthur revisam o plano e mesclam o PR. Depois, o Arthur começa pela fase 1 e o Italo pela fase 2, em paralelo.

### H-20261126-italo-01 — Liberar acesso do Claude ao repositório no GitHub

- **Data/hora:** 2026-11-26 (America/Bahia UTC-3), entre 00:03 e 00:20
- **Autor:** italo — Claude
- **Tipo:** acesso externo
- **O que mudou:** O Italo adicionou a conta GitHub `Italomelo01` (a conta ligada ao Claude) como colaboradora deste repositório, que pertence a `italoxdemelo`, e aceitou o convite. Mesmo assim, o Claude não consegue usar este repositório pela integração do GitHub: em *Settings → GitHub Apps* deste repositório estão instaladas só as apps Netlify e Render, e a Claude GitHub App não aparece. Por isso estas entradas foram feitas pelo navegador do app Claude no PC do Italo, com o GitHub logado lá pelo próprio Italo.
- **Por quê:** o Italo quer que tudo o que é feito no projeto (acessos a plataformas, convites para serviços privados, automações) fique registrado neste histórico.
- **Arquivos tocados:** `historico/CHANGELOG.md`, `historico/MAPA-DEPENDENCIAS.md`
- **Continua:** H-20261125-italo-02
- **Depende de:** —
- **Resolve:** P-10 (em *Settings → Collaborators* o `ArthurSantosss` já aparece como colaborador)
- **Abre:** P-11 (acesso do Claude a este repositório pela integração do GitHub ainda não funciona)
- **Verificação:** em *Settings → Collaborators* aparecem 2 colaboradores, `ArthurSantosss` e `Italomelo01`. A lista de repositórios da integração do Claude mostra só `Italomelo01/Radar-GOV-` e `Italomelo01/crmsharper`. Nenhuma senha ou token foi digitado pelo Claude nem registrado aqui.
- **Próximo passo:** com a conta `italoxdemelo`, instalar a Claude GitHub App com acesso a `direct-response` (github.com/apps/claude/installations/select_target). Enquanto isso, registrar pelo navegador.

### H-20261125-italo-03 — Montar o time de Direct Response no n8n

- **Data/hora:** 2026-11-25 (America/Bahia UTC-3)
- **Autor:** italo — Claude
- **Tipo:** mudança fora do repositório (n8n)
- **O que mudou:** No n8n self-hosted do Italo (`localhost:5678`, PC "italakinho") foram criados 8 workflows com a tag `Direct Response`: `00 Coordenador (GROK BOT)` (id `WiHxKHcgbaLG7iFy`), `01 Radar`, `02 Headline Killer`, `03 Construtor`, `04 Funil (Hotmart)`, `05 Claquete`, `06 Revisor` e `07 Tráfego`. O `07 Tráfego` cria as campanhas da Meta sempre como `PAUSED`. O país padrão é Portugal (pt-PT, EUR), definido no nó `⚙ Configuração`.
- **Por quê:** automatizar no n8n o time de 7 agentes do contexto, com um coordenador à frente.
- **Arquivos tocados:** — (tudo no n8n)
- **Continua:** C-01 (time de 7 agentes)
- **Depende de:** —
- **Resolve:** —
- **Abre:** P-12 (preencher as credenciais do n8n)
- **Verificação:** as credenciais foram criadas só como espaços vazios no n8n, com os nomes `DR · xAI Grok`, `DR · Meta (token de sistema)` e `DR · Hotmart`. Os valores ficam só no n8n e nunca entram neste repositório.
- **Próximo passo:** preencher as 3 credenciais no n8n (P-12, ligada a P-09). Nenhum workflow deve ativar campanhas: só o Arthur ativa (E-07).

### H-20261125-italo-02 — Tentar convidar o ArthurSantosss para o repositório (falhou)

- **Data/hora:** 2026-11-25 (America/Bahia UTC-3)
- **Autor:** italo — Claude
- **Tipo:** tentativa que falhou (acesso externo)
- **O que mudou:** O Claude tentou convidar o utilizador GitHub `ArthurSantosss` como colaborador deste repositório. A API do GitHub bloqueou, porque a conta ligada ao Claude não é dona do repositório.
- **Por quê:** o Arthur precisa de acesso ao repositório para acompanhar o histórico e decidir as pendências.
- **Arquivos tocados:** —
- **Continua:** H-20261125-italo-01
- **Depende de:** —
- **Resolve:** —
- **Abre:** P-10 (convidar o ArthurSantosss manualmente)
- **Verificação:** o convite não foi enviado pela API. Em 2026-11-26 o `ArthurSantosss` já aparecia como colaborador, adicionado manualmente pelo dono (ver H-20261126-italo-01).
- **Próximo passo:** o dono (`italoxdemelo`) adiciona `ArthurSantosss` em *Settings → Collaborators* (feito, P-10 resolvida em H-20261126-italo-01).

### H-20261125-italo-01 — Criar repositório, importar contexto e iniciar histórico

- **Data/hora:** 2026-11-25 (America/Bahia UTC-3), depois das 20:58
- **Autor:** italo — Claude Code
- **Tipo:** mudança de arquivo
- **O que mudou:** Criado o repositório `direct-response`. O pacote `direct-response-contexto.zip` foi importado sem alterações para `contexto/` (5 documentos Markdown + 55 prints do Radar: 30 do Brasil e 25 de Portugal). Criados `README.md`, `AGENTS.md`, `CLAUDE.md`, `.gitignore`, `.gitattributes` e o sistema de histórico (`historico/CHANGELOG.md`, `historico/MAPA-DEPENDENCIAS.md`, `historico/MODELO-ENTRADA.md`). As 7 pendências do Arthur (secção 5 do contexto), a aprovação da copy e os acessos externos foram registrados como `P-01` a `P-09` no mapa.
- **Por quê:** o projeto vai ser tocado em duas máquinas (uma delas no servidor do parceiro), e a IA de cada lado precisa saber o que já foi feito e como as ações se ligam antes de agir.
- **Arquivos tocados:** `contexto/**` (importado), `README.md`, `AGENTS.md`, `CLAUDE.md`, `.gitignore`, `.gitattributes`, `historico/CHANGELOG.md`, `historico/MAPA-DEPENDENCIAS.md`, `historico/MODELO-ENTRADA.md`
- **Continua:** C-07 (pacote de contexto)
- **Depende de:** —
- **Resolve:** —
- **Abre:** P-01 a P-09 (já existiam no contexto; agora estão rastreadas no mapa)
- **Verificação:** o conteúdo do zip foi lido antes de publicar. Nenhuma senha, token, chave ou credencial foi encontrada nos `.md`, e as PNG não têm metadados de texto. Os prints de checkout aparecem com o formulário vazio. `contexto/02-entrega-headline-killer.md` e `contexto/headline-killer/pilates50-pt/entrega.md` são idênticos (mesmo SHA-256). `msg.md` contém a mesma entrega precedida de um resumo de 5 itens.
- **Próximo passo:** o Arthur decide P-01 a P-07 e aprova a copy (P-08). Só depois disso o Construtor e a Claquete avançam, e o Funil depende de P-02, P-03, P-07 e P-09.
