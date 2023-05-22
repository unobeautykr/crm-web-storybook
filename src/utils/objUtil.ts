import equal from "fast-deep-equal";

export const removeEmpty = (obj: any, onlyUndefined: any) => {
  for (const propName in obj) {
    if (onlyUndefined) {
      if (obj[propName] === undefined) {
        delete obj[propName];
      }
    } else {
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
  }
  return obj;
};

export const isEmptyObject = (param: any) => {
  return Object.keys(param).length === 0 && param.constructor === Object;
};

export const filterUndefined = (obj: any) => {
  const ret: any = {};
  Object.keys(obj)
    .filter((key) => obj[key] !== undefined)
    .forEach((key) => (ret[key] = obj[key]));
  return ret;
};

export const stripEmpty = <T extends Record<string, any>>(
  obj: T,
  options?: { emptyArray?: boolean; emptyString?: boolean; null?: boolean }
) => {
  const strippable = (value: unknown) => {
    if (value === undefined) return true;
    if (options?.emptyArray && Array.isArray(value) && value.length === 0)
      return true;
    if (options?.emptyString && value === "") return true;
    if (options?.null && value === null) return true;

    return false;
  };

  const stripped: Partial<T> = {};

  for (const key of Object.keys(obj)) {
    if (!strippable(obj[key])) {
      (stripped as Record<string, any>)[key] = obj[key];
    }
  }

  return stripped;
};

export const stripKeys = (obj: Record<string, any>, keys: string[]) => {
  const copied = Object.assign({}, obj);

  keys.forEach((key) => delete copied[key]);

  return copied;
};

export const deepEqual = (a: any, b: any) => {
  return equal(a, b);
};
