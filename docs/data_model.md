# Data Model

## 1. Visão geral

Este documento descreve o modelo de dados interno do sistema.

O banco deve armazenar dados normalizados, independentemente do provider externo usado.

## 2. Princípios

- Não depender diretamente do formato de APIs externas.
- Sempre salvar `external_id` quando vier de provider.
- Sempre salvar `provider` quando o dado for externo.
- Salvar `raw_data` quando útil para debug.
- Evitar duplicação de entidades.
- Usar slugs para URLs amigáveis.

## 2.1 Implementação atual

O modelo foi implementado inicialmente com Prisma e PostgreSQL em:

```txt
apps/api/prisma/schema.prisma
```

Os valores públicos da API devem continuar seguindo a documentação em minúsculo.

Enums internos do banco podem usar convenções técnicas próprias, desde que presenters ou mappers não vazem esses detalhes para o app mobile.

## 3. Game

Representa um jogo suportado pela plataforma.

Exemplos:

- League of Legends
- Counter-Strike 2
- Valorant

Campos:

```txt
id
name
slug
image_url
is_active
created_at
updated_at
```

## 4. Tournament

Representa campeonato, liga, copa ou evento.

Campos:

```txt
id
external_id
provider
game_id
name
slug
region
season
start_date
end_date
status
image_url
raw_data
created_at
updated_at
```

Status:

```txt
upcoming
ongoing
finished
canceled
```

Relacionamentos:

```txt
Tournament pertence a Game
Tournament possui muitas Matches
Tournament pode possuir muitos Teams
```

## 5. Team

Representa um time dentro de um jogo.

Campos:

```txt
id
external_id
provider
game_id
name
acronym
slug
logo_url
region
country
raw_data
created_at
updated_at
```

Relacionamentos:

```txt
Team pertence a Game
Team possui muitos Players
Team participa de muitas Matches
```

## 6. Player

Representa jogador profissional.

Campos:

```txt
id
external_id
provider
game_id
team_id
nickname
real_name
role
country
image_url
raw_data
created_at
updated_at
```

Relacionamentos:

```txt
Player pertence a Game
Player pode pertencer a Team
```

## 7. Match

Representa uma partida.

Campos:

```txt
id
external_id
provider
game_id
tournament_id
team_a_id
team_b_id
start_time
status
score_a
score_b
winner_team_id
stream_url
raw_data
created_at
updated_at
```

Status:

```txt
scheduled
live
finished
postponed
canceled
```

Relacionamentos:

```txt
Match pertence a Game
Match pertence a Tournament
Match possui Team A
Match possui Team B
Match pode possuir vencedor
```

## 8. MatchGameDetail

Representa detalhes específicos dentro de uma partida.

Útil para jogos com mapas, rounds ou games.

Exemplos:

- CS2: mapa 1, mapa 2, mapa 3.
- LoL: jogo 1, jogo 2, jogo 3.
- Valorant: mapa 1, mapa 2, mapa 3.

Campos:

```txt
id
match_id
order
map_name
status
score_a
score_b
winner_team_id
started_at
finished_at
raw_data
created_at
updated_at
```

## 9. LiveMatchState

Representa estado atual de uma partida ao vivo.

Campos:

```txt
id
match_id
status
current_phase
current_map
current_score_a
current_score_b
last_provider_update
raw_data
created_at
updated_at
```

Este dado pode ser atualizado com frequência.

## 10. User

Representa usuário da plataforma.

Campos:

```txt
id
name
email
avatar_url
created_at
updated_at
```

Caso use Supabase/Auth.js/Clerk, esta tabela pode complementar a tabela de autenticação.

## 11. UserFavorite

Representa favoritos do usuário.

Campos:

```txt
id
user_id
favorite_type
reference_id
created_at
```

Tipos possíveis:

```txt
game
team
tournament
player
```

## 12. NotificationPreference

Representa preferências de notificação.

Campos:

```txt
id
user_id
type
enabled
created_at
updated_at
```

Tipos possíveis:

```txt
match_start
match_finished
team_result
tournament_start
```

## 13. ProviderSyncLog

Registra execuções de sincronização com APIs externas.

Campos:

```txt
id
provider
job_name
status
started_at
finished_at
error_message
metadata
created_at
```

Status:

```txt
success
failed
partial
running
```

## 14. ProviderEntityMap

Mapeia entidades externas para entidades internas.

Campos:

```txt
id
provider
external_id
entity_type
internal_id
created_at
updated_at
```

Tipos:

```txt
game
tournament
team
player
match
```

## 15. Observações importantes

O modelo deve aceitar crescimento.

Não criar tabelas muito específicas de um único jogo no MVP, a menos que seja inevitável.

Se uma estatística for específica de LoL, CS2 ou Valorant, avaliar se deve ficar em:

- `raw_data`;
- tabela genérica;
- tabela específica documentada.

## 16. Regra obrigatória

Toda nova tabela, campo importante ou relacionamento deve ser documentado neste arquivo antes da tarefa ser considerada finalizada.
