import React, { useState, useEffect } from 'react';
import './App.css';
import { Route, Switch, withRouter } from 'react-router-dom';

import firebase from './utils/config';

//Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App(props: any) {
	const [userState, setUserState] = useState<any>();
	const [authState, setAuthState] = useState<any>(false);

	useEffect(() => {
		const authListener = () => {
			firebase.auth().onAuthStateChanged((user) => {
				if (user?.uid === undefined || null) {
					localStorage.removeItem('userId');
					setAuthState(false);
					props.history.push('/login');
				} else {
					setUserState(user?.uid);
					localStorage.setItem('userId', `${user?.uid}`);
					setAuthState(true);
					props.history.push('/');
				}
			});
		};

		authListener();
	}, [authState, props.history, userState]);

	if (authState === false) {
		return (
			<Switch>
				<Route exact path='/signup' component={Signup} />
				<Route exact path='/login' component={Login} />
			</Switch>
		);
	} else {
		return (
			<div className='container'>
				<Route exact path='/' component={Home} />
			</div>
		);
	}
}

export default withRouter(App);
