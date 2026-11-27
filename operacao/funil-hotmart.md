# Roteiro da esteira — painel da Hotmart

Para o Arthur montar no painel. O fluxo do n8n **não cria** produto, bump nem upsell: a API só confere o que já existe (`plano/PLANO-DE-ACAO.md` §9, branch `plano/H-20261126-italo-02`). Este arquivo é o roteiro. **Nenhum preço está preenchido.**

Base: `aulas/Upsell e downsell.md` e `aulas/10 dicas para low ticket.md`. Preço e garantia continuam em P-02 e P-03.

## Ordem

`Front → Upsell 1 → (aceitou) Upsell 2 / (recusou) Downsell → Oferta final`

No painel (caminho dito na aula, a confirmar na Hotmart no dia): Ferramentas → Funil de vendas. Cada etapa tem duas saídas, "quero" e "não quero".

Quem recusa o Upsell 1 cai no Downsell e depois na oferta final. Quem aceita o Upsell 1 vai ao Upsell 2 e depois à oferta final.

## Peças

| Peça | Função (aula) | Preço | Entregável real (P-07) | Status no painel |
|---|---|---|---|---|
| Front | O desafio, pagamento único | — (P-02) | — | ⏳ |
| Order bumps | 3 a 5, do mais caro ao mais barato. Meta de aula: ~30% no primeiro e ~20% no segundo. Abaixo de 10% no melhor, a aula manda trocar. Referência de aula, não meta desta oferta. | — / — / — / — / — | — | ⏳ |
| Upsell 1 | Preço de entrada, para validar. Meta de aula: 9–12% com página de texto, 15–20% com VSL. | — | — | ⏳ |
| Upsell 2 | O passo seguinte do Upsell 1, o mesmo mecanismo como acelerador | — | — | ⏳ |
| Downsell | Versão mais simples para quem recusou o Upsell 1. A aula cita piso de 3,90 € em oferta em euro. Referência de aula, não verificada, não é o preço. | — | — | ⏳ |
| Oferta final | Algo útil por um valor baixo, depois das recusas | — | — | ⏳ |

## Copy de upsell, ainda não escrita

A aula abre tranquilizando: a compra anterior já está feita. O exemplo da nota, em tom de Portugal, é "o teu desafio já está garantido". Isso é exemplo de tom, não copy aprovada. O texto ao público sai em PT-PT, sem "você", só depois do ok do Arthur, e sem promessa de dor, cura ou quilos.

A página de upsell repete garantia, acesso imediato e compra segura (`aulas/Detalhado/Detalhe - Upsell e downsell.md`).

## O que não entra

- Preço riscado, "de/por", bônus com valor que nunca foi cobrado.
- Bump ou upsell de um entregável que P-07 não confirmou.
- Publicar o funil antes de `preco_aprovado` no fluxo. O plano exige esse campo para a etapa 04 rodar.

## Ok do Arthur

- Esteira aprovada (quais peças existem): —
- Preços: —
- Data: —
- Canal: —
