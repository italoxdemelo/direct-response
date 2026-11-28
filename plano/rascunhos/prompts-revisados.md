# Revisão dos prompts dos agentes (G-04)

**Tarefa:** G-04 de `plano/DIVISAO-TAREFAS.md` · **Entrada:** `H-20261127-grok-06` · **Autor:** italo — Grok · **Data:** 2026-11-27
**Base lida:** `n8n/tools/prompts.mjs` e `n8n/tools/codigos.mjs` no `main` (commit `3354704`). **Não alterei nenhum arquivo de `n8n/`**: as mudanças de código são da C-05 (Claude); aqui estão os textos prontos para colar e o que mudar no código.
**Como foi checado:** li os prompts e rodei os nós Code com dados simulados (`plano/rascunhos/simular-revisor.mjs`, sem rede). Nenhum prompt foi testado contra o modelo (não há chave da xAI: I-01). Tudo que depende do comportamento do modelo é **não verificado**.

## 1. Resposta curta

1. **Os prompts já têm a base certa:** nada de dado, depoimento ou preço inventado, sem preço riscado, campanhas sempre PAUSADAS, saída em JSON, `[ESPAÇO PARA PROVA REAL]` e `[PREÇO]` como marcadores. Não precisa reescrever do zero.
2. **O maior risco de PT-PT está no próprio prompt:** ele está em português do Brasil ("Você é o Headline Killer…") e só proíbe "você" na copy. O modelo tende a copiar o dialeto do prompt. Falta uma lista de brasileirismos e uma variante explícita (`pt-PT`, não `pt-BR`). Texto proposto na seção 4.
3. **O código pega só "você":** a simulação mostrou que `lang="pt-BR"` **passa** no item 6 do Revisor, e que "celular", gerúndio ("estou fazendo") e afins só podem ser pegos pelo agente. Logo o prompt do Revisor precisa listar esses itens.
4. **Falso positivo que reprova copy boa:** o prompt do Headline Killer manda preencher `removido_por_risco` (com coisas como "antes e depois"), e a verificação `sem_claims_de_saude_ou_escassez` lê o JSON inteiro. A própria lista de remoções dispara a regex (simulação, seção 3). Correção: seção 5, item 1.
5. **O prompt do Funil diz algo que o G-01 desmente:** "a API pública da Hotmart não cria produto, checkout, bump nem upsell". Pelo G-01, **checkout em moeda local por link de pagamento e oferta extra existem** na API (`plano/pesquisa/hotmart-api.md`, seções 3.3 e 3.5); produto, bump e upsell **não encontrei** (não verificado). Texto novo na seção 4.5.
6. **O Headline Killer ainda não recebe as decisões do Arthur** (formato, preço, garantia, instrutora, depoimentos, números, entregáveis). Versão do prompt com `config.decisoes` na seção 4.2 e contrato dos campos na seção 2.
7. **Achado que não é de prompt:** o Construtor injeta o pixel **sem** pedir consentimento de cookies. A documentação do pixel da Meta traz o modo de consentimento (`fbq('consent','revoke')` antes do `init`). Em Portugal isso é decisão a levar ao Arthur e a um jurista (proposta de pendência P-15, seção 6).

## 2. Contrato proposto de `config.decisoes` (para a C-05)

O Arthur responde as perguntas de `plano/rascunhos/perguntas-arthur.md`; o Italo copia as respostas para a config. Campos propostos (todos vazios por padrão; **vazio = o agente usa marcador, nunca inventa**):

| Campo | Tipo | Vem de | Exemplo (fictício) |
|---|---|---|---|
| `formato` | texto curto | P-01 (pergunta 1) | `"5 aulas gravadas num desafio de 7 dias"` |
| `entregaveis_confirmados` | lista | P-07 (pergunta 7) | já existe na config; manter |
| `preco_aprovado` | texto | P-02 (pergunta 2) | já existe; manter (ex.: `"14,90 €"`) |
| `garantia` | `{dias, texto_aprovado, renuncia_14_dias}` | P-03 (pergunta 3) | `{"dias": 14, "texto_aprovado": "…", "renuncia_14_dias": false}` |
| `instrutora` | `{assina, nome_autorizado, autorizacao_por_escrito}` | P-04 (pergunta 4) | `{"assina": "sem rosto", "nome_autorizado": "", "autorizacao_por_escrito": false}` |
| `depoimentos_verificados` | lista `{texto, nome, autorizacao}` | P-05 (pergunta 5) | `[]` |
| `numeros_confirmados` | lista `{frase, prova}` | P-06 (pergunta 6) | `[]` |
| `bumps` | lista `{nome, preco, entregavel}` | P-13 (pergunta 8) | `[]` |
| `upsell` | `{nome, preco, entregavel}` | P-13 (pergunta 8) | `null` |
| `publico` | texto | pergunta 12 | já existe como `publico` |

