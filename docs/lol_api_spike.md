# LoL API Spike

## 1. Objetivo

Entender como dados de League of Legends chegam de APIs externas antes de alterar o modelo do banco.

Este spike existe para evitar criar tabelas especificas de LoL antes de ver payload real de provider.

## 2. Fontes testadas

## 2.1 PandaScore LoL

Endpoint testado:

```txt
GET https://api.pandascore.co/lol/matches?per_page=1
```

Resultado sem token:

```txt
HTTP 403
{"error":"Token is missing"}
```

Resultado com `PANDASCORE_API_TOKEN`:

```txt
GET /lol/matches
GET /lol/matches/upcoming
GET /lol/matches/running
GET /lol/tournaments
GET /lol/teams
GET /lol/players
```

Todos responderam `200`, exceto `running_matches`, que respondeu `200` com lista vazia no momento do teste.

Conclusoes:

- PandaScore exige token mesmo para leitura simples.
- E candidato forte para o primeiro provider real.
- O payload de LoL tem hierarquia mais detalhada do que nosso modelo inicial:

```txt
league
  -> serie
      -> tournament
          -> match
              -> games
```

O token deve ficar somente no backend, em variavel de ambiente.

### Exemplo de partida

Payload resumido de uma partida futura:

```json
{
  "id": 1524761,
  "name": "Upper bracket quarterfinal 1: BLG vs T1",
  "status": "not_started",
  "match_type": "best_of",
  "number_of_games": 5,
  "begin_at": "2026-07-04T08:00:00Z",
  "league": {
    "id": 300,
    "name": "Mid-Season Invitational",
    "slug": "league-of-legends-mid-invitational"
  },
  "serie": {
    "id": 10676,
    "full_name": "2026",
    "season": null,
    "year": 2026
  },
  "tournament": {
    "id": 21176,
    "name": "Playoffs",
    "slug": "league-of-legends-mid-invitational-2026-playoffs"
  },
  "opponents": [
    {
      "type": "Team",
      "id": 1566,
      "name": "Bilibili Gaming",
      "acronym": "BLG"
    },
    {
      "type": "Team",
      "id": 126061,
      "name": "T1",
      "acronym": "T1"
    }
  ],
  "results": [
    {
      "score": 0,
      "team_id": 1566
    },
    {
      "score": 0,
      "team_id": 126061
    }
  ],
  "games": [
    {
      "id": 280059,
      "position": 1,
      "status": "not_started"
    }
  ]
}
```

Campos importantes observados em partidas:

```txt
id
name
status
match_type
number_of_games
begin_at
scheduled_at
original_scheduled_at
end_at
league
serie
tournament
opponents
results
games
streams_list
live
detailed_stats
forfeit
rescheduled
winner_id
winner_type
```

Status observados:

```txt
canceled
not_started
```

Outros status devem ser mapeados durante a implementacao do provider.

### Exemplo de tournament

O endpoint de torneios retorna tambem `league`, `serie`, `matches`, `teams` e `expected_roster`.

Campos relevantes:

```txt
id
name
type
slug
begin_at
end_at
country
region
tier
league
serie
matches
teams
expected_roster
live_supported
detailed_stats
```

### Exemplo de team

Campos relevantes:

```txt
id
name
location
slug
players
acronym
image_url
dark_mode_image_url
current_videogame
```

### Exemplo de player

Campos relevantes:

```txt
id
name
role
slug
first_name
last_name
nationality
image_url
current_team
current_videogame
active
```

## 2.2 Leaguepedia Cargo API

Endpoints tentados:

```txt
GET https://lol.fandom.com/api.php?action=cargoquery&tables=MatchSchedule...
GET https://lol.fandom.com/api.php?action=cargoquery&tables=Tournaments...
GET https://lol.fandom.com/api.php?action=cargoquery&tables=Teams...
```

Resultado:

```txt
ratelimited
You've exceeded your rate limit.
```

Conclusao:

- Leaguepedia pode ser util como fonte de comparacao, mas nao deve ser a base do MVP.
- O rate limit apareceu mesmo em consultas pequenas.
- Usar apenas para consulta pontual ou comparacao de modelagem.

Tabelas de interesse quando estiver acessivel:

```txt
Tournaments
MatchSchedule
MatchScheduleGame
ScoreboardGames
ScoreboardTeams
ScoreboardPlayers
Teams
Players
TournamentRosters
PicksAndBansS7
```

## 2.3 Riot Data Dragon

