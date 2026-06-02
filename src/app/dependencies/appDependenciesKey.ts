import type { InjectionKey } from "vue";

import type { AppDependencies } from "@/app";

export const appDependenciesKey: InjectionKey<AppDependencies> = Symbol("appDependencies");