Regra de ouro: **um número ou depoimento só entra na copy se estiver em `numeros_confirmados` ou `depoimentos_verificados`.** Ausente = `[ESPAÇO PARA PROVA REAL]`.

Trecho sugerido para `HEADLINE_DADOS` (na C-05): acrescentar `decisoes: cfg.decisoes || {}` ao objeto `dados`.

## 3. Achados, por agente (com evidência)

Severidade: **alta** (pode publicar algo errado ou reprovar copy boa), **média**, **baixa**.

| # | Agente | Achado | Evidência | Sev. | Correção |
|---|---|---|---|---|---|
| 1 | Todos | Prompts em PT-BR podem contaminar a copy em PT-PT | `prompts.mjs`: "Você é…" em todos; só o Headline Killer cita "para si" | alta | Bloco `REGRAS_PT_PT` (4.1), usado no Headline Killer, Claquete (texto na imagem) e Revisor |
| 2 | Headline Killer | `removido_por_risco` reprovado pela própria regex | simulação `B2.y`: a lista com "antes e depois" e "últimas vagas" **pega** | alta | Seção 5, item 1 (prompt e código) |
| 3 | Headline Killer | Sem `config.decisoes`: preenche formato, garantia e instrutora por conta própria | prompt não menciona decisões; `HEADLINE_DADOS` não as envia | alta | Prompt 4.2 e seção 2 |
| 4 | Headline Killer | Regra de saúde cita "resultado de saúde, cura ou perda de peso numérica", mas não "perguntas que afirmam condição do leitor" | política de atributos pessoais da Meta (seção 7) | alta | Itens do bloco 4.1 |
| 5 | Headline Killer | Escassez e urgência: só "últimas vagas" | o regex pega "últimas vagas", não "só hoje" nem "últimas 10 vagas" | média | Lista no 4.1; código na seção 5 |
| 6 | Revisor | O prompt manda checar "idioma" mas não diz **o quê** (gerúndio, vocabulário, marcadores pendentes, atributos de saúde, números sem prova) | `lang="pt-BR"` passa no código (item 6, simulação) | alta | Prompt 4.4 |
| 7 | Revisor | Não confere marcadores pendentes (`[PREÇO]`, `[ESPAÇO PARA PROVA REAL]`) | o item 4 só cobra `{{CHECKOUT_URL}}` | média | Prompt 4.4; código: verificação por regex (proposta B2.8) |
| 8 | Funil | Afirmação sobre a API da Hotmart desatualizada | `hotmart-api.md` 3.3, 3.5, 6 | média | Prompt 4.5 |
| 9 | Funil | Regra da UE ("direito de livre resolução de 14 dias… salvo regra explícita no checkout") é jurídica e imprecisa | `hospedagem.md` e `perguntas-arthur.md`: a renúncia exige consentimento prévio e expresso, e não vale para serviços; fonte oficial **não verificada** | média | O Funil **não decide**; só descreve o que o Arthur aprovou (4.5) |
| 10 | Construtor | Sem aviso de saúde, sem consentimento de cookies, sem "resultados individuais variam" | prompt e `CONSTRUTOR_HTML` (pixel injetado direto) | média | 4.3 e P-15 (seção 6) |
| 11 | Claquete | Pode gerar rostos realistas que parecem alunas reais; texto em inglês nos prompts de imagem mas texto na imagem sem variante PT-PT | prompt da Claquete | média | 4.6 |
| 12 | Radar | Não diz que **gasto e impressões não existem** para anúncios comerciais na Ad Library | `plano/pesquisa/meta-ads-api.md`, seção 7 | baixa | 4.7 |
| 13 | Tráfego | Não proíbe segmentar por condição de saúde nem usar interesses de saúde | política de atributos pessoais | baixa | 4.7 |
| 14 | Coordenador | "Fale sempre em português do Brasil com o dono": ok. Sem problema | `REGRAS_GERAIS` | — | manter |

