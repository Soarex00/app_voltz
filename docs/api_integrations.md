# API Integrations

## 1. Objetivo

Este documento descreve como o sistema deve lidar com integrações externas.

O projeto depende de dados de esports vindos de providers externos.

## 2. Regra principal

O frontend nunca deve chamar APIs externas diretamente.

Fluxo obrigatório:

```txt
API externa
  ↓
Provider
  ↓
Normalização
  ↓
Banco/Cache
  ↓
Backend interno
  ↓
Frontend
```

## 3. Providers candidatos

## 3.1 GRID

Uso esperado:

- dados oficiais de esports;
- partidas ao vivo;
- estatísticas em tempo real;
- League of Legends;
- Valorant;
- possivelmente outros jogos.

Vantagens:

- dados mais oficiais;
- foco profissional;
- boa fonte para tempo real.

Desvantagens:

- preço comercial pode não ser público;
- pode exigir aprovação;
- Open Access pode depender do perfil do projeto.

Uso no MVP:

- avaliar Open Access;
- ideal para validar dados ao vivo se o acesso for aprovado.

## 3.2 PandaScore

Uso esperado:

- calendário;
- partidas;
- times;
- campeonatos;
- resultados;
- múltiplos jogos.

Vantagens:

- cobre vários esports;
- boa opção para MVP;
- documentação normalmente mais acessível;
- pode ter plano gratuito limitado.

Desvantagens:

- limites de plano;
- dados podem não ser tão oficiais quanto GRID;
- tempo real pode depender do plano.

Uso no MVP:

- forte candidato para primeira integração;
- bom para validar calendário e partidas.

## 3.3 APIs não oficiais

Uso esperado:

- protótipo;
- validação interna;
- estudos.

Vantagens:

- podem ser gratuitas;
- podem permitir avanço rápido.

Riscos:

- podem quebrar sem aviso;
- podem violar termos;
- podem mudar formato;
- não devem ser base de produto comercial.

Uso no MVP:

- apenas se necessário;
- sempre documentar risco;
- nunca acoplar o sistema ao formato não oficial.

## 4. Regras para qualquer integração

Toda integração deve:

- ficar isolada em provider próprio;
- possuir normalização;
- tratar erros;
- respeitar rate limit;
- salvar logs de sync;
- salvar provider e external_id;
- salvar raw_data quando possível.

## 4.1 Primeiro spike de integração

O primeiro teste real de integração deve ser feito apenas com League of Legends.

Objetivo do spike:

- entender como GRID ou outra API disponível representa LoL;
- coletar payloads reais de campeonatos, partidas, times e placar ao vivo;
- comparar o payload externo com o modelo interno atual;
- validar se `matches`, `match_game_details` e `live_match_states` cobrem o caso real;
- registrar lacunas antes de expandir para CS2 e Valorant.

Durante o spike, não criar acoplamento direto entre o backend e o formato externo.

O payload bruto deve ser salvo em `raw_data` ou em amostras controladas de desenvolvimento para análise.

Mudanças no banco só devem ser feitas depois de comparar os dados reais com o modelo atual.

## 5. Tratamento de erros

Se uma API externa falhar:

- não quebrar o frontend;
- registrar erro em ProviderSyncLog;
- manter dados antigos disponíveis;
- tentar novamente em job futuro;
- exibir estado amigável ao usuário, se necessário.

## 6. Rate limit

Toda API externa possui limites.

Regras:

- evitar chamadas por usuário;
- centralizar chamadas no backend;
- usar cache;
- usar jobs agendados;
- reduzir frequência fora de partidas ao vivo.

## 7. Normalização

Cada provider deve transformar dados externos em entidades internas.

Exemplo:

```txt
PandaScoreMatch → Match
GridMatch → Match
VlrMatch → Match
```

O restante do sistema nunca deve precisar saber de qual provider veio o dado para funcionar.

## 8. Dados ao vivo

Dados ao vivo devem ser tratados com cuidado.

Estratégia inicial:

```txt
job/polling → provider → cache/banco → frontend
```

Frequência inicial:

- 30 segundos para partidas ao vivo;
- 1 minuto se houver limitação de API;
- 15 minutos para partidas próximas;
- 6 horas para partidas futuras.

## 9. Endpoints internos

O backend deve expor endpoints próprios, por exemplo:

```txt
GET /games
GET /tournaments
GET /tournaments/:id
GET /matches
GET /matches/live
GET /matches/:id
GET /teams
GET /teams/:id
GET /players/:id
POST /favorites
DELETE /favorites/:id
```

O app mobile consome apenas esses endpoints.

Endpoints iniciais implementados:

```txt
GET /health
GET /games
GET /games/:slug
GET /matches
GET /matches?status=scheduled&gameSlug=valorant
GET /matches/live
```

## 10. Segurança

Chaves de API externas nunca devem ficar no frontend.

As chaves devem estar em variáveis de ambiente no backend.

Exemplo:

```txt
GRID_API_KEY
PANDASCORE_API_KEY
```

## 11. Regra obrigatória

Toda nova integração externa deve ser documentada neste arquivo e em `providers.md`.
