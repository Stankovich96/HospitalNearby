import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import themeFile from './utils/theme';
import App from './App';

import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';

const theme = createMuiTheme(themeFile);

const cache = new InMemoryCache({});

const client = new ApolloClient({
	uri: 'https://europe-west1-hospitalnow-d2f1b.cloudfunctions.net/graphql/',
	cache,
});

ReactDOM.render(
	<ApolloProvider client={client}>
		<ApolloHooksProvider client={client}>
			<MuiThemeProvider theme={theme}>
				<Router>
					<App />
				</Router>
			</MuiThemeProvider>
		</ApolloHooksProvider>
	</ApolloProvider>,
	document.getElementById('root')
);
