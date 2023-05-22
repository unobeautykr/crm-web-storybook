/* eslint-disable */
import common from './common';
import errors from './errors';
import filters from './filters';
import modals from './modals';
import routes from './routes';
import snackbars from './snackbars';
/* eslint-enable */

let result = {};
let translations = [common, errors, filters, modals, routes, snackbars];
translations.forEach((json) =>
  Object.keys(json).forEach((key) => (result[key] = json[key]))
);

export default result;
