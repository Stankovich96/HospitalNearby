import React, { Fragment, useState } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import firebase from '../utils/config';

//Material Ui
import { createStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const styles = (theme: any) =>
	createStyles({
		root: {
			width: '100%',
			'& > * + *': {
				marginTop: 90,
			},
			'& .MuiFormControl-root': {
				width: 400,
			},
			'& .MuiInput-root': {
				width: 200,
			},
		},
		MuiFormControlRoot: {
			width: 400,
		},
		MuiInputRoot: {
			width: 200,
		},
		title: {
			position: 'absolute',
			display: 'inline-block',
			textDecoration: 'none',
			color: '#ffffff',
		},
		logo: {
			maxWidth: 60,
		},
		layout: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'center',
			maxWidth: '1349px',
			position: 'absolute',
			top: 100,
		},
		header: {
			display: 'flex',
			flexDirection: 'row',
			width: 1300,
		},
		headerText: {
			justifyContent: 'center',
			color: '#325ca8',
		},
		form: {
			textAlign: 'center',
			textDecoration: 'none',
		},
		pageTitle: {
			margin: '20px auto 20px auto',
		},
		textField: {
			margin: '10px auto 10px auto',
		},
		button: {
			marginTop: 20,
			marginRight: 20,
			position: 'relative',
			textDecoration: 'none',
		},
		progress: {
			position: 'absolute',
		},
		removeDecor: {
			textDecoration: 'none',
			color: 'primary',
		},
	});

const Login = (props: { classes: any; history: any }) => {
	const { classes } = props;

	const [state, setState] = useState<any>({
		email: '',
		password: '',
		loading: false,
	});

	const handleChange = (event: any) => {
		const { name, value } = event.target;
		setState((state: any) => ({ ...state, [name]: value }));
	};

	const clearFields = () => {
		setState({
			email: '',
			password: '',
		});
	};

	const handleSubmit = (event: any) => {
		event.preventDefault();
		firebase
			.auth()
			.signInWithEmailAndPassword(state.email, state.password)
			.then((u) => {
				props.history.push('/');
			})
			.catch((error) => {
				console.log(error);
			});
		clearFields();
	};

	return (
		<Fragment>
			<AppBar>
				<Toolbar>
					<Link to='/'>
						<img src='Hospital.png' alt='Hospital' className={classes.logo} />
						<h3 className={classes.title}>HospitalNow</h3>
					</Link>
				</Toolbar>
			</AppBar>

			<div className={classes.layout}>
				<div className={classes.header}>
					<Grid container className={classes.form}>
						<Grid item sm />
						<Grid item sm>
							<Typography variant='h4' className={classes.pageTitle}>
								Login
							</Typography>
							<form noValidate onSubmit={handleSubmit}>
								<TextField
									id='email'
									name='email'
									type='email'
									label='Email'
									className={classes.TextField}
									value={state.email}
									onChange={handleChange}
									fullWidth
								/>

								<TextField
									id='password'
									name='password'
									type='password'
									label='Password'
									className={classes.TextField}
									value={state.password}
									onChange={handleChange}
									fullWidth
								/>

								<Button
									type='submit'
									variant='contained'
									color='primary'
									className={classes.button}
									disabled={state.loading}>
									LOGIN
									{state.loading && (
										<CircularProgress size={20} className={classes.progress} />
									)}
								</Button>
								<br />
								<small>
									Don't have an account?
									<Link
										to='/signup'
										color='primary'
										className={classes.removeDecor}>
										Signup
									</Link>
								</small>
							</form>
						</Grid>
						<Grid item sm />
					</Grid>
				</div>
			</div>
		</Fragment>
	);
};

export default withStyles(styles)(Login);
