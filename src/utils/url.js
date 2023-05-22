export const buildUrl = (url, params) => {
  const queryParams = Object.assign({}, params);
  for (const key of Object.keys(queryParams)) {
    if (queryParams[key] === undefined) {
      delete queryParams[key];
    }
  }

  const query = new URLSearchParams(queryParams).toString();
  return query ? `${url}?${query}` : url;
};
