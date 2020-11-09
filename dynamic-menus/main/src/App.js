import { HashRouter, Route, Switch } from "react-router-dom";

import Navigation from "./Navigation";
import React from "react";
import localRoutes from "./routes";

const routes = [...localRoutes];

const App = () => (
  <HashRouter>
    <div>
      <h1>App 1</h1>
      <Navigation />
      <React.Suspense fallback={<div>Loading...</div>}>
        <Switch>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              component={route.component}
              exact={route.exact}
            />
          ))}
        </Switch>
      </React.Suspense>
    </div>
  </HashRouter>
);

export default App;
