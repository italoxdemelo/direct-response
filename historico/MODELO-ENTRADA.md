# Modelo de entrada do histórico

Copie o bloco abaixo para o **topo** de `historico/CHANGELOG.md` (logo abaixo da linha `<!-- NOVAS ENTRADAS AQUI -->`) e preencha todos os campos. Use `—` quando um campo não se aplicar; não apague campos.

## Formato do ID

`H-AAAAMMDD-<autor>-NN`

- `AAAAMMDD`: data da ação.
- `<autor>`: quem fez ou pediu, em minúsculas e sem acento (`italo`, `arthur`, ou o nome do amigo). Assim duas máquinas nunca geram o mesmo ID.
- `NN`: sequência daquele autor naquele dia (`01`, `02`...).

Pendências usam `P-NN` e vivem no `MAPA-DEPENDENCIAS.md`.

## Bloco

```markdown
### H-AAAAMMDD-autor-NN — Título curto no infinitivo ou particípio

- **Data/hora:** AAAA-MM-DD HH:MM (fuso, ex.: America/Bahia UTC-3)
- **Autor:** pessoa — IA usada (ex.: italo — Claude Code; amigo — Codex no servidor)
- **Tipo:** decisão | mudança de arquivo | ação externa | correção | tentativa falha
- **O que mudou:** o que foi feito, em 1 a 5 linhas. Fatos, não intenções.
- **Por quê:** o motivo ou o pedido que levou à mudança (cite quem pediu e por onde, ex.: "Arthur no WhatsApp").
- **Arquivos tocados:** lista de caminhos, ou "fora do repositório: Hotmart / Meta Ads / servidor ...".
- **Continua:** ID da entrada que esta leva adiante (ou —).
- **Depende de:** IDs de entradas ou pendências `P-NN` que precisavam estar prontas antes (ou —).
- **Resolve:** pendências `P-NN` fechadas por esta entrada (ou —).
- **Abre:** novas pendências `P-NN` criadas (descreva no mapa) (ou —).
- **Verificação:** como se confirmou que deu certo (comando, print, link, checklist do Revisor) ou "não verificado".
- **Próximo passo:** o que deve acontecer a seguir e quem faz.
```

## Exemplo preenchido

```markdown
### H-20261126-italo-01 — Fixar preço da oferta Pilates 50+ em Portugal

- **Data/hora:** 2026-11-26 10:15 (America/Bahia UTC-3)
- **Autor:** italo — Claude Code
- **Tipo:** decisão
- **O que mudou:** Arthur aprovou 14,90 € pagamento único, sem preço riscado.
- **Por quê:** pendência P-02 bloqueava Funil e Construtor.
- **Arquivos tocados:** historico/CHANGELOG.md, historico/MAPA-DEPENDENCIAS.md
- **Continua:** H-20261125-italo-01
- **Depende de:** P-02
- **Resolve:** P-02
- **Abre:** —
- **Verificação:** mensagem do Arthur no WhatsApp de 26/11 10:02 (não colada aqui).
- **Próximo passo:** Funil cria produto na Hotmart em euro (depende ainda de P-03 garantia).
```

*(O exemplo acima é ilustrativo: o preço não foi decidido.)*
