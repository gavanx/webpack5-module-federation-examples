import React, { useEffect } from "react";
import Loadable from "react-loadable";
import { useStore } from "react-redux";

function loadComponent(scope, module) {
  return async () => {
    // Initializes the share scope. This fills it with known provided modules from this build and all remotes
    await __webpack_init_sharing__("default");
    const container = window[scope]; // or get the container somewhere else
    // Initialize the container, it may provide shared modules
    await container.init(__webpack_share_scopes__.default);
    const factory = await container.get(module);
    const Module = factory();
    return Module;
  };
}

const useDynamicScript = (args) => {
  const [ready, setReady] = React.useState(false);
  const [failed, setFailed] = React.useState(false);

  useEffect(() => {
    if (!args.url) {
      return;
    }

    const element = document.createElement("script");

    element.src = args.url;
    element.type = "text/javascript";
    element.async = true;

    setReady(false);
    setFailed(false);

    element.onload = () => {
      console.log(`Dynamic Script Loaded: ${args.url}`);
      setReady(true);
    };

    element.onerror = () => {
      console.error(`Dynamic Script Error: ${args.url}`);
      setReady(false);
      setFailed(true);
    };

    document.head.appendChild(element);

    return () => {
      console.log(`Dynamic Script Removed: ${args.url}`);
      document.head.removeChild(element);
    };
  }, [args.url]);

  return {
    ready,
    failed,
  };
};

function System(props) {
  const { ready, failed } = useDynamicScript({
    url: props.system && props.system.url,
  });

  if (!props.system) {
    return <h2>Not system specified</h2>;
  }

  if (!ready) {
    return null;
  }

  if (failed) {
    return <h2>Failed to load dynamic script: {props.system.url}</h2>;
  }

  function MyLoadingComponent() {
    return <div>Loading...</div>;
  }
  const LoadableAnotherComponent = Loadable({
    loader: loadComponent(props.system.scope, props.system.module),
    loading: MyLoadingComponent,
  });

  const store = useStore();

  return <LoadableAnotherComponent store={store} />;

  // const Component = React.lazy(
  //   loadComponent(props.system.scope, props.system.module)
  // );

  // return (
  //   <React.Suspense>
  //     <Component />
  //   </React.Suspense>
  // );
}

function Child(props) {
  const {
    location: { state },
  } = props;
  const [system, setSystem] = React.useState(undefined);

  useEffect(() => {
    setSystem(state);
  }, [state]);

  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      }}
    >
      <div style={{ marginTop: "2em" }}>
        <h3>{JSON.stringify(system)}</h3>
        <System system={system} />
      </div>
    </div>
  );
}

export default Child;
