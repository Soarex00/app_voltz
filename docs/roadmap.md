# Roadmap

## 1. Objetivo do roadmap

Organizar o desenvolvimento do produto em fases.

A prioridade é construir um MVP validável com usuários reais antes de expandir funcionalidades avançadas.

## 2. Fase 0 — Fundação do projeto

Objetivo:

Criar base sólida para a IA não se perder durante o desenvolvimento.

Entregas:

- estrutura inicial do projeto;
- pasta docs;
- architecture.md;
- business_rules.md;
- data_model.md;
- api_integrations.md;
- providers.md;
- jobs_and_cache.md;
- codex_rules.md;
- roadmap.md;
- estrutura modular inicial;
- configuração de ambiente;
- backend Fastify inicial;
- schema Prisma inicial;
- Docker Compose para PostgreSQL;
- seed dos jogos do MVP;
- padrão de commits e organização.

Critério de conclusão:

- documentação inicial criada;
- projeto inicial roda localmente;
- arquitetura base definida.

## 3. Fase 1 — MVP visual sem dados externos

Objetivo:

Criar interface e fluxo principal usando dados mockados.

Entregas:

- home;
- lista de jogos;
- lista de partidas;
- partidas ao vivo mockadas;
- próximas partidas mockadas;
- resultados recentes mockados;
- página de detalhes da partida;
- página de time simples;
- navegação por abas;
- layout otimizado para app mobile.

Critério de conclusão:

- usuário consegue navegar pelo produto;
- proposta de valor fica clara;
- ainda sem dependência de API externa.

## 4. Fase 2 — Banco e backend interno

Objetivo:

Criar backend e banco como fonte principal de dados.

Entregas:

- tabelas principais;
- API interna;
- endpoints de jogos;
- endpoints de campeonatos;
- endpoints de partidas;
- endpoints de times;
- endpoints de favoritos;
- persistência dos dados mockados ou seed.

Critério de conclusão:

- frontend consome backend interno;
- banco possui entidades principais;
- nenhum dado vem direto de API externa no frontend.

## 5. Fase 3 — Primeiro provider real

Objetivo:

Integrar primeira fonte externa começando por League of Legends.

Candidatos:

- GRID Open Access para LoL;
- PandaScore para LoL;
- outra fonte viável para MVP.

Entregas:

- spike de payload real de LoL;
- documentação das respostas externas analisadas;
- provider client;
- mapper;
- sync de campeonatos;
- sync de partidas;
- sync de times;
- logs de sincronização;
- armazenamento de raw_data.

Critério de conclusão:

- dados reais aparecem no sistema;
- provider não vaza formato externo para o restante da aplicação;
- documentação atualizada.

## 6. Fase 4 — Jobs e atualização automática

Objetivo:

Manter dados atualizados sem ações manuais.

Entregas:

- job de partidas futuras;
- job de partidas ao vivo;
- job de resultados;
- controle de frequência;
- tratamento de erro;
- ProviderSyncLog.

Critério de conclusão:

- dados atualizam automaticamente;
- falhas são registradas;
- sistema não depende de atualização manual.

## 7. Fase 5 — Favoritos e personalização

Objetivo:

Permitir que o usuário personalize a experiência.

Entregas:

- login;
- favoritar jogos;
- favoritar times;
- home baseada em favoritos;
- filtros por jogo;
- filtros por time.

Critério de conclusão:

- usuário vê conteúdo relevante para seus favoritos.

## 8. Fase 6 — Tempo real inicial

Objetivo:

Criar experiência de acompanhamento ao vivo.

Entregas:

- status live;
- placar ao vivo;
- atualização por polling;
- página da partida atualizando;
- cache curto.

Critério de conclusão:

- usuário consegue acompanhar partida ao vivo sem recarregar manualmente.

## 9. Fase 7 — Validação com usuários reais

Objetivo:

Colocar MVP nas mãos de usuários reais.

Entregas:

- deploy;
- analytics básico;
- formulário de feedback;
- monitoramento simples;
- correção de bugs principais.

Critério de conclusão:

- usuários reais testaram;
- feedback foi coletado;
- próximos passos definidos com base em uso real.

## 10. Fase 8 — Expansão

Objetivo:

Melhorar produto após validação.

Possíveis entregas:

- mais jogos;
- mais providers;
- notificações;
- WebSocket;
- estatísticas avançadas;
- notícias;
- rankings;
- integração com transmissões.

## 11. Regra

Não avançar para complexidade alta antes de validar o básico.

Prioridade:

```txt
funcionar → validar → melhorar → escalar
```
