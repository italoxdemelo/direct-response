# Histórico de decisões e mudanças

Log de tudo o que muda no projeto, **entrada mais recente no topo**. Toda IA lê este arquivo antes de agir e acrescenta uma entrada depois de agir (regras em `AGENTS.md`, modelo em `historico/MODELO-ENTRADA.md`, ligações entre entradas em `historico/MAPA-DEPENDENCIAS.md`).

- Não apague nem reescreva entradas antigas. Para corrigir uma, crie outra com **Tipo: correção** e **Continua:** apontando para ela.
- O que aconteceu **antes** deste repositório está nos marcos `C-01` a `C-07` do mapa e em `contexto/00-LEIA-PRIMEIRO.md`.

<!-- NOVAS ENTRADAS AQUI (logo abaixo desta linha) -->

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
