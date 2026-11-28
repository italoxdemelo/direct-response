# Relatório: fluxo de Direct Response no n8n
Data: 27/11/2026

## O que foi feito
- **Plano técnico:** a especificação completa do fluxo, etapa por etapa, está no repositório (`plano/PLANO-DE-ACAO.md`).
- **Código no GitHub:** o gerador dos workflows agora está versionado no repositório, que é a fonte oficial. O repositório é igual ao que está rodando no n8n.
- **Fluxo completo no n8n:** são 9 workflows publicados (Coordenador, etapas 01 a 07 e o workflow de erros). O Coordenador continua desligado até termos as credenciais.
- **Segurança e confiabilidade:**
  - os erros ficam registrados;
  - a copy aprovada fica congelada e não é reescrita;
  - as campanhas e os anúncios são criados sempre PAUSADOS e não duplicam;
  - o Revisor reprova páginas com preço errado, idioma errado ou marcadores esquecidos.
- **Pesquisa do Grok, revisada:** APIs da Hotmart e da Meta, hospedagem, revisão dos prompts e roteiro de testes. Com essa pesquisa, a API da Meta foi atualizada para a v26, porque a versão anterior tinha expirado. Também entraram os dados de DSA que a Meta exige para anunciar na UE.
- **Novas funções:**
  - publicação automática da página no Netlify;
  - conferência de preço e moeda pela API da Hotmart;
  - criação dos anúncios pausados;
  - imagens salvas no disco e aprovação dos criativos.
- **Testes:** todos os testes offline passam. Ainda não houve teste com credenciais reais.
- **Histórico:** cada passo está registrado no repositório (`historico/CHANGELOG.md`).

## O que falta
1. **Credenciais no n8n:** xAI (Grok), Meta (token de sistema) e Hotmart. A do Netlify é opcional.
2. **IDs no nó de Configuração:**
   - pixel, conta de anúncios e página do Facebook;
   - dados de DSA (pagador e beneficiário);
   - produto e checkout da Hotmart;
   - site do Netlify ou domínio próprio.
3. **Primeiro teste real:** com a chave da xAI e o token da Meta já dá para testar o Radar e o Headline Killer.
4. **Aprovações a cada rodada:** a copy, o preço e os criativos, aprovados pelo relatório que o fluxo gera.

Repositório: https://github.com/italoxdemelo/direct-response
