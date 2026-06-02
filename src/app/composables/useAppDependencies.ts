import { inject } from "vue";

import { appDependenciesKey } from "@/app/dependencies/appDependenciesKey";

export function useAppDependencies() {
  const dependencies = inject(appDependenciesKey);

  if (!dependencies) {
    throw new Error("App dependencies were not provided.");
  }

  return dependencies;
}
