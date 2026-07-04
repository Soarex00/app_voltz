# Business Rules

## 1. Objetivo do produto

O sistema permite que usuários acompanhem campeonatos de esports de vários jogos em um app mobile.

O foco inicial é ser uma experiência parecida com HLTV, mas multijogos e otimizada para celular.

## 2. Público-alvo

Usuários que acompanham mais de um cenário competitivo e querem consultar rapidamente pelo celular:

- quais partidas estão ao vivo;
- quais partidas acontecerão;
- resultados recentes;
- campeonatos em andamento;
- times participantes;
- jogadores;
- estatísticas básicas.

## 3. Jogos suportados no MVP

O MVP suportará inicialmente:

- League of Legends
- Counter-Strike 2
- Valorant

Novos jogos poderão ser adicionados futuramente.

## 4. Entidades principais do produto

O sistema gira em torno das seguintes entidades:

- jogos;
- campeonatos;
- partidas;
- times;
- jogadores;
- usuários;
- favoritos;
- notificações.

## 5. Regras de jogos

Cada jogo deve possuir:

- nome;
- slug;
- imagem ou ícone;
- status ativo/inativo.

Um jogo inativo não deve aparecer como opção principal para o usuário, mas seus dados históricos podem continuar existindo.

## 6. Regras de campeonatos

Um campeonato pertence a um jogo.

Um campeonato pode possuir:

- nome;
- região;
- temporada;
- data de início;
- data de fim;
- status;
- lista de partidas;
- lista de times.

Status possíveis:

- upcoming;
- ongoing;
- finished;
- canceled.

## 7. Regras de partidas

Uma partida pertence a:

- um jogo;
- um campeonato;
- dois times;
- uma data de início.

Status possíveis:

- scheduled;
- live;
- finished;
- postponed;
- canceled.

## 8. Regras de partidas ao vivo

Partidas ao vivo devem ter prioridade na home.

Uma partida ao vivo pode exibir:

- status;
- placar;
- tempo ou mapa atual;
- estatísticas básicas;
- link para detalhes;
- link externo para transmissão, se existir.

## 9. Regras de partidas futuras

Partidas futuras devem ser ordenadas pela data mais próxima.

O usuário deve conseguir filtrar por:

- jogo;
- campeonato;
- time;
- data.

## 10. Regras de partidas finalizadas

Partidas finalizadas devem preservar o resultado.

Após a confirmação final, o resultado não deve ser alterado sem motivo.

Caso o provider envie correção posterior, o sistema pode atualizar, mas deve manter rastreabilidade quando possível.

## 11. Regras de times

Um time pode participar de vários jogos, mas no MVP pode ser tratado como entidade simples por jogo.

Exemplo:

- Team Liquid em CS2;
- Team Liquid em LoL;
- Team Liquid em Valorant.

No futuro pode existir uma organização acima do time, mas não é obrigatório no MVP.

## 12. Regras de jogadores

Um jogador pertence a um time em determinado jogo.

Campos importantes:

- nickname;
- nome real;
- país;
- função;
- time atual;
- jogo.

## 13. Regras de favoritos

Usuários podem favoritar:

- jogos;
- times;
- campeonatos;
- jogadores.

Favoritos devem influenciar a home.

Prioridade da home:

1. partidas ao vivo dos favoritos;
2. próximas partidas dos favoritos;
3. resultados dos favoritos;
4. outras partidas relevantes.

## 14. Regras de notificações

Notificações futuras podem incluir:

- partida começando;
- partida finalizada;
- time favorito venceu/perdeu;
- campeonato começou;
- nova partida adicionada.

No MVP, notificações podem ser deixadas para fase posterior.

## 15. Regras de feed/home

A home deve priorizar informação útil e rápida.

Ordem sugerida:

1. Partidas ao vivo.
2. Próximas partidas.
3. Resultados recentes.
4. Campeonatos em destaque.
5. Times favoritos.
6. Notícias ou atualizações, se existirem.

## 16. Regras de dados externos

Dados vindos de APIs externas não devem ser exibidos diretamente sem normalização.

Todo dado externo deve passar por:

```txt
provider → normalização → banco/cache → frontend
```

## 17. Regras de fallback

Caso um provider falhe:

- o sistema não deve quebrar;
- dados salvos anteriormente podem continuar sendo exibidos;
- o erro deve ser registrado;
- o usuário não precisa ver erro técnico.

## 18. Regras de qualidade do MVP

O MVP precisa provar que usuários se interessam por uma plataforma multijogos de esports.

O MVP não precisa ter todas as estatísticas avançadas.

Prioridade:

- calendário;
- partidas ao vivo;
- resultados;
- favoritos;
- interface simples;
- dados reais.
