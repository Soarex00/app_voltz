// Bridge para a entry padrao do Expo (expo/AppEntry) em monorepo.
// Com node_modules hoisted, AppEntry.js resolve "../../App" para a raiz do
// repositorio. Este arquivo reexporta o App real de apps/mobile para que
// tanto a entry padrao quanto apps/mobile/index.js funcionem.
export { default } from "./apps/mobile/App";
