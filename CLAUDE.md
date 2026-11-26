# CLAUDE.md

As regras completas estão em `AGENTS.md` (valem para qualquer IA) e são importadas aqui:

@AGENTS.md

## Resumo obrigatório (caso o import acima não carregue)

1. **Antes de agir:** `git pull --rebase`, depois leia `historico/CHANGELOG.md` (5 entradas mais recentes + as do mesmo assunto) e `historico/MAPA-DEPENDENCIAS.md`. Diga em uma linha qual entrada a sua ação continua ou de qual depende. Se estiver bloqueada por uma pendência `P-xx` aberta, pergunte antes de executar.
2. **Depois de agir:** nova entrada no topo do `CHANGELOG.md` seguindo `historico/MODELO-ENTRADA.md`, atualize o mapa, commit com o ID da entrada na mensagem e push.
3. **Nunca:** inventar dados, usar prova social falsa ou preço riscado falso, prometer resultado de saúde, ativar campanha, ou commitar segredos.
