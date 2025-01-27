import { createApp } from "vue";
import type { App } from "vue";
import MyApp from "./App.vue";
import router from "./router";

import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import "./style.css";

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

let app: App = createApp(MyApp).use(router).use(Toast).use(pinia);
app.mount("#app");
