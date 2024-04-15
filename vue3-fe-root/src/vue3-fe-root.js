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
  '@micro/vue3-fe-layout': () =>
    import(/* webpackIgnore: true */ 'http://localhost:9001/micro-fe/layout/src/main.ts')
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
