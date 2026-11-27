# CLAUDE.md

As regras completas estão em `AGENTS.md` (valem para qualquer IA) e são importadas aqui:

@AGENTS.md

## Resumo obrigatório (caso o import acima não carregue)

1. **Antes de agir:** `git pull --rebase`, depois leia `historico/CHANGELOG.md` (5 entradas mais recentes + as do mesmo assunto) e `historico/MAPA-DEPENDENCIAS.md`. Diga em uma linha qual entrada a sua ação continua ou de qual depende. Se estiver bloqueada por uma pendência `P-xx` aberta, pergunte antes de executar.
2. **Depois de agir:** nova entrada no topo do `CHANGELOG.md` seguindo `historico/MODELO-ENTRADA.md`, atualize o mapa, commit com o ID da entrada na mensagem e push.
3. **Nunca:** inventar dados, usar prova social falsa ou preço riscado falso, prometer resultado de saúde, ativar campanha, ou commitar segredos.
4. **Aulas:** em oferta, promessa, mecanismo, copy, VSL, criativo, página, upsell, funil, Bid Cap, CBO, métrica ou escala, leia `aulas/Aulas - Índice e Playbook.md` e a nota detalhada do tema. Número de aula é referência não verificada. Se a aula divergir de `AGENTS.md` (seções 3 e 8), fica a regra do projeto.
