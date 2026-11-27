# AGENTS.md — regras para qualquer IA que trabalhe neste repositório

Vale para Claude, Codex, Cursor, Gemini ou qualquer outro agente. O `CLAUDE.md` aponta para este arquivo.

Este projeto é tocado por **duas pessoas em máquinas diferentes** (uma delas roda tudo no próprio servidor). A única memória compartilhada entre as duas e entre as IAs é **este repositório**. Por isso o histórico em `historico/` não é opcional: é ele que diz o que já foi feito, por quê, e como uma ação depende da outra.

---

## 1. Antes de qualquer ação (obrigatório)

1. **Sincronize:** `git pull --rebase` antes de começar. Se o pull falhar, pare e avise a pessoa.
2. **Leia o histórico, nesta ordem:**
   1. `historico/CHANGELOG.md` — pelo menos as **5 entradas mais recentes** e todas as que tratem do mesmo assunto da tarefa atual (busque pelo nome da oferta, do agente ou do arquivo).
   2. `historico/MAPA-DEPENDENCIAS.md` — veja se a tarefa está **bloqueada** por alguma pendência (`P-xx`) ainda aberta.
   3. `contexto/00-LEIA-PRIMEIRO.md` — objetivo, time, regras de cada agente e pendências originais.
   4. Se a tarefa for oferta, promessa, mecanismo, copy, VSL, criativo, página, upsell, funil, Bid Cap, CBO, métrica ou escala: `aulas/Aulas - Índice e Playbook.md`, a nota detalhada do tema e a ficha correspondente em `operacao/` (seção 8). As seções 3 e 8 prevalecem sobre a tática da aula quando divergirem.
3. **Diga em uma linha** qual entrada anterior a sua ação continua ou de qual ela depende (ex.: "continua H-20261125-italo-01, bloqueada por P-02"). Se a ação depender de uma pendência aberta, **não execute**: pergunte à pessoa.

## 2. Depois de qualquer ação que mude arquivos, decisões ou estado externo

1. **Registre uma entrada nova no topo** de `historico/CHANGELOG.md`, seguindo `historico/MODELO-ENTRADA.md`. Todos os campos são obrigatórios; use `—` quando não se aplicar.
2. **Atualize `historico/MAPA-DEPENDENCIAS.md`:** acrescente o nó da nova entrada, as arestas para o que ela continua ou de que depende, e feche (`✅`) as pendências que a ação resolveu.
3. **Faça commit** junto com a mudança (mesmo commit), com mensagem que comece pelo ID da entrada: `H-20261125-italo-02: descrição curta`.
4. **Faça push** logo em seguida, para a outra pessoa ver.

Também contam como "ação" e exigem entrada: decisões do Arthur repassadas por chat, mudanças feitas fora do repositório (Hotmart, Meta Ads, pixel, domínio, servidor), e tentativas que falharam (registre o que falhou e por quê, para ninguém repetir).

Não precisam de entrada: leitura, perguntas, correção de erro de digitação sem mudança de sentido.

## 3. Regras do projeto (vêm do contexto e não se negociam)

- **Nunca inventar dados**: números, preços, depoimentos, datas, contagens de anúncios, prova social. O que não foi verificado fica marcado como **não verificado**.
- **Sem prova social falsa** e **sem preço riscado** de um valor que nunca foi praticado (Diretiva Omnibus na UE).
- **Regras de saúde da Meta**: sem promessa de resultado físico ou de cura, sem antes/depois, sem afirmar atributos pessoais de saúde ("sedentária?", "tem dor?").
- **Conferir o PageView do pixel antes de qualquer anúncio.**
- **Campanhas sobem sempre PAUSADAS.** Quem ativa é o Arthur. Nunca ative nada.
- **Preço, formato, garantia e copy final só com o ok do Arthur.** Registre o ok no histórico, com data e por onde veio.

O que as aulas acrescentam a cada agente, e onde a aula diverge destas regras, está na seção 8. A regra desta seção não é substituída pela aula.

## 4. Segredos e dados pessoais

- **Nunca** faça commit de senhas, tokens, chaves de API, cookies, IDs de conta de anúncio com token, dados de clientes ou compradores.
- Credenciais (Hotmart, Meta Ads, pixel, servidor) ficam em `.env` ou no gerenciador de segredos do servidor. O `.env` está no `.gitignore`.
- No histórico, descreva **que** um acesso foi configurado, nunca **qual** é o valor.

## 5. Mapa do repositório

