import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import themeFile from "./utils/theme";
import App from "./App";

const theme = createMuiTheme(themeFile);

ReactDOM.render(
	<MuiThemeProvider theme={theme}>
		<Router>
			<App />
		</Router>
	</MuiThemeProvider>,
	document.getElementById("root")
);
