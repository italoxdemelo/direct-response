# Histórico de decisões e mudanças

Log de tudo o que muda no projeto, **entrada mais recente no topo**. Toda IA lê este arquivo antes de agir e acrescenta uma entrada depois de agir (regras em `AGENTS.md`, modelo em `historico/MODELO-ENTRADA.md`, ligações entre entradas em `historico/MAPA-DEPENDENCIAS.md`).

- Não apague nem reescreva entradas antigas. Para corrigir uma, crie outra com **Tipo: correção** e **Continua:** apontando para ela.
- O que aconteceu **antes** deste repositório está nos marcos `C-01` a `C-07` do mapa e em `contexto/00-LEIA-PRIMEIRO.md`.

<!-- NOVAS ENTRADAS AQUI (logo abaixo desta linha) -->

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
