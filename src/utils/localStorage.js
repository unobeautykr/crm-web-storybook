const getDeprecatedConfig = (key) => {
  return JSON.parse(window.localStorage.getItem('uiState'))?.[key];
};

const getLocalStorageItem = (key) => {
  return JSON.parse(window.localStorage.getItem(key));
};

export const getLocalStorage = (key) => {
  return getLocalStorageItem(key) ?? getDeprecatedConfig(key);
};

export const updateLocalStorage = (key, value) => {
  const update = { ...getLocalStorageItem(key), ...value };
  window.localStorage.setItem(key, JSON.stringify(update));
};

export const setLocalStorage = (key, value) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};