| Caminho | O que é | Pode editar? |
|---|---|---|
| `contexto/` | Pacote de contexto original (25/11/2026). Instantâneo do ponto de partida. | **Não.** Fica como registro. Mudanças de estado vão para o histórico. |
| `historico/CHANGELOG.md` | Log de decisões e mudanças, entrada mais recente no topo. | Só acrescentar. Não apague nem reescreva entradas antigas; para corrigir, crie entrada nova que a "corrige". |
| `historico/MAPA-DEPENDENCIAS.md` | Grafo de como as ações e pendências se ligam. | Sim, a cada entrada. |
| `historico/MODELO-ENTRADA.md` | Modelo da entrada. | Só com entrada no histórico explicando a mudança. |
| `AGENTS.md` / `CLAUDE.md` | Estas regras. | Só com entrada no histórico. |
| `aulas/` | Notas das 11 aulas e o playbook (26/11/2026). Consulta dos agentes. | Sim, com entrada no histórico. Não apague nota antiga; para corrigir, acrescente. |
| `operacao/` | Briefs e fichas da oferta Pilates 50+ (decisões em aberto, mecanismo, funil, métricas). Não decide no lugar do Arthur. | Sim, com entrada no histórico. Não preencher ok que o Arthur não deu. |
| `.cursor/rules/` | Atalho para o Cursor ler o playbook. | Só junto com a regra correspondente em `AGENTS.md`. |

## 6. Conflitos de merge no histórico

Se duas pessoas registrarem entradas ao mesmo tempo, o `git pull --rebase` vai acusar conflito no topo do `CHANGELOG.md`. Resolva **mantendo as duas entradas**, a mais recente (por data e hora) por cima. Os IDs levam o autor, então nunca colidem. Faça o mesmo no mapa.

## 7. Idioma

Responda e registre em **português**. A copy para Portugal segue PT-PT (ver `contexto/02-entrega-headline-killer.md`); o histórico e as conversas, PT-BR.

## 8. Conhecimento das aulas (playbook)

As 11 aulas que o Arthur selecionou (Germano Morandi / mentoria Escale, com Guilherme Franklin, Guilherme Asvi, Allanzord e Balaclava) estão em `aulas/`. Índice e trilha: `aulas/Aulas.md`. Playbook por tema, com a tabela de divergências entre professores: `aulas/Aulas - Índice e Playbook.md`. Nota curta na raiz de `aulas/`; versão aprofundada em `aulas/Detalhado/`. As transcrições (`raw/aulas/`) não estão neste repositório. `contexto/` continua o instantâneo de 25/11/2026 e não se edita.

**Como usar.** Leia o playbook e a nota detalhada do tema, cite a aula e o professor, e mostre as duas posições quando os professores divergem. Número dito na aula é **referência de aula, não verificado** nesta oferta. Não complete o que a aula não diz. Para a oferta Pilates 50+ Portugal, leia também `operacao/` (decisões em aberto, mecanismo em branco, auditoria da copy, esteira sem preço, proibições da página, anexo do Revisor, métricas pós-V-04 e notas ao gerador). Essas fichas não fecham P-01 a P-09 nem a D-09.

| Trabalho | Onde ler primeiro |
|---|---|
| Oferta, promessa, preço, garantia | `aulas/Detalhado/Detalhe - Criação de promessa e oferta irrecusável.md` |
| Mecanismo | `aulas/Detalhado/Detalhe - Criação de mecanismo único.md` |
| Copy | `aulas/Detalhado/Detalhe - Copy humanizada (Balaclava).md` |
| VSL | `aulas/Detalhado/Detalhe - Validação, VSL e escala (Guilherme Asvi).md` |
| Criativos | `aulas/Detalhado/Detalhe - Criativos que escalam.md` |
| Página | `aulas/Detalhado/Detalhe - Estrutura de página para escalar.md` |
| Upsell, downsell, funil | `aulas/Detalhado/Detalhe - Upsell e downsell.md` e `aulas/Detalhado/Detalhe - Checklist do ROI (10 dicas low ticket).md` |
| Bid Cap, CBO, escala | `aulas/Detalhado/Detalhe - Estrutura de tráfego CBO + Bid Cap (Guilherme).md` e `aulas/Detalhado/Detalhe - Bid Cap (Allanzord).md` |
| Métricas e gargalo | `aulas/Detalhado/Detalhe - Como identificar o gargalo da oferta (análise de métricas).md` |

**O que cada agente passa a fazer** (soma à regra antiga; não a apaga):

