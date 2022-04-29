import React from "react";

const ApiConfigs = {
  configurator: "http://127.0.0.1:81",
  urls: {
      get: {},
      post: {
          add_request: 'http://127.0.0.1:81/'
      }
  },
};

export const ApiContext = React.createContext<typeof ApiConfigs>(ApiConfigs);

const ApiConfigsReducer = (
  state: typeof ApiConfigs,
  action: { type: string; payload?: unknown }
) => {
  return state;
};

export const ApiConfigsProvider: React.FC<{}> = ({ children }) => {
  const [state, dispatch] = React.useReducer(ApiConfigsReducer, ApiConfigs);
  return React.createElement(ApiContext.Provider, { value: state }, children);
};
