# Direct Response — contexto do projeto (Arthur Vilas)

**Para a IA parceira:** leia este ficheiro primeiro. Depois abra `01-ofertas-radar.md` e `02-entrega-headline-killer.md` (ou o original em `headline-killer/pilates50-pt/entrega.md`). Os prints estão em `radar/br/` e `radar/pt/`.

**Regra de ouro:** nunca inventar dados, depoimentos, preços, contagens de anúncios, datas ou prova social. O que não estiver verificado deve ser marcado como **não verificado**. Este pacote foi montado a 25/11/2026, fuso America/Bahia (UTC-3), a partir das transcrições reais do coordenador, do Radar e do Headline Killer, e dos ficheiros que já existiam na máquina partilhada do time. Nada aqui é senha, token ou credencial.

---

## 1. Objetivo

Levar ofertas low ticket de infoproduto que já escalaram no Brasil para outros países, começando por **Portugal**.

O fluxo do time: o Radar minera ofertas escaladas na Biblioteca de Anúncios do Meta (muitos anúncios ativos e anúncios a rodar há meses) e confere se já existe equivalente no país de destino; o Headline Killer adapta a página e escreve headlines e roteiros no idioma nativo; o Construtor publica a página com pixel e UTM; o Funil monta o produto na Hotmart (checkout em moeda local, bumps e upsells); a Claquete produz os criativos; o Revisor só aprova com tudo a 100%; o Tráfego sobe as campanhas **sempre pausadas**. O coordenador (Time de Direct Response) reparte as tarefas, cobra prazos e reporta o progresso ao Arthur em lista numerada, sempre em português.

---

## 2. Time e regras de cada agente

O coordenador criou os 7 agentes a 25/11/2026. A secção "Direct Response" na barra lateral **não chegou a ser criada** (limitação da ferramenta); os agentes existem, mas aparecem soltos.

| Agente | Papel | Regras |
|---|---|---|
| **Radar** (minerador) | Acha ofertas escaladas no Brasil na Biblioteca de Anúncios do Meta e confere se alguém já roda o equivalente no país de destino. | Entrega prints e números reais. Nunca inventa dados. O que não confirmar, marca como "não verificado". |
| **Headline Killer** (copywriter) | Traduz e adapta a página de vendas e escreve headlines e roteiros de criativo no idioma nativo, com copy agressiva de resposta direta. | Sem prova social falsa. Sem preço riscado que nunca foi praticado. Seguir as regras de saúde da Meta (sem promessa de resultado físico ou de cura, sem antes/depois, sem afirmar atributos pessoais de saúde). |
| **Construtor** (página) | Monta e publica a página de vendas traduzida, com o pixel do Meta e o script de UTM. | Confere que o **PageView dispara antes de qualquer anúncio**. Só publica copy aprovada pelo Arthur. |
| **Funil** (Hotmart) | Cria o produto, o checkout na moeda local, os bumps e os upsells, e coloca o link do checkout nos botões da página. | Só define preço com o ok do Arthur. |
| **Claquete** (criativos) | Produz os vídeos e as imagens dos anúncios a partir dos roteiros aprovados. | Não inventa prova social nem claims proibidos. |
| **Revisor** | Confere tudo antes de entregar (links, pixel, preço, idioma, erros). | Só aprova quando estiver 100%, com evidência (checklist de 7 itens). |
| **Tráfego** (gestor) | Sobe campanhas na conta de anúncios do Arthur via API. | **Sempre PAUSADAS. Nunca ativa nada.** Quem ativa é sempre o Arthur. Confere pela API que ficou pausado. |
| **Coordenador** (Time de Direct Response) | Divide tarefas, cobra prazos e entrega o progresso ao Arthur em lista numerada. | Fala sempre em português com o Arthur. Não inventa dados. |

Regras transversais do projeto:

