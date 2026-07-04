# Architecture

## 1. Visão geral do projeto

Este projeto é uma plataforma de acompanhamento de esports inspirada na HLTV, porém com foco multijogos.

O objetivo é centralizar informações de campeonatos, partidas, times, jogadores, resultados, calendário e dados ao vivo em uma única experiência.

## 2. Jogos iniciais do MVP

A primeira versão do produto será focada em:

- League of Legends
- Counter-Strike 2
- Valorant

Novos jogos devem poder ser adicionados futuramente sem necessidade de reescrever a arquitetura principal.

## 3. Princípio arquitetural principal

O frontend nunca deve consumir APIs externas diretamente.

Fluxo obrigatório:

```txt
API externa
  ↓
Provider / Adapter
  ↓
Normalização
  ↓
Banco de dados / Cache
  ↓
Backend API
  ↓
Frontend
```

O frontend deve consumir apenas a API interna do projeto.

## 4. Objetivo da arquitetura

A arquitetura deve permitir:

- adicionar novos jogos com baixo impacto;
- trocar ou adicionar novos providers;
- centralizar dados de várias fontes;
- normalizar informações externas;
- evitar dependência direta de APIs terceiras;
- suportar dados em tempo real;
- preservar organização para crescimento futuro.

## 5. Estilo arquitetural

O projeto deve seguir uma arquitetura modular, com separação clara entre:

- interface;
- regras de negócio;
- integração externa;
- persistência;
- jobs;
- cache;
- normalização;
- autenticação.

A IA deve evitar criar funcionalidades espalhadas sem módulo claro.

## 6. Módulos principais

Estrutura lógica esperada:

```txt
src/
  modules/
    games/
    tournaments/
    matches/
    teams/
    players/
    users/
    favorites/
    notifications/
    live-data/

  providers/
    grid/
    pandascore/
    hltv/
    vlr/

  jobs/
    sync-matches/
    sync-tournaments/
    sync-teams/
    sync-live-matches/

  cache/
    live-matches/
    tournaments/
    teams/

  shared/
    database/
    http/
    errors/
    utils/
    types/
```

## 7. Responsabilidades dos módulos

### games

Responsável por representar cada jogo suportado pela plataforma.

Exemplos:

- League of Legends
- Counter-Strike 2
- Valorant

### tournaments

Responsável por campeonatos, ligas, temporadas e eventos.

Exemplos:

- CBLOL
- Worlds
- MSI
- ESL Pro League
- Valorant Champions Tour

### matches

Responsável por partidas, placares, status, horários e detalhes.

### teams

Responsável por times, escudos, região e informações básicas.

### players

Responsável por jogadores, nickname, função, país e time atual.

### providers

Responsável por consumir APIs externas e transformar dados externos em modelos internos.

### live-data

Responsável por dados ao vivo, como placar em andamento, status e estatísticas em tempo real.

### favorites

Responsável por permitir que usuários sigam jogos, times, campeonatos e jogadores.

### notifications

Responsável por alertas futuros, como início de partida, resultado e atualização importante.

## 8. Regra sobre dependência de providers

Nenhum módulo do sistema deve depender diretamente da estrutura original de uma API externa.

Errado:

```txt
Frontend → PandaScore
```

Errado:

```txt
matches module → formato específico da GRID
```

Correto:

```txt
Provider GRID → Normaliza → Match interno
Provider PandaScore → Normaliza → Match interno
matches module → Match interno
```

## 9. Banco como fonte principal

O banco de dados deve ser a principal fonte de leitura para o frontend.

Mesmo quando os dados vêm de uma API externa, eles devem ser processados, normalizados e salvos antes de serem exibidos.

Exceções só devem existir se forem claramente documentadas.

## 10. Dados brutos

Sempre que possível, salvar o payload bruto da API externa em um campo `raw_data`.

Objetivo:

- facilitar debug;
- permitir auditoria;
- comparar mudanças de provider;
- reconstruir dados caso a normalização precise mudar.

## 11. Tempo real

A primeira versão pode usar polling.

Estratégia inicial:

- partidas ao vivo: atualizar a cada 30 ou 60 segundos;
- partidas próximas: atualizar a cada 15 minutos;
- partidas futuras: atualizar a cada 6 horas;
- partidas finalizadas: atualizar uma última vez e congelar.

WebSocket pode ser adicionado futuramente, mas não deve ser obrigatório no MVP.

## 12. Escalabilidade

A arquitetura deve permitir crescimento gradual.

Prioridades:

1. MVP simples e funcional.
2. Dados reais via provider.
3. Cache e jobs bem organizados.
4. Tempo real com polling.
5. WebSocket ou push quando necessário.
6. Novos jogos e providers.

## 13. Decisões iniciais

- Começar pequeno.
- Não tentar suportar todos os jogos no MVP.
- Não criar dependência direta entre frontend e providers.
- Não criar regra de negócio em tela.
- Não duplicar lógica entre jogos.
- Normalizar todos os dados externos.
- Documentar toda mudança arquitetural.

## 14. Critério de qualidade

Uma funcionalidade só é considerada finalizada quando:

- respeita a arquitetura;
- não quebra os módulos existentes;
- não adiciona acoplamento desnecessário;
- atualiza a documentação afetada;
- possui nomes claros;
- evita duplicação;
- mantém o frontend simples.

## Foco do Produto

O produto será desenvolvido com foco principal em mobile.

A experiência mobile tem prioridade sobre desktop.

O usuário deve conseguir acompanhar partidas, campeonatos e favoritos rapidamente pelo celular.

## Prioridades de UX

- Home simples e rápida.
- Partidas ao vivo no topo.
- Navegação por abas.
- Cards compactos.
- Favoritos acessíveis.
- Menos texto, mais informação direta.
- Layout otimizado para toque.
- Performance em redes móveis.

## Estratégia de plataforma

Primeira versão:
- Web responsivo mobile-first.

Possível evolução:
- App mobile com React Native ou Expo.

## Regra para IA

Toda tela criada deve ser pensada primeiro para celular.

Desktop é adaptação posterior, não prioridade inicial.