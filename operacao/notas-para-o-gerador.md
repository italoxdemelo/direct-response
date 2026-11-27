# Notas para o gerador do n8n

Para o Italo aplicar **quando o código gerador entrar neste repositório** (tarefa T-01 de `plano/PLANO-DE-ACAO.md`, branch `plano/H-20261126-italo-02`, commit `5d78f25`). O gerador hoje está fora do Git, no PC do Italo. Esta branch não mexe em workflow, prompt nem payload.

Nada aqui é decisão do Arthur. P-01 a P-09 e a D-09 continuam abertas.

## 1. Estado entre rodadas (T-03 do plano)

O coordenador esquece a rodada anterior. Se o Headline Killer roda de novo, a copy muda, e o Construtor pode publicar texto que o Arthur não aprovou.

Quando o código estiver no repo: guardar estado por oferta e congelar a copy aprovada (hash e versão). Construtor e Claquete leem essa versão, não a saída nova do modelo.

## 2. Regex de saúde mais larga

O plano (§4) já barra "antes e depois", "perca N kg", "cura", "resultado garantido" e "últimas vagas". A regra do projeto é mais larga (`AGENTS.md` §3 e §8 e `operacao/pagina-proibicoes.md`).

Quando for editar `tools/codigos.mjs`, incluir na checagem, sem aprovar sozinho o que for contexto de aula citado entre aspas:

- promessa de tirar dor, curar articulação, hérnia, ciático
- quilos, emagrecer, antes/depois
- pergunta de quiz sobre dor, peso, idade ou condição de saúde

Não marcar como erro a headline já adaptada em C-06 ("mobilidade, postura e disposição") enquanto o Arthur não pedir outra. O alargamento pega claim novo, não reabre essa frase.

## 3. Prompt com precedência e playbook

Os nós Grok não leem `aulas/` sozinhos. No `tools/prompts.mjs`, no system message de cada agente:

- `AGENTS.md` seções 3 e 8 vencem a seção "Como aplicar" das notas.
- Número de aula é referência não verificada.
- Apontar o playbook `aulas/Aulas - Índice e Playbook.md` e, nesta oferta, `operacao/`.

Assim o modelo deixa de seguir garantia de 28 dias, print simulado e quiz de idade como se fossem instrução.

## 4. Lista do que a página não herda

A lista fechada está em `operacao/pagina-proibicoes.md`: faixa "só hoje", bônus riscado, back redirect de 50–70%, voucher de aula, quiz de dor, peso ou idade, promessa de dor, prova falsa. Entra na verificação do Headline Killer e do Construtor quando o gerador estiver no repo. Até lá, a lista é leitura humana (`operacao/anexo-revisor.md`).

## 5. Pixel no navegador (T-08 do plano)

`last_fired_time` e o PageView escrito no HTML não provam que esta URL disparou. A tarefa T-08 (navegador real, PageView e preço do checkout) continua necessária. O anexo do Revisor não transforma esse aviso em reprovação automática.

## 6. Não mudar o payload de tráfego ainda

D-09 (`operacao/decisoes-arthur.md`) está aberta: aulas (1 CBO + Bid Cap, público aberto) contra o payload atual (orçamento no conjunto, `LOWEST_COST_WITHOUT_CAP`, idade e gênero, Advantage+ desligado).

Não trocar `bid_strategy`, targeting nem CBO no gerador antes do ok do Arthur. Os 1000 centavos de `orcamento_diario_centavos` continuam exemplo do gerador, não orçamento aprovado (D-08 do plano).

A trava `PAUSED` e a conferência pela API ficam como estão.
