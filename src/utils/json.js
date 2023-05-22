export const mustParse = (obj) => {
  try {
    return JSON.parse(obj);
  } catch (e) {
    return obj;
  }
};