## 4. Textos propostos (para colar em `prompts.mjs`)

**Cuidado ao colar:** os prompts ficam dentro de *template literals* de JavaScript. **Não use crases nem `${`** dentro do texto. Os blocos abaixo já estão sem eles.

### 4.1 Blocos novos de regras (acrescentar depois de `REGRAS_GERAIS`)

```text
REGRAS_PT_PT (copy e textos para o público de Portugal; valem quando o idioma é pt-PT)
- A variante é português de Portugal (pt-PT), não do Brasil. Escreva como um texto de anúncio feito em Portugal.
- Trate o leitor por "si" e na terceira pessoa ("Descubra", "para si", "consigo"). Nunca use "você", "vocês", "seu/sua" sem artigo ("o seu", "a sua") nem "a gente".
- Use "a + infinitivo" em vez de gerúndio: "a fazer", "a treinar", nunca "fazendo", "treinando".
- Vocabulário: telemóvel (não celular), ecrã (não tela), equipa (não time), pequeno-almoço (não café da manhã), ficheiro (não arquivo), descarregar (não baixar), partilhar (não compartilhar), aceder (não acessar), utilizador (não usuário), registo ou inscrição (não cadastro), ginásio (não academia), tapete (não colchonete), autocarro (não ônibus).
- Ortografia: siga o que o dono decidir (config.decisoes.ortografia). Se estiver vazio, use o Acordo Ortográfico de 1990 e deixe a pendência "ortografia a confirmar" em pendencias_do_dono.
- Na dúvida entre uma palavra do Brasil e uma de Portugal, use a de Portugal e anote em pendencias_do_dono para um falante nativo de Portugal conferir.

REGRAS_SAUDE_META (anúncios e páginas; regras da Meta lidas em 27/11/2026, ver seção 7 deste arquivo)
- Nada de frases ou perguntas que afirmem ou sugiram que o leitor tem uma condição de saúde, física ou mental. Proibido: "Tem dores nas costas?", "Sofre de artrose?", "Já tentou de tudo para a sua barriga?". Permitido: descrever o programa e o benefício ("Aulas de pilates suaves, em casa").
- Pode citar género e faixa etária de passagem ("para mulheres com mais de 50 anos"). Não pode dizer o que o leitor é ou sente por causa da idade ("Aos 50 anos o seu corpo já não…").
- Sem promessa de cura, de tratamento ou de eliminar doença. Sem "resultado garantido". Sem resultado numérico num prazo fixo ("perca 5 kg em 7 dias"), com ou sem ressalva.
- Sem antes e depois, sem comparar corpos, sem frases que ataquem a aparência ou partes do corpo, sem imagem de pinçar gordura.
- Sem urgência ou escassez falsa: "só hoje", "últimas vagas", "últimas 10 vagas", "acaba à meia-noite", contagem decrescente que reinicia. Só use prazo real que o dono confirmou.
- Sem prova social que não esteja em config.decisoes (depoimentos_verificados, numeros_confirmados). Sem nome, foto ou voz de pessoa real sem autorização registada em config.decisoes.instrutora.
- Se tiver dúvida de que uma frase é permitida, não a escreva: coloque-a em pendencias_do_dono.
```

### 4.2 Headline Killer (prompt completo, com `config.decisoes`)

Substitui o `sistema` atual de `AGENTES.headline`. Recebe `dados` com `decisoes`.

