import React, { Fragment, useState, useEffect, useCallback } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import axios from 'axios';
import firebase from '../utils/config';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

//other Helper components
import Result from './Result';
//Material Ui
import { fade, createStyles } from '@material-ui/core/styles';
import { CircularProgress } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import SearchIcon from '@material-ui/icons/Search';
import Select from '@material-ui/core/Select';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

const styles = (theme: { palette: { common: { white: string } } }) =>
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
		},
		header: {
			display: 'flex',
			flexDirection: 'row',
			maxWidth: '1300px',
		},
		headerLeft: {
			justifyContent: 'flex-start',
			padding: 30,
			textAlign: 'left',
		},
		headerRight: {
			justifyContent: 'flex-end',
			padding: 30,
			textAlign: 'right',
			marginLeft: 300,
		},
		headerText: {
			justifyContent: 'flex-start',
			color: '#325ca8',
		},
		tip: {
			textDecoration: 'none',
		},
		locate: {
			position: 'absolute',
			right: 100,
			background: 'none',
			border: 'none',
			zIndex: 10,
		},
		search: {
			position: 'absolute',
			left: 80,
			'&:hover': {
				backgroundColor: fade(theme.palette.common.white, 0.25),
			},
			borderColor: 'white',
			marginLeft: 0,
			margin: '0 10px 5px 10px',
		},
		searchIcon: {
			position: 'absolute',
			top: 15,
			left: 350,
			cursor: 'pointer',
		},
		select: {
			padding: 10,
			top: 15,
			width: 200,
		},
		listItem: {
			alignItems: 'flex-start',
			cursor: 'pointer',
		},
		inner: {
			display: 'inline',
			variant: 'body2',
		},
		button: {
			marginTop: 10,
			marginRight: 10,
			position: 'absolute',
			right: 100,
		},
	});

