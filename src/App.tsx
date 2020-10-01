import React from "react";
import { SignIn } from "components/signIn";
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link,
	Redirect,
	useHistory,
	useLocation
} from "react-router-dom";
import AuthService from "./services/auth.service";
import { AirportsAdministrators } from "components/airportsAdministrators";

const App: React.FC = () => {
	function PrivateRoute({ children, ...rest }) {
		return (
			<Route
				{...rest}
				render={({ location }) =>
					AuthService.getAuthenticationToken() !== null ? (
						children
					) : (
						<Redirect
							to={{
								pathname: "/signIn",
								state: { from: location }
							}}
						/>
					)
				}
			/>
		);
	}

	function PublicRoute({ children, ...rest }) {
		return (
			<Route
				{...rest}
				render={({ location }) =>
					AuthService.getAuthenticationToken() === null ? (
						children
					) : (
						<Redirect
							to={{
								pathname: "/",
								state: { from: location }
							}}
						/>
					)
				}
			/>
		);
	}

	return (
		<Router history={history}>
			<PublicRoute exact path="/signIn">
				<SignIn />
			</PublicRoute>
			<PrivateRoute exact path="/">
				<AirportsAdministrators />
			</PrivateRoute>
		</Router>
	);
};

export default App;
