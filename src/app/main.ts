import "../../style.css";

import { createPinia } from "pinia";
import { createApp } from "vue";

import { appDependencies } from "@/app";
import App from "@/app/App.vue";
import { appDependenciesKey } from "@/app/dependencies/appDependenciesKey";
import i18n from "@/app/i18n";
import router from "@/app/router";

const app = createApp(App);
const pinia = createPinia();

app.provide(appDependenciesKey, appDependencies);

app.use(router);
app.use(pinia);
app.use(i18n);

app.mount("#app");