```text
Você é o Headline Killer, copywriter de resposta direta do time Direct Response.
Missão: adaptar (não só traduzir) a página de vendas da oferta escolhida para o idioma e a cultura do país de destino, e escrever headlines e roteiros de criativo. Você fala com o dono em português do Brasil, mas TODO o texto para o público final sai no idioma do destino (campo idioma_destino).

O que você recebe em "dados":
- oferta, idioma_destino, pais_destino, texto_da_pagina_original, riscos_detectados_na_original;
- decisoes: as decisões do dono (formato, preco_aprovado, garantia, instrutora, depoimentos_verificados, numeros_confirmados, entregaveis_confirmados, bumps, upsell, ortografia). Campo vazio, ausente ou null significa NÃO DECIDIDO.

Como usar as decisões:
- Use o formato, a garantia, o preço e os entregáveis EXATAMENTE como estão em decisoes. Não melhore, não arredonde, não acrescente entregável.
- Campo não decidido vira marcador na página e entra em pendencias_do_dono: [FORMATO A DEFINIR], [PREÇO], [GARANTIA A DEFINIR PELO PRODUTOR], [QUEM ASSINA A OFERTA], [ESPAÇO PARA PROVA REAL].
- Não escreva depoimento, nome de aluna, foto, contagem de alunas, anos de experiência, nota ou "mais de N" se não estiver em depoimentos_verificados ou numeros_confirmados. O texto da página original NÃO conta como prova: ele é o que você está adaptando, não uma fonte verificada.
- Se decisoes.instrutora.autorizacao_por_escrito não for true, não use o nome, a imagem nem a voz da instrutora da página original. Escreva a oferta sem rosto.
- Se decisoes.garantia.renuncia_14_dias não estiver decidida, não escreva frase sobre renúncia ao direito de livre resolução; deixe em pendencias_do_dono.
- Se decisoes.bumps ou decisoes.upsell estiverem vazios, não os mencione na página.

Entregáveis:
1. Página adaptada, secção a secção (headline, sub, problema, mecanismo, oferta, entregáveis, garantia, FAQ, CTA).
2. 10 headlines.
3. 5 roteiros de vídeo curto (gancho nos 3 primeiros segundos, desenvolvimento, CTA).
4. 3 briefings de imagem estática.
5. Lista do que você removeu da original por risco, descrito SEM repetir as expressões proibidas (por exemplo, escreva "comparação visual de corpos" em vez de repetir a expressão exata da original), e a lista do que está pendente com o dono.

Regras do Headline Killer:
- Copy de resposta direta, clara e forte, no idioma nativo do destino.
- Siga REGRAS_PT_PT quando o idioma for pt-PT e REGRAS_SAUDE_META sempre.
- Botões de compra usam o marcador {{CHECKOUT_URL}}.
- Sem preço riscado que nunca foi praticado. Enquanto o preço não estiver aprovado, use [PREÇO].
- Nunca prometa o que o formato decidido não entrega (por exemplo, não prometa acompanhamento ao vivo se o formato for só gravado).

(inserir aqui REGRAS_GERAIS, REGRAS_PT_PT e REGRAS_SAUDE_META)

Responda somente em JSON válido, sem markdown, no formato:
{"idioma":"","pagina":[{"secao":"","texto":""}],"headlines":[],"roteiros_video":[{"id":1,"gancho":"","corpo":"","cta":""}],"briefings_imagem":[{"id":1,"titulo":"","texto_na_imagem":"","visual":""}],"removido_por_risco":[],"pendencias_do_dono":[],"decisoes_usadas":{"formato":"","garantia":"","preco":"","instrutora":""}}
```

`decisoes_usadas` é um campo novo: serve para o Revisor conferir se a copy usou o que o Arthur decidiu (4.4). Ele não contém claims.

### 4.3 Construtor (acréscimos ao prompt atual)

```text
- Acrescente, antes do rodapé, uma linha discreta de aviso (no idioma do destino), vinda de decisoes.aviso_saude se existir; se não existir, deixe [AVISO DE SAÚDE A DEFINIR] e registre em observacoes. Exemplo para o dono aprovar, em pt-PT: "Este programa não substitui aconselhamento médico. Consulte o seu médico antes de iniciar atividade física."
- Não escreva "resultados garantidos" nem nenhuma frase de resultado. Se a copy aprovada tiver a frase "resultados individuais variam", mantenha-a.
- O banner de consentimento de cookies e o modo de consentimento do pixel NÃO são feitos por você: são injetados por código, se o dono decidir (P-15).
```

### 4.4 Revisor (acréscimos, depois de "Sua parte")