const Home = (props: any) => {
	const { classes, history } = props;
	const userId = localStorage.getItem('userId');

	const SEARCH_HISTORY = gql`
		query($userId: ID!) {
			searchHistory(userId: $userId) {
				id
				longitude
				latitude
				radius
				searchTerm
			}
		}
	`;

	const { loading: isLoading, data, refetch } = useQuery(SEARCH_HISTORY, {
		variables: {
			userId,
		},
	});
	dayjs.extend(relativeTime);
	type Coordinates = {
		lat: number;
		lng: number;
	};
	type GeneralState = {
		search: string;
		coordinates: Coordinates;
		distance: number;
		error: any;
	};
	const [generalState, setGeneralState] = useState<GeneralState>({
		search: '',
		coordinates: {
			lat: 0,
			lng: 0,
		},
		distance: 1,
		error: null,
	});
	const [loading, setloading] = useState(false);
	const { search, coordinates, distance, error } = generalState;
	const { lat, lng } = coordinates;
	const handleSetState = useCallback(
		(newState: any) => {
			return setGeneralState({ ...generalState, ...newState });
		},
		[generalState]
	);
	const [nearbyplaces, setNearbyplaces] = useState<any>({});

	const handleLocation = () => {
		navigator.geolocation.getCurrentPosition(
			(position: Position) => {
				handleSetState({
					coordinates: {
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					},
				});
			},
			(error: any) => {
				alert('Geolocation Failed, try enable your location');
			}
		);
	};
	const handleChange = (event: any) => {
		const { value } = event.target;
		handleSetState({
			search: value,
		});
	};

	const handleSelect = (event: any) => {
		const { value } = event.target;
		handleLocation();
		handleSetState({
			distance: value,
		});
	};

	const logout = () => {
		localStorage.clear();
		firebase.auth().signOut();
		history.push('/login');
	};

	useEffect(() => {
		const fetchResults = async () => {
			setloading(true);
			const payload = {
				latitude: lat,
				longitude: lng,
				radius: distance,
				userId,
				searchTerm: search,
				createdAt: Date.now(),
			};
			try {
				const res = await axios.get(
					`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${distance *
						1000}&type=health&name=${search}&key=AIzaSyDAHDj8RP4hlRA_GZsaLWqTUxkXlxU-8U8`
				);
				await firebase
					.firestore()
					.collection('searches')
					.add(payload);
				setNearbyplaces(res.data);
				setloading(true);
			} catch (error) {
				console.log(error);
			}
		};
		if (lat && lng && search && distance) {
			fetchResults();
			setTimeout(() => {
				refetch();
			}, 2000);
		}
	}, [lat, lng, distance, search, userId, refetch]);

	const handleSearchHistory = (
		event: any,
		latitude: number,
		longitude: number,
		searchTerm: string,
		radius: number
	) => {
		handleSetState({
			search: searchTerm,
			distance: radius,
			loading: true,
			coordinates: {
				lat: latitude,
				lng: longitude,
			},
		});
	};
	const handleSubmit = (event: { preventDefault: () => void }) => {
		event.preventDefault();
		if (search === '') {
			alert('Please fill the Details');
		}
		handleSetState({
			search: '',
			distance: '',
			loading: true,
		});
	};

	const renderSearchHistoryList = () => {
		return data.searchHistory.map((search: any) => {
			const { latitude, longitude, searchTerm, radius, id, createdAt } = search;
			return (
				<ListItem className={classes.listItem} key={id}>
					<ListItemText
						primary={searchTerm}
						onClick={(event) => {
							handleSearchHistory(
								event,
								latitude,
								longitude,
								searchTerm,
								radius
							);
						}}
						secondary={dayjs(createdAt).fromNow()}
					/>
				</ListItem>
			);
		});
	};
	const displaySearchHistory = (): false | JSX.Element => {
		if (isLoading) {
			return <CircularProgress size={50} className={classes.progress} />;
		} else {
			if (data.searchHistory.length > 0) {
				return <List>{renderSearchHistoryList()}</List>;
			}
			return <h4>No recent history for you</h4>;
		}
	};

	return (
		<Fragment>
			<AppBar>
				<Toolbar>
					<Link to='/'>
						<img src='Hospital.png' alt='Hospital' className={classes.logo} />
						<h3 className={classes.title}>HospitalNow</h3>
					</Link>
					<Button
						type='submit'
						variant='contained'
						color='secondary'
						className={classes.button}
						onClick={logout}>
						LOGOUT
					</Button>
				</Toolbar>
			</AppBar>

			<div className={classes.layout}>
				<div className={classes.header}>
					<div className={classes.headerLeft}>
						<h1 className={classes.headerText}>
							We Help You <br />
							Find the Closest MedicCare
						</h1>

						<form noValidate onSubmit={handleSubmit} className={classes.search}>
							<TextField
								id='outline-search'
								name='search'
								type='text'
								label='Enter any health related term'
								color='primary'
								inputProps={{}}
								value={search}
								onChange={handleChange}
								variant='outlined'
								className={classes.MuiFormControlRoot}
							/>

							<SearchIcon
								className={classes.searchIcon}
								onClick={handleSubmit}
							/>

							<InputLabel id='label' className={classes.select}>
								Choose a Range(in KM)
							</InputLabel>
							<Select
								labelId='label'
								id='select'
								value={distance}
								onChange={handleSelect}
								className={classes.MuiInputRoot}>
								<MenuItem value={1}>1</MenuItem>
								<MenuItem value={2}>2</MenuItem>
								<MenuItem value={3}>3</MenuItem>
								<MenuItem value={4}>4</MenuItem>
								<MenuItem value={5}>5</MenuItem>
							</Select>
						</form>

						<Result places={nearbyplaces} loading={loading} error={error} />
					</div>
					<div className={classes.headerRight}>
						<h1 className={classes.headerText}>Recent Searches</h1>
						{displaySearchHistory()}
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default withStyles(styles)(Home);
