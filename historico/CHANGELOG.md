# Histórico de decisões e mudanças

Log de tudo o que muda no projeto, **entrada mais recente no topo**. Toda IA lê este arquivo antes de agir e acrescenta uma entrada depois de agir (regras em `AGENTS.md`, modelo em `historico/MODELO-ENTRADA.md`, ligações entre entradas em `historico/MAPA-DEPENDENCIAS.md`).

- Não apague nem reescreva entradas antigas. Para corrigir uma, crie outra com **Tipo: correção** e **Continua:** apontando para ela.
- O que aconteceu **antes** deste repositório está nos marcos `C-01` a `C-07` do mapa e em `contexto/00-LEIA-PRIMEIRO.md`.

<!-- NOVAS ENTRADAS AQUI (logo abaixo desta linha) -->

### H-20261127-grok-01 — Importar as aulas de direct response e ligar o playbook às regras

- **Data/hora:** 2026-11-27 00:12 (America/Bahia UTC-3)
- **Autor:** grok — Cursor (Grok)
- **Tipo:** mudança de arquivo
- **O que mudou:** Importadas as 24 notas de `Aulas/` (11 resumos, `Aulas.md`, 11 notas em `Aulas/Detalhado/` e `Aulas - Índice e Playbook.md`) para `aulas/`, com o texto preservado. Wikilinks do Obsidian que apontam para nota existente nesta pasta viraram link relativo; os 11 que apontam para notas de fora do pacote (Gestão de Obra, Clientes, Diagnósticos Grok Bot, Time Direct Response, vilas-mkt-dash, bebeturista, Regras e decisões, Consórcio Market, Arte, README do segundo cérebro, rotinas do Grok Bot) ficaram em texto puro. `README.md`, `AGENTS.md` (seções 1, 3, 5 e 8), `CLAUDE.md` e `.cursor/rules/aulas-playbook.mdc` passam a mandar o agente ler o playbook em oferta, promessa, mecanismo, copy, VSL, criativo, página, upsell, funil, Bid Cap, CBO, métrica e escala. A seção 8 registra o que cada agente passa a fazer e oito divergências em que a regra do projeto fica (prova social simulada, preço riscado e back redirect, saúde, garantia de 28 dias, nome do entregável, checkout Pix/CPF, gasto para descartar oferta, connect rate no lugar do PageView). Nenhuma decisão antiga foi apagada. P-01 a P-09 continuam abertas. `contexto/` não foi editado.
- **Por quê:** o Arthur pediu para o repositório de contexto do time passar a carregar o conhecimento das aulas, para as regras das IAs ficarem melhores sem substituir o que já estava decidido.
- **Arquivos tocados:** `aulas/**` (24 notas), `README.md`, `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/aulas-playbook.mdc`, `historico/CHANGELOG.md`, `historico/MAPA-DEPENDENCIAS.md`
- **Continua:** H-20261125-italo-01
- **Depende de:** —
- **Resolve:** —
- **Abre:** —
- **Verificação:** 24 arquivos Markdown; 160 wikilinks convertidos em links relativos e todos resolvem no disco; 0 `[[` restante; busca por senha, token, e-mail, CPF e ID de conta sem ocorrência. Não há credencial nem dado de comprador. Nomes de outros projetos do segundo cérebro permanecem nas seções "como aplicar", como no original.
- **Próximo passo:** o Arthur segue decidindo P-01 a P-07 (a garantia de 28 dias da aula de página é sugestão, não fecha P-03). Construtor, Funil, Claquete e Tráfego só avançam depois do ok, e consultam o playbook quando avançarem.

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
