export function setChromeMock(initialState = {}) {
  const state = {
    settings: initialState.settings,
    groups: initialState.groups,
    excludedDomains: initialState.excludedDomains
  };

  const chromeMock = {
    runtime: {
      getURL(path = "") {
        return `chrome-extension://tab-collector/${path}`;
      }
    },
    storage: {
      local: {
        async get(defaults = {}) {
          return {
            ...defaults,
            ...state
          };
        },
        async set(nextState) {
          Object.assign(state, nextState);
        }
      }
    }
  };

  globalThis.chrome = chromeMock;
  return {
    chrome: chromeMock,
    state
  };
}