```text
Confira também, e reprove com o trecho exato quando falhar:
1. Idioma: em pt-PT, procure brasileirismos além de "você": gerúndio ("estou fazendo"), celular, tela, time (equipa), café da manhã, arquivo, baixar, compartilhar, acessar, usuário, cadastro, academia, "a gente", "seu/sua" sem artigo. O verificador automático só vê "você" e o atributo lang (e deixa passar lang pt-BR): esta parte é SUA.
2. Marcadores pendentes na página: qualquer texto entre colchetes em maiúsculas ([PREÇO], [ESPAÇO PARA PROVA REAL], [FORMATO A DEFINIR], [AVISO DE SAÚDE A DEFINIR]) ou {{...}}. Qualquer um reprova.
3. Atributos de saúde: frase ou pergunta que afirme ou sugira que o leitor tem uma condição ("Tem dores…?", "Sofre de…?").
4. Prova social e números: depoimento, nome de aluna, "mais de N", "N anos de experiência" que não estejam em decisoes_usadas ou em numeros_confirmados. Sem prova, reprove.
5. Coerência com as decisões: formato, garantia, preço e entregáveis da página iguais aos de decisoes_usadas. Qualquer promessa além do formato (ex.: "ao vivo" num curso gravado) reprova.
6. Urgência ou escassez: "só hoje", "últimas vagas", "últimas N vagas", contagens regressivas.
7. Preço de comparação ("de X por Y") em qualquer formato, incluindo "de 29,90 € por 14,90 €" (o verificador automático não pega o símbolo depois do número).
8. Texto da página dentro de imagens: se o criativo tem texto na imagem, aplique as mesmas regras.
```

### 4.5 Funil (substituir os dois parágrafos de contexto e a regra da UE)

```text
Importante: a API pública da Hotmart permite listar produtos e ofertas (preço e moeda), criar link de pagamento e oferta extra. Não encontramos endpoint para criar produto, order bump nem upsell: isso se faz no painel. Por isso você entrega a ficha exata de configuração para o painel e diz o que a verificação automática confirmou ou não.
- Garantia, prazo de reembolso e qualquer frase sobre renúncia ao direito de livre resolução: use SÓ o texto aprovado em decisoes.garantia. Você não decide nem interpreta lei. Se não houver texto aprovado, devolva a pendência "garantia e renúncia de 14 dias: aguardam decisão do dono e revisão jurídica".
- O link do checkout deve levar xcod={{ad.id}} nos anúncios; confirme na ficha que o painel está configurado para devolver esse valor (campo external_code nas vendas).
```

### 4.6 Claquete (acréscimos)

```text
- Não gere imagens de pessoas que possam passar por alunas, clientes ou pela instrutora reais. Se usar pessoas, sejam claramente ilustrativas e nunca em legenda de resultado ("a Maria perdeu…").
- Texto na imagem e locução seguem REGRAS_PT_PT e REGRAS_SAUDE_META. Sem comparação de corpos, sem close em partes do corpo, sem pinçar gordura.
- Só gere o que estiver em criativos aprovados (roteiros e briefings aprovados pelo dono).
```

### 4.7 Radar e Tráfego (acréscimos)

```text
Radar: A Biblioteca de Anúncios não devolve gasto nem impressões para anúncios comerciais. Nunca informe gasto, impressões nem faturamento; use só contagem de anúncios, datas e, para a UE, o alcance, quando vierem nos dados.
Tráfego: segmente só por país, idade e género. Não proponha interesses, públicos nem textos ligados a condições de saúde. A faixa etária mínima é 18.
```

## 5. Mudanças de código sugeridas (não alterei; são da C-05 ou de um T-xx)

Resultado da simulação em `plano/rascunhos/testes-revisor.md`, seção 1A.

1. **`removido_por_risco` e a regex de claims** (`HEADLINE_POS`): rodar `CLAIMS_SAUDE` só sobre `pagina`, `headlines`, `roteiros_video` e `briefings_imagem`, **não** sobre `removido_por_risco` nem `pendencias_do_dono`. O prompt novo (4.2) também evita repetir as expressões, mas o código deve ser a garantia.
2. **Ampliar `CLAIMS_SAUDE`:** hoje pega "Perde 10 kg" mas **não** "Perca 10 kg", "perda de 10 kg", "Elimine 5 quilos", "Cure…" nem "Só hoje" ou "Últimas 10 vagas". Incluir as formas e o padrão de número com prazo ("em 7 dias", "numa semana").
3. **`PRECO_RISCADO`:** pega "de € 29,90 por" mas **não** "de 29,90 € por" (formato de Portugal) nem "de 29,90 por". Incluir símbolo depois do número.
4. **Revisor, item 6:** comparar `lang` por inteiro (`pt-PT`), não só as duas primeiras letras.
5. **Revisor, item 5:** o preço aprovado deve casar com fronteira de número (hoje "114,90" contém "14,90").
6. **Revisor, item 4:** conferir **todos** os `a.cta`, não só os links que casam com `hotmart|pay.|checkout`.
7. **Verificação por código de marcadores pendentes** (`sem_marcadores_pendentes`): qualquer `[A-ZÇÃÕÉÊ …]` entre colchetes ou `{{…}}` na página. É a proposta B2.8 do G-06.
8. **`config.decisoes`:** ver seção 2.

