import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import themeFile from "./utils/theme";

//Pages
import Home from "./pages/Home";

const theme = createMuiTheme(themeFile);

function App() {
	return (
		<MuiThemeProvider theme={theme}>
			<Router>
				<div className="container">
					<Switch>
						<Route exact path="/" component={Home} />
					</Switch>
				</div>
			</Router>
		</MuiThemeProvider>
	);
}

export default App;
