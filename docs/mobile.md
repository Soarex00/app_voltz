# Mobile App

## 1. Objetivo

O app mobile e a interface principal do produto.

O MVP usa Expo (SDK 54) para acelerar validacao no celular.

## 2. Estrutura atual

```txt
App.tsx                  # bridge na raiz do monorepo (ver secao 7)
apps/mobile/
  index.js               # entry local: registerRootComponent(App)
  App.tsx                # tela real do app
  metro.config.js        # config de monorepo (watchFolders + nodeModulesPaths)
  app.json
  package.json           # "main": "index.js"
  tsconfig.json
  src/
    env.d.ts
```

## 3. Comandos

Rodar API:

```txt
npm run dev:api
```

Rodar app:

```txt
npm run dev:mobile
```

Se estiver testando em celular fisico, configurar a API com o IP da maquina.

O Expo le o `.env` a partir da pasta do app, entao a variavel fica em
`apps/mobile/.env` (nao na raiz):

```txt
EXPO_PUBLIC_API_URL=http://SEU_IP_LOCAL:3333
```

O celular precisa estar na mesma rede da maquina que roda a API. O default
(sem `.env`) e `http://127.0.0.1:3333`, que so funciona em emulador/simulador.

## 4. Regra de dados

O app nunca chama PandaScore, GRID ou qualquer provider externo diretamente.

Fluxo correto:

```txt
Provider externo
  ↓
Backend interno
  ↓
Payload filtrado
  ↓
App mobile
```

Payload bruto fica no backend/banco em `raw_data`.

O app recebe apenas campos prontos para exibicao.

## 5. Tela inicial atual

A tela inicial lista partidas de LoL retornadas pela API interna:

```txt
GET /spikes/lol/matches/today
```

O endpoint aceita data opcional:

```txt
GET /spikes/lol/matches/today?date=2026-07-04
```

Essa rota ainda e um spike de desenvolvimento para visualizar os dados filtrados da PandaScore antes do sync persistente.

## 6. Estado de execucao (validado no device)

O app foi executado de ponta a ponta no Expo Go (iOS, SDK 54):

- API interna respondendo em `http://IP_LOCAL:3333`;
- rota `/spikes/lol/matches/today` retornando dados reais da PandaScore;
- bundle compilando e a tela listando as partidas.

Comando padrao de execucao (na raiz do monorepo):

```txt
npm run dev:api      # sobe a API
npm run dev:mobile   # sobe o Metro/Expo
```

## 7. Notas de setup para o Codex

Ajustes feitos para o app rodar num monorepo com npm workspaces (node_modules
hoisted para a raiz). Ler antes de mexer na inicializacao do mobile:

- **SDK 54**: o projeto foi atualizado de Expo SDK 53 para 54 para bater com a
  versao atual do Expo Go (`react 19.1`, `react-native 0.81`). Alinhar deps
  sempre com `npx expo install --fix`, nunca fixar versoes na mao.

- **Entry local (`apps/mobile/index.js`)**: a entry padrao `expo/AppEntry` faz
  `import "../../App"`. Com o node_modules hoisted, isso resolve para a raiz do
  repositorio, nao para `apps/mobile`. Por isso `package.json` usa
  `"main": "index.js"`, que registra o App localmente via `registerRootComponent`.

- **`apps/mobile/metro.config.js`**: obrigatorio no monorepo. Sem ele o Metro so
  observa `apps/mobile` e nao resolve nem os pacotes hoisted na raiz nem o bridge.
  Configura `watchFolders` (raiz do monorepo) e `nodeModulesPaths`.

- **Bridge `App.tsx` na raiz do repositorio**: reexporta `apps/mobile/App`.
  Existe apenas para compatibilidade com clientes do Expo Go que cachearam a URL
  antiga `expo/AppEntry.bundle` (essa entry resolve `../../App` para a raiz).
  Clientes novos usam `index.js` e nao dependem do bridge. Pode ser removido no
  futuro quando nenhum device tiver mais a URL antiga em cache.

- **Cache do Expo Go**: ao trocar a entry ou o SDK, o device pode segurar o
  bundle antigo. Forcar `Reload` (menu de dev) ou limpar cache/reinstalar o
  Expo Go.

- **`tsconfig.json` na raiz**: gerado automaticamente pelo tooling do Expo
  (`extends: expo/tsconfig.base`). Nao afeta o build da API, que usa o proprio
  `apps/api/tsconfig.json`.