- Nunca inventar dados.
- Sem prova social falsa nem preço riscado falso.
- Conferir o PageView antes dos anúncios.
- Campanhas sobem pausadas; o Arthur é quem ativa.
- Precisará de acesso a Hotmart, Meta Ads e ao pixel quando o Funil, o Construtor e o Tráfego entrarem em cena. Esse acesso **ainda não foi pedido nem configurado** neste pacote, e não há credenciais aqui.

Identificadores dos agentes (para o time interno; a IA parceira não precisa de os usar):

- Radar: `36893ec4-4759-4088-b929-56bc93421b81`
- Headline Killer: `480ee222-f78d-4500-94c5-8406fc06902c`
- Construtor: `1811db0a-338e-4e8b-a250-5e6c075eaa3e`
- Funil: `ac642d36-b347-4266-8df3-5a2d73c0fd93`
- Claquete: `80d6344c-a0e4-4374-a1a0-4e0bf2a555fb`
- Revisor: `343d7321-a807-4e36-a2f0-1b1b5644cfc4`
- Tráfego: `77003ed6-1570-4ca4-a110-9e3737a235c4`
- Coordenador: `f76863ad-36a6-4abd-9378-2dd8fd233a98`

---

## 3. Linha do tempo das decisões

Todos os horários abaixo estão no fuso **America/Bahia (UTC-3)**, no dia **25/11/2026**.

