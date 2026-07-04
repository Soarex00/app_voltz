# Backend

## 1. Decisao tecnica inicial

O backend do MVP usa:

- Node.js com TypeScript;
- Fastify para API HTTP;
- Prisma como ORM;
- PostgreSQL como banco principal;
- Zod para validacao de entrada e ambiente;
- Docker Compose para banco local.

Essa stack foi escolhida para manter o backend simples, modular e preparado para o app mobile consumir apenas a API interna.

## 2. Estrutura atual

```txt
apps/api/
  prisma/
    schema.prisma
    seed.ts
  src/
    modules/
      games/
      matches/
    shared/
      config/
      database/
      errors/
      http/
      utils/
```

Novos dominios devem seguir o mesmo padrao:

```txt
module.repository.ts
module.service.ts
module.routes.ts
module.presenter.ts quando a resposta publica precisar esconder detalhes internos
```

## 3. Comandos principais

Instalar dependencias:

```txt
npm install
```

Subir PostgreSQL local:

```txt
docker compose up -d postgres
```

Gerar Prisma Client:

```txt
npm run prisma:generate
```

Criar migration local:

```txt
npm run prisma:migrate
```

Popular dados iniciais:

```txt
npm run prisma:seed
```

Rodar API em desenvolvimento:

```txt
npm run dev:api
```

Validar TypeScript:

```txt
npm run typecheck
```

Build:

```txt
npm run build
```

## 4. Variaveis de ambiente

Usar `.env.example` como referencia.

Variaveis atuais:

```txt
DATABASE_URL
NODE_ENV
API_PORT
API_HOST
APP_ORIGIN
```

Chaves de providers externos devem ser adicionadas apenas no backend.

## 5. Endpoints iniciais

```txt
GET /health
GET /games
GET /games/:slug
GET /matches
GET /matches?status=scheduled&gameSlug=valorant
GET /matches/live
```

Os status publicos da API devem seguir os valores documentados em minusculo:

```txt
scheduled
live
finished
postponed
canceled
```

## 6. Padrao de erro

Toda falha da API deve retornar:

```txt
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Mensagem legivel",
    "details": {},
    "requestId": "req-id"
  }
}
```

Erros esperados devem usar `AppError`.

Validacoes devem usar Zod.

Erros inesperados nao devem vazar detalhes sensiveis em producao.

## 7. Regras de engenharia

- Rotas nao devem acessar Prisma diretamente.
- Regras de negocio ficam em services.
- Acesso ao banco fica em repositories.
- Presenters devem proteger a resposta publica contra detalhes internos.
- Providers externos nao devem ser chamados por rotas de usuario.
- Qualquer novo endpoint, tabela, provider ou job precisa atualizar a documentacao correspondente.