Endpoint testado:

```txt
GET https://ddragon.leagueoflegends.com/api/versions.json
GET https://ddragon.leagueoflegends.com/cdn/16.13.1/data/en_US/champion.json
```

Resultado:

- Data Dragon respondeu corretamente.
- Versao testada: `16.13.1`.
- Total de campeoes no payload testado: `173`.

Formato resumido de um campeao:

```json
{
  "id": "Aatrox",
  "key": "266",
  "name": "Aatrox",
  "title": "the Darkin Blade",
  "tags": ["Fighter"],
  "partype": "Blood Well",
  "image": {
    "full": "Aatrox.png",
    "sprite": "champion0.png",
    "group": "champion",
    "x": 0,
    "y": 0,
    "w": 48,
    "h": 48
  },
  "stats": {
    "hp": 650,
    "movespeed": 345,
    "attackrange": 175
  }
}
```

Conclusao:

- Data Dragon e bom para catalogo e assets do jogo.
- Ele nao resolve partidas, campeonatos, times ou jogadores profissionais.
- Pode ser usado depois para enriquecer picks/bans, campeoes e icones.

## 2.4 LoL Esports persisted API

Endpoint testado:

```txt
GET https://esports-api.lolesports.com/persisted/gw/getSchedule?hl=pt-BR
GET https://esports-api.lolesports.com/persisted/gw/getLeagues?hl=pt-BR
```

Resultado:

```txt
HTTP 403
{"message":"Forbidden"}
```

Conclusao:

- A API usada pelo site LoL Esports bloqueia chamada sem header/chave esperada.
- Nao usar como primeira fonte sem documentar o acesso e os riscos.

## 3. Impacto no banco atual

Com o payload real da PandaScore, o nucleo do banco ainda esta correto, mas existe uma decisao importante antes da primeira migration estavel.

O modelo atual ainda faz sentido para o nucleo:

```txt
games
tournaments
teams
players
matches
match_game_details
live_match_states
provider_sync_logs
provider_entity_maps
```

O campo `raw_data` continua essencial para armazenar payload bruto durante o spike.

### Ajuste recomendado antes de integrar PandaScore

A PandaScore diferencia:

```txt
league: competicao macro, exemplo MSI, LCK
serie: temporada/split, exemplo 2026, Spring 2026
tournament: fase ou etapa, exemplo Playoffs, Swiss Stage
```

Nosso modelo atual tem apenas `Tournament`.

Antes de implementar o provider real, avaliar adicionar:

```txt
leagues
series
tournaments
```

Relacionamento recomendado:

```txt
Game 1 -> N League
League 1 -> N Serie
Serie 1 -> N Tournament
Tournament 1 -> N Match
Match 1 -> N MatchGameDetail
```

Isso preserva melhor a estrutura da PandaScore sem misturar campeonato, temporada e fase em uma unica tabela.

Se quisermos manter MVP mais simples, a alternativa e:

```txt
tournaments.provider = "pandascore"
tournaments.external_id = PandaScore tournament.id
tournaments.raw_data guarda league e serie
```

Essa alternativa e mais rapida, mas perde filtros e telas futuras por liga/temporada.

## 4. Possiveis lacunas futuras

So criar estas tabelas se o payload real do provider justificar:

```txt
leagues
series
game_assets
lol_champions
match_game_participants
match_game_picks_bans
match_game_player_stats
```

Essas tabelas seriam necessarias se o app for exibir:

- campeoes escolhidos;
- bans;
- jogadores por game/mapa;
- KDA;
- ouro;
- farm;
- dano;
- estatisticas detalhadas por partida.

Para o MVP inicial, calendario, partidas, times e resultados nao exigem essas tabelas.

## 5. Proximo passo recomendado

Implementar um sync experimental da PandaScore para LoL com cobertura completa.

O objetivo nao e usar o metodo mais rapido.

O objetivo e trazer todos os campeonatos disponiveis e entender a estrutura completa.

O sync deve:

- percorrer todas as paginas de `leagues`, `series`, `tournaments`, `matches`, `teams` e `players` necessarias;
- respeitar rate limit da PandaScore;
- preservar `league -> serie -> tournament -> match -> games`;
- salvar `raw_data`;
- registrar progresso e falhas em ProviderSyncLog quando virar job real;
- preferir cobertura completa e consistencia em vez de velocidade.

Variavel sugerida:

```txt
PANDASCORE_API_TOKEN
```
