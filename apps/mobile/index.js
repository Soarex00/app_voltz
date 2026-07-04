import { registerRootComponent } from "expo";

import App from "./App";

// Entry local ao app: em monorepo o node_modules e hoisted para a raiz,
// entao a entry padrao "expo/AppEntry" resolveria ../../App para fora do repo.
registerRootComponent(App);
