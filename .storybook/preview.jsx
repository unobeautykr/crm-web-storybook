/** @type { import('@storybook/react').Preview } */

import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as StyledComponentThemeProvider } from 'styled-components';
import { theme } from '~/themes/theme';
import { ApiProvider } from '~/components/providers/ApiProvider';
import { SnackbarProvider } from '~/components/providers/SnackbarProvider';
import { DataTableProvider } from '~/components/providers/DatatableProvider';
import { ImperativeModalProvider } from '~/components/providers/ImperativeModalProvider';

const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: (a, b) =>
      a.title === b.title
        ? 0
        : a.id.localeCompare(b.id, undefined, { numeric: true }),
  },
};

const withMuiTheme = (Story) => (
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <StyledComponentThemeProvider theme={theme}>
        <ApiProvider>
          <SnackbarProvider>
            <ImperativeModalProvider>
              <DataTableProvider>
                <Story />
              </DataTableProvider>
            </ImperativeModalProvider>
          </SnackbarProvider>
        </ApiProvider>
      </StyledComponentThemeProvider>
    </ThemeProvider>
  </StyledEngineProvider>
);

const preview = {
  decorators: [withMuiTheme],
  parameters: parameters,
};

export default preview;
