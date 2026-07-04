# Codex Rules

## Regra app mobile

Este projeto será um app mobile, não um frontend web.

Antes de criar qualquer tela, componente ou fluxo, priorizar:

- usabilidade no celular;
- toque com dedo;
- cards compactos;
- navegação simples;
- performance;
- carregamento rápido;
- layout para app mobile.

Nunca criar uma tela pensando em web ou desktop como plataforma principal.

## 1. Papel da IA

A IA deve atuar como arquiteto técnico e desenvolvedor.

O objetivo não é apenas escrever código rápido.

O objetivo é preservar arquitetura, organização e consistência do projeto.

## 2. Regra obrigatória antes de qualquer tarefa

Antes de implementar qualquer alteração, ler os documentos em `/docs`.

Arquivos principais:

- architecture.md
- business_rules.md
- backend.md
- mobile.md
- data_model.md
- api_integrations.md
- providers.md
- jobs_and_cache.md
- roadmap.md
- codex_rules.md

## 3. Documentação é fonte oficial

A documentação tem prioridade sobre decisões improvisadas.

Se o código e a documentação divergirem, a IA deve:

1. identificar a divergência;
2. corrigir o código ou a documentação;
3. explicar o ajuste.

## 4. Regra de atualização da documentação

Sempre atualizar documentação quando a tarefa alterar:

- arquitetura;
- fluxo;
- regra de negócio;
- tabela;
- entidade;
- provider;
- endpoint;
- job;
- cache;
- integração externa;
- dependência técnica.

Uma tarefa não está finalizada se a documentação estiver desatualizada.

## 5. Regras proibidas

Nunca fazer:

- consumir API externa diretamente no frontend;
- colocar chave de API no frontend;
- criar regra de negócio dentro de componente visual;
- criar tabela sem atualizar data_model.md;
- criar provider sem atualizar providers.md;
- criar integração sem atualizar api_integrations.md;
- criar job sem atualizar jobs_and_cache.md;
- alterar fluxo sem atualizar architecture.md;
- duplicar lógica sem necessidade;
- criar arquivos gigantes;
- misturar responsabilidades.

## 6. Regras obrigatórias

Sempre fazer:

- respeitar arquitetura modular;
- criar funções pequenas;
- separar responsabilidades;
- usar providers para APIs externas;
- normalizar dados externos;
- salvar external_id e provider;
- salvar raw_data quando útil;
- tratar erros;
- respeitar rate limits;
- reaproveitar código existente;
- atualizar documentação afetada.

## 7. Fluxo obrigatório de APIs externas

Sempre seguir:

```txt
API externa
  ↓
Provider
  ↓
Mapper/Normalização
  ↓
Banco/Cache
  ↓
Backend API
  ↓
Frontend
```

O frontend nunca deve conhecer o provider externo.

## 8. Padrão para providers

Todo provider deve ter:

```txt
client
mapper
provider
types
```

Exemplo:

```txt
src/providers/pandascore/
  pandascore.client.ts
  pandascore.mapper.ts
  pandascore.provider.ts
  pandascore.types.ts
```

## 9. Checklist antes de finalizar tarefa

Antes de finalizar, verificar:

- código compila;
- não há chamada externa no frontend;
- documentação afetada foi atualizada;
- não há lógica duplicada;
- nomes estão claros;
- arquitetura foi respeitada;
- regras de negócio não estão em componentes visuais;
- novos endpoints/tabelas/providers/jobs foram documentados.

## 10. Quando houver dúvida

Se houver mais de uma solução, a IA deve:

1. explicar as opções;
2. mostrar trade-offs;
3. recomendar a solução mais sustentável;
4. implementar apenas após escolher a abordagem mais coerente.

## 11. Estilo de código

Priorizar:

- clareza;
- organização;
- baixo acoplamento;
- alta coesão;
- nomes descritivos;
- módulos pequenos;
- componentes simples.

Evitar:

- abstração desnecessária;
- overengineering;
- gambiarra;
- duplicação;
- dependência direta de provider externo.

## 12. Regra de evolução

O projeto deve crescer sem reescrever tudo.

Sempre pensar:

```txt
Se amanhã adicionarmos Dota 2, Rainbow Six ou Rocket League,
essa implementação ainda faria sentido?
```

Se a resposta for não, repensar a solução.

## 13. Objetivo final

Construir uma base sólida para uma plataforma de esports multijogos que possa começar pequena, validar com usuários reais e crescer com segurança.
