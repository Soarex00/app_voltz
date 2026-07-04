# Providers

## 1. Objetivo

Providers são adapters responsáveis por consumir APIs externas e converter dados para o formato interno do sistema.

Eles protegem o restante da aplicação contra mudanças nas APIs externas.

## 2. Regra principal

Nenhum módulo do sistema deve depender diretamente do formato original de uma API externa.

O provider deve receber dados externos e retornar modelos internos.

## 3. Estrutura sugerida

```txt
src/providers/
  grid/
    grid.client.ts
    grid.mapper.ts
    grid.provider.ts
    grid.types.ts

  pandascore/
    pandascore.client.ts
    pandascore.mapper.ts
    pandascore.provider.ts
    pandascore.types.ts

  hltv/
    hltv.client.ts
    hltv.mapper.ts
    hltv.provider.ts
    hltv.types.ts

  vlr/
    vlr.client.ts
    vlr.mapper.ts
    vlr.provider.ts
    vlr.types.ts
```

## 4. Responsabilidades

### client

Responsável por comunicação HTTP com a API externa.

Exemplo:

```txt
grid.client.ts
```

Responsabilidades:

- montar requisições;
- autenticar;
- tratar resposta;
- tratar erro HTTP;
- respeitar timeout.

### mapper

Responsável por converter dados externos para dados internos.

Exemplo:

```txt
grid.mapper.ts
```

Responsabilidades:

- converter ExternalMatch para Match interno;
- converter ExternalTeam para Team interno;
- converter ExternalTournament para Tournament interno.

### provider

Responsável por oferecer métodos padronizados para o restante do sistema.

Exemplo:

```txt
grid.provider.ts
```

Métodos esperados:

```txt
getTournaments()
getUpcomingMatches()
getLiveMatches()
getFinishedMatches()
getTeams()
getPlayers()
```

### types

Responsável por tipos específicos da API externa.

Exemplo:

```txt
grid.types.ts
```

Importante:

Os tipos externos não devem vazar para fora do provider.

## 5. Contrato padrão para partidas

Todo provider que retorna partidas deve normalizar para:

```txt
external_id
provider
game
tournament
team_a
team_b
start_time
status
score_a
score_b
winner_team
raw_data
```

## 6. Contrato padrão para times

```txt
external_id
provider
game
name
acronym
logo_url
region
country
raw_data
```

## 7. Contrato padrão para campeonatos

```txt
external_id
provider
game
name
slug
region
season
start_date
end_date
status
image_url
raw_data
```

## 8. Contrato padrão para jogadores

```txt
external_id
provider
game
team
nickname
real_name
role
country
image_url
raw_data
```

## 9. Fallback entre providers

No futuro, um mesmo dado pode existir em mais de um provider.

Exemplo:

- partida de LoL na GRID;
- mesma partida na PandaScore.

Regra inicial:

- não misturar automaticamente sem estratégia definida;
- usar ProviderEntityMap para mapear equivalências;
- definir provider principal por jogo ou campeonato.

## 10. Provider principal por jogo

Sugestão inicial:

```txt
League of Legends → GRID ou PandaScore
Valorant → GRID ou PandaScore
Counter-Strike 2 → PandaScore ou fonte específica
```

Essa decisão deve ser atualizada conforme os testes reais.

## 11. Logs

Toda sincronização importante deve gerar log.

Usar entidade:

```txt
ProviderSyncLog
```

Registrar:

- provider;
- job;
- status;
- início;
- fim;
- erro;
- metadados.

## 12. Regra obrigatória

Todo novo provider deve:

- ter client;
- ter mapper;
- ter provider;
- ter types;
- documentar métodos disponíveis;
- não vazar tipos externos para o restante do sistema.
