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

Resultado:

```txt
HTTP 403
{"error":"Token is missing"}
```

Conclusao:

- PandaScore exige token mesmo para leitura simples.
- E candidato forte para o primeiro provider real, mas precisamos criar uma chave gratuita.
- Quando houver token, testar primeiro:

```txt
GET /lol/matches
GET /lol/series
GET /lol/tournaments
GET /lol/teams
GET /lol/players
```

O token deve ficar somente no backend, em variavel de ambiente.

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

Com os dados testados ate agora, nao ha motivo para alterar o schema principal.

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

## 4. Possiveis lacunas futuras

So criar estas tabelas se o payload real do provider justificar:

```txt
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

Criar uma chave gratuita do PandaScore e testar payload real de LoL.

Com o token, implementar um script temporario de spike que:

- chama endpoints de LoL;
- salva amostras JSON em pasta ignorada pelo Git;
- gera resumo dos campos encontrados;
- compara com o schema Prisma atual;
- nao altera banco automaticamente.

Variavel sugerida:

```txt
PANDASCORE_API_TOKEN
```
