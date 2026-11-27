# Anexo ao checklist de 7 itens

Os 7 itens **não são redefinidos aqui**. Eles estão no plano do Italo, seção 11 de `plano/PLANO-DE-ACAO.md`, branch `plano/H-20261126-italo-02`, commit `5d78f25`. Esse arquivo não está nesta branch. Não copiar o plano para cá e não editar o plano a partir daqui.

Nomes, para este anexo grudar no lugar certo:

1. `1_pagina_no_ar`
2. `2_pixel_certo_e_pageview`
3. `3_pixel_ja_disparou`
4. `4_links_de_checkout_certos_e_no_ar`
5. `5_preco_aprovado_e_sem_preco_riscado`
6. `6_idioma_do_destino`
7. `7_criativos_prontos`

Mais `saida_do_agente_em_json` e `revisor_aprovou`. O portão continua sendo esses itens em 100%. Um aviso desta lista **não reprova** a etapa sozinho.

## Avisos (não são reprovação automática)

| Aviso | Por que não reprova | Quando olhar |
|---|---|---|
| `last_fired_time` não prova que o PageView saiu desta URL | O item 3 vê um disparo na conta. A regra do projeto pede o PageView desta página antes do anúncio. A conferência no navegador é a tarefa T-08 do plano. | Antes de o Tráfego criar campanha, como lembrete ao Italo. Não trocar o item 3 por conta própria. |
| O item 7 hoje exige URL de imagem, não o ok do Arthur sobre o criativo | O plano deixa `criativos_aprovados` para a tarefa T-04. | Quando T-04 existir no gerador. |
| Connect rate, visita → início de checkout, início de checkout → pagamento, aprovação, receita por comprador acima do CPA | São leitura de tráfego. Nesta etapa ainda não há gasto. Cortes numéricos são referência de aula (`aulas/Como identificar gargalo na oferta.md`). | Depois de V-04, na ficha `operacao/metricas-pt.md`. |
| Aprovação de Pix e "não pedir CPF" | Régua do Brasil. Em Portugal o meio é cartão, MB Way e Multibanco. | Na mesma ficha de métricas, quando houver venda. |
| Faixa "só hoje", bônus riscado, back redirect, voucher, quiz de dor, peso ou idade, promessa de dor | Estão em `operacao/pagina-proibicoes.md`. A regex do plano não pega a lista inteira. | Leitura humana do HTML e da copy. Vira reprovação automática só quando o Italo alargar a checagem no gerador. |
| Dois planos, VSL e mecanismo com nome ausentes | A copy de C-06 não tem essas peças. A auditoria está em `operacao/auditoria-copy.md`. Falta não é erro de publicação. | Na próxima copy, antes de P-08. Não reprovar a página atual por não ser a anatomia da aula. |
| CTR, CPC, CPM e "100–150 anúncios" | Referência de aula. Não há campanha ativa. | Não usar como nota do Revisor. |

## Como usar

O agente Revisor aprova ou reprova pelos 7 itens do plano. Neste anexo, registra o aviso no campo de comentário e segue. Não cria oitavo item bloqueante.