1. **~15:52** — O Arthur pediu para montar o time completo de Direct Response, com a secção e os 7 agentes, e deixou o país de destino como `[PAÍS]`.
2. O coordenador criou os 7 agentes com as regras acima. Não conseguiu criar a secção "Direct Response" na barra lateral.
3. O Arthur escolheu **Portugal** como primeiro país.
4. O coordenador briefou o Radar: minerar de 5 a 10 ofertas low ticket de infoproduto escaladas no Brasil (muitos anúncios ativos e anúncios a rodar há 2 meses ou mais) e conferir a concorrência em Portugal, com prints e números reais.
5. **~16:15** — O Radar fechou a parte do Brasil com **6 ofertas** (não chegou a 10 por causa do tempo) e foi checar equivalentes na Biblioteca de Anúncios de Portugal.
6. **~16:27** — O Radar entregou as 6 classificadas: **2 oportunidades claras** (n.º 3 Adesiva Pro e n.º 4 Avaliação Física), **3 com concorrência existente** (n.º 1 Desenvolve Cursos, n.º 5 Molde F1, n.º 6 ebook de bolos) e **1 inconclusiva** (n.º 2 IBS/CBS, porque o tema só existe no Brasil).
7. O Arthur pediu para o Radar minerar **mais 4 ofertas** antes de escolher, evitando os nichos já com concorrência em Portugal, as ofertas que só valem no Brasil e as apps, com prioridade a PDF e curso.
8. **~16:50** — O Radar entregou as ofertas **7 a 10**, todas com preço total verificado na página ou no checkout: **1 oportunidade clara** (n.º 10 Desafio Pilates em Casa 50+) e **3 com concorrência existente** (n.º 7 Mundo do Fio, n.º 8 Leonardo Adestra, n.º 9 Prof. Nonato; nesta última a concorrência em PT só começou em novembro de 2026).
9. O Arthur escolheu a oferta **Desafio Pilates em Casa 50+** (anunciante Lays Sant'anna; página da oferta usa o nome Lays Trancoso).
10. O coordenador briefou o Headline Killer: adaptar a página e escrever 10 headlines, 5 roteiros de vídeo e 3 de imagem, em português de Portugal, com `[PREÇO]` e `[FORMATO]` em aberto, e dentro das regras de saúde da Meta.
11. **~17:10** — O Headline Killer entregou o pacote completo em `headline-killer/pilates50-pt/entrega.md`. O Construtor já tinha pedido a copy final aprovada, mas a copy **ainda não foi aprovada** pelo Arthur. Funil, Claquete, Revisor e Tráfego ainda não entraram em ação.
12. **~20:58** — O Arthur pediu esta pasta de contexto para partilhar o projeto com outra IA parceira.

A tabela completa das 10 ofertas, com os números e as classificações do Radar, está em `01-ofertas-radar.md`.

---

## 4. Oferta escolhida e status atual

**Oferta:** Desafio Pilates em Casa 50+  
**Anunciante no BR (Radar):** Lays Sant'anna (page_id `2016271568674266`)  
**Nome na página de vendas:** Lays Trancoso — `https://pilates.laystrancoso.com/`  
**Checkout BR:** OnProfit  
**Preço BR verificado:** R$ 29,90 (a página original mostrava "de R$ 97" em oferta de Black Friday; esse preço riscado **não deve ser reproduzido** na adaptação)  
**Escala no BR (Radar):** ~450 anúncios ativos; o mais antigo que carregou é de 18/05/2026 (ID `1013680577748916`). Só 78 anúncios carregaram, portanto pode haver um mais antigo.  
**Leitura em Portugal:** oportunidade clara no ângulo "desafio pilates 50+". Não foi encontrado nenhum desafio curto de pilates para mulheres 50+. O nicho geral de "pilates em casa" é disputado por apps e quizzes (Lessie, Liliia, Tori Repa) e pela Mova (page_id `155530864614080`, ~13 ativos desde 17/03/2026, que leva a um app). Buscas: "pilates em casa" ~330, "desafio pilates" ~190, "pilates online mulheres 50" 0.

**Ângulo da adaptação (Headline Killer):** desafio curto (1 semana / 5 aulas), em casa, desenhado para mulheres com mais de 50 anos, com começo guiado, simplicidade, acompanhamento humano e pagamento único — em contraste com as apps de subscrição que dominam em Portugal. Tratamento em PT-PT: 3.ª pessoa com "para si/consigo", sem "você".

**O que já está pronto**

- Mineração das 10 ofertas + prints BR e PT.
- Copy adaptada da página (secção a secção), 10 headlines, 5 roteiros de vídeo curto e 3 briefings de imagem estática, com os riscos da original removidos (promessa de emagrecer até 2 kg em 7 dias, antes/depois, cura de patologias, depoimentos de cura e perda de peso, "DE R$ 97 / 60% OFF Black Friday", "últimas vagas").
- Entregáveis da original, já enquadrados na copy (ainda dependem de o Arthur confirmar que vai entregá-los de facto): 5 aulas de segunda a sexta em `[FORMATO]`; acesso às gravações durante 12 meses; grupo de apoio e motivação no WhatsApp; guia prático de compras e organização alimentar (na original: "Guia de compras").

**O que ainda não começou**

- Construtor: página ainda não montada nem publicada; pixel e UTM ainda não instalados; PageView ainda não conferido.
- Funil: produto, checkout em euro, bumps e upsells na Hotmart ainda não criados; botões da página ainda sem link de checkout.
- Claquete: criativos ainda não produzidos (espera roteiros aprovados).
- Revisor e Tráfego: ainda não atuaram. Não há campanhas.

---

## 5. Pendências do Arthur (bloqueiam o próximo passo)

O Headline Killer e o coordenador deixaram estas decisões em aberto. Sem elas, a copy não deve ser publicada e o Funil/Construtor/Claquete não devem avançar.

1. **Formato das aulas (`[FORMATO]`).** A original tem 5 aulas ao vivo, de segunda a sexta, "direto no WhatsApp". Opções já colocadas na mesa: gravar um desafio de 7 a 21 dias; contratar uma instrutora em Portugal; entregar só em PDF com vídeos curtos; ou manter ao vivo no fuso de Lisboa versus aulas gravadas passo a passo. Quem decide é o Arthur.
2. **Preço em euro (`[PREÇO]`).** Referência do coordenador: algo entre 9,90 € e 14,90 €, como equivalente low ticket dos R$ 29,90. O Headline Killer também deixou 19,90 € como exemplo na lista de pendências. É só referência; o preço só fecha com o ok do Arthur. Sem preço riscado de/por.
3. **Garantia / reembolso na União Europeia.** Direito de livre resolução (a referência na entrega é de 14 dias em compras digitais, ou outra regra explícita no checkout). Há um bloco `[GARANTIA A DEFINIR PELO PRODUTOR]` na copy.
4. **Instrutora e história próprias.** Confirmar quem assina a oferta em Portugal: se se mantém Lays Trancoso (nome na página) / Lays Sant'anna (nome no briefing do Radar), ou se haverá instrutora e marca locais. O áudio da Lays tem sotaque brasileiro — pode funcionar se for transparente, mas precisa de coerência com os vídeos gravados.
5. **Depoimentos reais.** Os 3 depoimentos da original (perda de 3–4 kg em 7 dias e cura de ciático/hérnia) foram retirados. Só entram testemunhos reais e autorizados, no espaço `[ESPAÇO PARA PROVA REAL]`, focados na experiência com as aulas — sem relatos de cura clínica nem perda de peso numérica.
6. **Números de autoridade da instrutora.** A bio original cita mais de 7 anos de experiência e mais de 20 mil mulheres 50+. Está marcado como `[PROVA REAL A CONFIRMAR]`. Não usar esses números até o Arthur confirmar.
7. **Entregáveis reais a produzir ou confirmar:** gravações das aulas (12 meses de acesso na promessa atual), grupo de apoio no WhatsApp, e o guia de compras / organização alimentar. Se algum destes não for entregue de facto, a copy tem de ser ajustada antes de publicar.

---

## 6. Como o Radar mediu (para não reler os números fora de contexto)

- A contagem de anúncios é o "~X results" com o filtro **Ativos** na Biblioteca de Anúncios. Oscila ±1 entre carregamentos.
- A data é a do anúncio **ativo mais antigo que carregou**. Pode haver um mais antigo que não tenha aparecido no carregamento.
- Página do anunciante: `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&view_all_page_id=<ID>` (em PT, `country=PT`).
- Anúncio: `https://www.facebook.com/ads/library/?id=<ID>`.
- Em Portugal, o Radar só mediu contagem e data dos concorrentes com `page_id` citado; nos outros, viu só anúncios soltos.
- Nenhum checkout foi pago ou preenchido.
- Nenhum dos anunciantes brasileiros das 10 ofertas foi encontrado a rodar anúncios em Portugal com a própria página, segundo o Radar.
- Na segunda rodada foram descartados (não entram na tabela das 10): Inglês Teacher Paula (é app); Renan Zimmer (específico do Brasil); Receitas para diabéticos (sem preço visível); Bíblia de Estudo (R$ 247); Crocheteca (é app); Cantinho do Crochê (depende de licença da Turma da Mônica); Jairo Teixeira (mesmo nicho de cães da oferta 8).

---

## 7. Índice dos ficheiros desta pasta

| Ficheiro | O que é |
|---|---|
| `00-LEIA-PRIMEIRO.md` | Este documento: objetivo, time, regras, linha do tempo, status, pendências e índice. |
| `01-ofertas-radar.md` | Tabela das 10 ofertas mineradas pelo Radar, com números, links, classificação e ressalvas, extraída das mensagens reais do agente. |
| `02-entrega-headline-killer.md` | Cópia da entrega completa do Headline Killer (página adaptada, 10 headlines, 5 roteiros de vídeo, 3 de imagem e riscos). |
| `headline-killer/pilates50-pt/entrega.md` | Original da mesma entrega, no caminho em que o Headline Killer a gravou. |
| `headline-killer/pilates50-pt/msg.md` | Mensagem que o Headline Killer enviou ao coordenador (resumo numerado + o texto da entrega). |
| `radar/br/desenvolve-cursos_count.png` | Oferta 1 — contagem de anúncios ativos no Brasil (Desenvolve Cursos). |
| `radar/br/desenvolve-cursos_oldest.png` | Oferta 1 — anúncio ativo mais antigo no Brasil. |
| `radar/br/desenvolve-cursos_sales.png` | Oferta 1 — página de vendas / preço. |
| `radar/br/auditor-jefferson-ibs-cbs_count.png` | Oferta 2 — contagem BR (ebook IBS e CBS). |
| `radar/br/auditor-jefferson-ibs-cbs_oldest.png` | Oferta 2 — anúncio ativo mais antigo no BR. |
| `radar/br/auditor-jefferson-ibs-cbs_sales.png` | Oferta 2 — página de vendas / preço. |
| `radar/br/insta-criativo-adesiva-pro_count.png` | Oferta 3 — contagem BR (Adesiva Pro). |
| `radar/br/insta-criativo-adesiva-pro_oldest.png` | Oferta 3 — anúncio ativo mais antigo no BR. |
| `radar/br/insta-criativo-adesiva-pro_sales.png` | Oferta 3 — página de vendas / preço. |
| `radar/br/clube-educacao-fisica-avaliacao-fisica_count.png` | Oferta 4 — contagem BR (Guia de Avaliação Física). |
| `radar/br/clube-educacao-fisica-avaliacao-fisica_oldest.png` | Oferta 4 — anúncio ativo mais antigo no BR. |
| `radar/br/clube-educacao-fisica-avaliacao-fisica_sales.png` | Oferta 4 — checkout / criativo de preço. |
| `radar/br/michaelle-molde-f1_count.png` | Oferta 5 — contagem BR (Molde F1). |
| `radar/br/michaelle-molde-f1_oldest.png` | Oferta 5 — anúncio ativo mais antigo no BR. |
| `radar/br/michaelle-molde-f1_sales.png` | Oferta 5 — checkout / preço. |
| `radar/br/doce-atelie-paty-ebook-bolo-retangular_count.png` | Oferta 6 — contagem BR (ebook de bolos). |
| `radar/br/doce-atelie-paty-ebook-bolo-retangular_oldest.png` | Oferta 6 — anúncio ativo mais antigo no BR. |
| `radar/br/doce-atelie-paty-ebook-bolo-retangular_sales.png` | Oferta 6 — página de vendas / preço. |
| `radar/br/mundo-do-fio-50-bones-croche_count.png` | Oferta 7 — contagem BR (50 Bonés em Crochê). |
| `radar/br/mundo-do-fio-50-bones-croche_oldest.png` | Oferta 7 — anúncio ativo mais antigo no BR. |
| `radar/br/mundo-do-fio-50-bones-croche_sales.png` | Oferta 7 — página de vendas / preço. |
| `radar/br/leonardo-adestra-de-bem-com-filhote_count.png` | Oferta 8 — contagem BR (De Bem com o Filhote). |
| `radar/br/leonardo-adestra-de-bem-com-filhote_oldest.png` | Oferta 8 — anúncio ativo mais antigo no BR. |
| `radar/br/leonardo-adestra-de-bem-com-filhote_sales.png` | Oferta 8 — página de vendas / preço. |
| `radar/br/nonato-diesel-common-rail_count.png` | Oferta 9 — contagem BR (PDF diesel Common Rail). |
| `radar/br/nonato-diesel-common-rail_oldest.png` | Oferta 9 — anúncio ativo mais antigo no BR. |
| `radar/br/nonato-diesel-common-rail_sales.png` | Oferta 9 — checkout / preço. |
| `radar/br/lays-desafio-pilates-50_count.png` | Oferta 10 (escolhida) — contagem BR (Desafio Pilates em Casa 50+). |
| `radar/br/lays-desafio-pilates-50_oldest.png` | Oferta 10 — anúncio ativo mais antigo no BR. |
| `radar/br/lays-desafio-pilates-50_sales.png` | Oferta 10 — página de vendas / preço. |
| `radar/pt/gestao-pessoas_curso-gestao-de-pessoas-certificado.png` | Oferta 1 — busca em Portugal por curso de gestão de pessoas. |
| `radar/pt/gestao-pessoas_competitor-cursos-ao-minuto.png` | Oferta 1 — concorrente Cursos ao Minuto em PT. |
| `radar/pt/ibs-cbs_iva-ebook.png` | Oferta 2 — busca em PT por "IVA ebook". |
| `radar/pt/ibs-cbs_fiscalidade-curso-online.png` | Oferta 2 — busca em PT por fiscalidade / curso online. |
| `radar/pt/ibs-cbs_competitor-guilia-lopez.png` | Oferta 2 — concorrente relacionado Guilia lopez em PT. |
| `radar/pt/adesiva-pro_adesiva-pro.png` | Oferta 3 — busca em PT pelo nome Adesiva Pro. |
| `radar/pt/adesiva-pro_stories-para-lojas.png` | Oferta 3 — busca em PT por "stories para lojas". |
| `radar/pt/adesiva-pro_competitor-luciana-camelo-figurinhas.png` | Oferta 3 — Luciana Camelo em PT (stickers para dentistas; não é equivalente para lojistas). |
| `radar/pt/avaliacao-fisica_clube-educacao-fisica.png` | Oferta 4 — busca em PT pelo anunciante / marca. |
| `radar/pt/avaliacao-fisica_personal-trainer-curso-online.png` | Oferta 4 — busca em PT por curso de personal trainer. |
| `radar/pt/molde-f1_molde-f1.png` | Oferta 5 — busca em PT por "molde f1". |
| `radar/pt/molde-f1_curso-unhas-gel-online.png` | Oferta 5 — busca em PT por curso de unhas gel. |
| `radar/pt/molde-f1_competitor-veronica-nails.png` | Oferta 5 — concorrente Veronica Nails (a mesma oferta Molde F1 já anunciada em PT). |
| `radar/pt/ebook-bolos_ebook-bolos.png` | Oferta 6 — busca em PT por "ebook bolos". |
| `radar/pt/ebook-bolos_metodobrp-zero.png` | Oferta 6 — busca pelo domínio/marca metodobrp em PT. |
| `radar/pt/ebook-bolos_competitor-alemonteiro-comerbem.png` | Oferta 6 — concorrente AleMonteiro comerbem em PT. |
| `radar/pt/mundo-do-fio_ebook-croche.png` | Oferta 7 — busca em PT por "ebook croché". |
| `radar/pt/mundo-do-fio_competitor-crocheteiradesucesso.png` | Oferta 7 — concorrente Crocheteiradesucesso em PT. |
| `radar/pt/leonardo-adestra_curso-cao-filhote.png` | Oferta 8 — busca em PT por "curso cão filhote". |
| `radar/pt/leonardo-adestra_competitor-marina-volanski.png` | Oferta 8 — concorrente Marina Volanski em PT. |
| `radar/pt/nonato-diesel_curso-mecanica-automovel-online.png` | Oferta 9 — busca em PT por curso de mecânica automóvel online. |
| `radar/pt/nonato-diesel_competitor-fabricio-junior.png` | Oferta 9 — concorrente Fabricio Junior em PT. |
| `radar/pt/nonato-diesel_competitor-diagnostico-certo.png` | Oferta 9 — concorrente Diagnóstico Certo em PT. |
| `radar/pt/lays-pilates-50_pilates-em-casa.png` | Oferta 10 — busca em PT por "pilates em casa". |
| `radar/pt/lays-pilates-50_competitor-mova.png` | Oferta 10 — concorrente Mova (app) em PT. |

**O que não foi encontrado nesta máquina e portanto não entra neste pacote**

- Não havia relatórios em Markdown gravados pelo Radar; a tabela foi reconstruída a partir das mensagens reais do agente. Dois pormenores ficaram parcialmente truncados na transcrição e estão assinalados em `01-ofertas-radar.md`: o URL exato da página de vendas da Adesiva Pro, e o nome completo do curso da Marina Volanski.
- Não existiam pastas nem ficheiros de Construtor, Funil, Claquete, Revisor ou Tráfego em `/workspace` — esses agentes ainda não produziram entregáveis.
- A secção "Direct Response" na barra lateral não chegou a ser criada.

---

*Pacote gerado a 25/11/2026, America/Bahia (UTC-3). Sem senhas, tokens ou credenciais.*