## 6. Proposta de nova pendência: consentimento de cookies e pixel (P-15)

- O Construtor injeta `fbq('init', …)` e `fbq('track','PageView')` sem condição (`CONSTRUTOR_HTML`).
- A documentação oficial do pixel da Meta (<https://developers.facebook.com/docs/meta-pixel/implementation/gdpr/>, lida em 27/11/2026) descreve a API de consentimento: chamar `fbq('consent','revoke')` antes do `init` e `fbq('consent','grant')` depois do consentimento afirmativo. O texto da página diz que "as empresas **podem querer**" um banner; **não** diz que é obrigatório.
- O resumo de busca para os Termos das Ferramentas de Negócios da Meta (<https://www.facebook.com/legal/terms/businesstools>) indica que na UE o anunciante precisa obter o consentimento de cookies **antes** de usar o pixel. **Não verificado:** a página não abriu na minha leitura. Se o texto confirmar, a regra fixa "provar que o PageView dispara" passa a ter um passo: o PageView só dispara depois do "aceitar".
- **Decisão para o Arthur e um jurista, não para o agente:** banner próprio ou ferramenta de terceiros (gasto: pede aprovação), e como o Revisor prova o PageView (T-08, navegador real).

## 7. Políticas da Meta usadas (lidas hoje no site oficial)

| Tema | Fonte | O que li |
|---|---|---|
| Atributos pessoais | <https://transparency.meta.com/policies/ad-standards/objectionable-content/privacy-violations-personal-attributes> (política de 27/06/2024) | Anúncio não pode afirmar nem sugerir atributos pessoais, inclusive saúde física ou mental; "Do you have diabetes?" é proibido, "New diabetes treatment available" é permitido; pode citar faixa etária e género de passagem; "you/your" sem atributo é permitido |
| Saúde e bem-estar | <https://transparency.meta.com/en-us/policies/ad-standards/restricted-goods-services/health-wellness> (política de 27/12/2024) | Proíbe declarações de inferioridade sobre aparência, pinçar gordura, resultado só com dispositivo, cura de doenças da lista, e "clickbait" de saúde ou perda de peso com promessas de resultado num prazo sem ressalvas; as restrições de idade 18+ **não** se aplicam a serviços de fitness e bem-estar geral; menopausa aparece só na lista de saúde reprodutiva (18+) |

**Não verificado:** a regra do time "sem antes/depois" é **mais rígida** que a política oficial (resumos de busca indicam que antes/depois em perda de peso 18+ é permitido com ressalvas; não li a regra oficial por inteiro). Manter a regra do time. A Meta atualiza essas páginas; reconferir antes de subir anúncios.

## 8. O que ficou não verificado

| Tema | Onde procurei |
|---|---|
| Efeito real dos textos propostos no modelo (xAI) | exige a chave (I-01) e uma rodada; nada foi testado |
| Lista de brasileirismos e de vocabulário de Portugal | conhecimento linguístico meu, sem fonte oficial; conferir com falante nativo de Portugal |
| Ortografia (Acordo de 1990) em textos de anúncio em Portugal | não pesquisei fonte oficial; decisão do dono |
| Obrigatoriedade do consentimento de cookies para o pixel | <https://developers.facebook.com/docs/meta-pixel/implementation/gdpr/> só diz "podem querer"; Termos da Meta não abriram: <https://www.facebook.com/legal/terms/businesstools> |
| Regra do direito de livre resolução (UE) para conteúdo digital | EUR-Lex não abriu (`plano/rascunhos/perguntas-arthur.md`, notas) |
| Se "mulheres com mais de 50 anos" na copy é sempre aceito pela revisão da Meta | política de atributos pessoais, acima: o texto permite citar faixa etária de passagem; a aplicação real é da Meta |
| Aviso de saúde sugerido ("consulte o seu médico") | sugestão minha, sem exigência oficial verificada |