- **Radar.** Além da contagem, da data e do preço verificados, registre o mecanismo e a promessa que aparecem no anúncio e na página, como texto observado. Modelar é adaptar a estrutura. Não copie texto, marca ou imagem de terceiro. Aula: checklist do ROI ("nunca copie cru").
- **Headline Killer.** Promessa com resultado, prazo e simplicidade, mais o "mesmo que"; mecanismo do problema e da solução com nome, só se descrever o que o produto é (Germano, aulas de promessa e de mecanismo). Leia a copy em voz alta (Balaclava). Estudo, credencial e número que a aula cita como exemplo não entram na copy.
- **Construtor.** Ordem da página da aula do Guilherme: hero (headline, VSL, CTA), dor, mecanismo, prova, plano mais barato primeiro, garantia com a cara da marca. O PageView antes de qualquer anúncio continua obrigatório. Connect rate (referência de aula: 90% ou mais) só se lê depois que existe tráfego.
- **Funil.** Desenhe a esteira inteira: front, 3 a 5 order bumps, upsell 1, upsell 2, downsell e oferta final (Guilherme). Preço e garantia continuam com o Arthur (P-02, P-03). A aula cita piso de 3,90 € na Hotmart para oferta em euro: referência de aula, não verificada nesta data, e não é autorização para publicar preço.
- **Claquete.** Roteiro em gancho (3 segundos), corpo e CTA; vídeo curto (Germano). Depoimento e UGC só se forem reais.
- **Revisor.** O checklist de 7 itens segue como porta de aprovação. Use as 10 dicas e o funil de 5 etapas (connect, visita → início de checkout, início de checkout → pagamento, aprovação, receita por comprador acima do CPA) como auditoria extra, com os cortes marcados como referência de aula.
- **Tráfego.** Pode deixar desenhada a estrutura das aulas: uma campanha CBO, Bid Cap, Advantage+, um conjunto por ângulo, lote de criativos, e o critério de pausa e de escala escrito ao lado. A campanha sobe pausada. Ativar, subir orçamento ou mexer no lance é o Arthur. Se os professores divergem, registre as duas e não escolha por ele: Guilherme sobe o lance, ou sobe o orçamento no máximo 30% ao dia baixando o lance até o ticket; Allanzord mantém o lance e sobe o orçamento 20–50% ao dia (`aulas/Aulas.md` e a seção Divergências do playbook).

**Onde a aula diverge e a regra do projeto fica**

1. **Prova social.** O checklist do ROI aceita print simulado de WhatsApp no começo; a aula de VSL cita chat simulado com o especialista; o playbook lista "fake/UGC com especialista". Aqui não entra. Só testemunho real e autorizado (P-05, espaço de prova da copy).
2. **Preço riscado e desconto.** Bônus com valor riscado, pop-up de desconto, back redirect de 50–70% e voucher de 85% (aulas de low ticket e de VSL) esbarram na regra de não riscar preço que nunca foi praticado. Dois planos e bump só com preço que o Arthur aprovar e que exista. Escassez só se for verdadeira. "Últimas vagas" continua de fora — a aula de promessa também condena.
3. **Saúde.** Emagrecimento, caneta e dor articular aparecem como exemplo de aula. O Balaclava desaconselha o nicho de emagrecimento. A copy de C-06 já trocou "melhore as dores e emagreça" por mobilidade, postura e disposição, sem cura e sem antes/depois. Não recoloque promessa de resultado físico, cura, antes/depois, nem pergunta ou afirmação de atributo pessoal de saúde. A dor serve para entender o público, não para virar claim. Quiz que pergunta peso, dor ou condição de saúde não entra.
4. **Garantia de 28 dias.** A aula de página recomenda 14 dias no Brasil e 28 fora, o dobro do mínimo europeu de 14. P-03 continua aberta. Os 28 dias são sugestão da aula, não decisão.
5. **Nome do entregável.** A aula pede para não dizer "PDF" e preferir "app" ou "método". Não dê ao produto um nome do que ele não é. O entregável é o que P-07 confirmar.
6. **Checkout do Brasil.** "Não pedir CPF" e aprovação de Pix acima de 70–75% são régua da aula para o Brasil. Em Portugal o meio é cartão, MB Way e Multibanco. Acompanhe a aprovação por meio de pagamento; não copie a régua do Pix.
7. **Gasto para julgar a oferta.** 100–150 anúncios (Allanzord) e cerca de R$ 2.500–3.500 de prejuízo em Portugal (Guilherme) são referência de aula. Não autorizam gasto nem descarte. Campanha pausada não é teste que alguém liga sozinho.
8. **PageView.** Connect rate não substitui conferir o PageView antes do primeiro anúncio.
