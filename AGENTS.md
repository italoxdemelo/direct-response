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
| `plano/PLANO-DE-ACAO.md` | Plano de ação com as tarefas de cada fase, quem faz, status e quem fez. | Sim: marque status, "Feito por", data e evidência ao concluir uma tarefa, e acrescente uma linha no registro do fim. |
| `historico/MODELO-ENTRADA.md` | Modelo da entrada. | Só com entrada no histórico explicando a mudança. |
| `AGENTS.md` / `CLAUDE.md` | Estas regras. | Só com entrada no histórico. |

## 6. Conflitos de merge no histórico

Se duas pessoas registrarem entradas ao mesmo tempo, o `git pull --rebase` vai acusar conflito no topo do `CHANGELOG.md`. Resolva **mantendo as duas entradas**, a mais recente (por data e hora) por cima. Os IDs levam o autor, então nunca colidem. Faça o mesmo no mapa.

## 7. Idioma

Responda e registre em **português**. A copy para Portugal segue PT-PT (ver `contexto/02-entrega-headline-killer.md`); o histórico e as conversas, PT-BR.
