# Jobs and Cache

## 1. Objetivo

Jobs e cache existem para manter os dados atualizados sem desperdiçar requisições nas APIs externas.

O sistema não deve depender de chamadas feitas diretamente pelo usuário para atualizar dados externos.

## 2. Princípio principal

Usuários não disparam chamadas para providers externos.

Fluxo correto:

```txt
Job agendado
  ↓
Provider externo
  ↓
Normalização
  ↓
Banco/Cache
  ↓
Frontend lê dados internos
```

## 3. Estratégia inicial de atualização

## 3.1 Partidas ao vivo

Frequência:

```txt
30 a 60 segundos
```

Objetivo:

- atualizar placar;
- atualizar status;
- atualizar mapa/game atual;
- atualizar estatísticas básicas.

## 3.2 Partidas próximas

Frequência:

```txt
15 minutos
```

Objetivo:

- detectar mudança de horário;
- detectar alteração de times;
- confirmar status;
- atualizar dados de transmissão.

## 3.3 Partidas futuras

Frequência:

```txt
6 horas
```

Objetivo:

- manter calendário atualizado;
- adicionar novas partidas;
- corrigir informações de campeonato.

## 3.4 Partidas finalizadas

Frequência:

```txt
uma atualização final após encerramento
```

Objetivo:

- confirmar resultado;
- salvar vencedor;
- congelar placar;
- reduzir chamadas futuras.

## 4. Tipos de jobs

## sync-games

Sincroniza lista de jogos suportados.

Frequência:

```txt
manual ou diária
```

## sync-tournaments

Sincroniza campeonatos.

Frequência:

```txt
a cada 6 horas
```

## sync-upcoming-matches

Sincroniza próximas partidas.

Frequência:

```txt
a cada 15 minutos
```

## sync-live-matches

Sincroniza partidas ao vivo.

Frequência:

```txt
a cada 30 ou 60 segundos
```

## sync-finished-matches

Confirma partidas finalizadas.

Frequência:

```txt
a cada 15 minutos
```

## sync-teams

Sincroniza times.

Frequência:

```txt
diária ou sob demanda
```

## sync-players

Sincroniza jogadores.

Frequência:

```txt
diária ou sob demanda
```

## 5. Cache

Cache deve ser usado para reduzir leituras e chamadas externas.

Dados com cache longo:

- lista de jogos;
- times;
- jogadores;
- campeonatos finalizados;
- partidas finalizadas.

Dados com cache médio:

- campeonatos em andamento;
- partidas futuras;
- rankings simples.

Dados com cache curto:

- partidas ao vivo;
- placar;
- estatísticas em tempo real.

## 6. Sugestão de duração de cache

```txt
games: 24 horas
teams: 24 horas
players: 24 horas
tournaments: 6 horas
upcoming matches: 15 minutos
live matches: 30 segundos
finished matches: permanente após confirmação
```

## 7. Banco vs cache

O banco guarda dados persistentes.

O cache guarda dados temporários de alta frequência.

Exemplo:

```txt
Match → banco
LiveMatchState → banco/cache
placar ao vivo → cache curto
```

## 8. Primeira versão sem Redis

O MVP pode começar sem Redis.

Alternativas:

- banco com timestamp `updated_at`;
- cache em memória;
- revalidação simples;
- polling controlado.

Redis pode entrar depois, quando houver necessidade real.

## 9. Controle de rate limit

Cada provider deve respeitar limite de chamadas.

Regras:

- centralizar chamadas em jobs;
- evitar chamadas por usuário;
- usar backoff em falhas;
- reduzir frequência quando não houver partidas ao vivo;
- registrar erros.

## 10. Falhas

Se um job falhar:

- registrar em ProviderSyncLog;
- não apagar dados antigos;
- tentar novamente no próximo ciclo;
- não quebrar frontend.

## 11. Regra obrigatória

Toda nova rotina de atualização deve ser documentada neste arquivo.

Toda mudança de frequência de job deve ser documentada.
