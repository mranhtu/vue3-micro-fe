import { registerApplication, start } from "single-spa";
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";
import layout from "./layout.html";

const data = {
  props: {
    baseUrl: process.env.VUE_APP_BASE_API,
  }
}

const loadFns = {
  '@mic/mic-fe-payments': () =>
    import(/* webpackIgnore: true */ 'http://localhost:9005/mic-fe/payments/src/main.ts'),
  '@mic/mic-fe-vessels': () =>
    import(/* webpackIgnore: true */ 'http://localhost:9007/mic-fe/vessels/src/main.ts'),
  '@mic/mic-fe-personal': () =>
    import(/* webpackIgnore: true */ 'http://localhost:9008/mic-fe/personal/src/main.ts'),
  '@mic/mic-fe-category': () =>
    import(/* webpackIgnore: true */ 'http://localhost:9002/mic-fe/category/src/main.ts'),
  '@mic/mic-fe-re-insured': () =>
    import(/* webpackIgnore: true */ 'http://localhost:9009/mic-fe/re-insured/src/main.ts')
};
const routes = constructRoutes(layout, data);
const applications = constructApplications({
  routes,
  loadApp({ name }) {
    return System.import(name).catch(() => {
      const loadFn = loadFns[name];
      return loadFn();
    });
  },
});
const layoutEngine = constructLayoutEngine({ routes, applications });

applications?.forEach(item => {
  registerApplication(item);
});
layoutEngine.activate();
start({urlRerouteOnly: true});
