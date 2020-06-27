import React, { Fragment, useState, useEffect } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import axios from "axios";
import firebase from "../utils/config";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

//other Helper components
import Result from "./Result";
//Material Ui
import { fade, createStyles } from "@material-ui/core/styles";
import { CircularProgress } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import SearchIcon from "@material-ui/icons/Search";
import Select from "@material-ui/core/Select";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const styles = (theme: { palette: { common: { white: string } } }) =>
	createStyles({
		root: {
			width: "100%",
			"& > * + *": {
				marginTop: 90,
			},
			"& .MuiFormControl-root": {
				width: 400,
			},
			"& .MuiInput-root": {
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
			position: "absolute",
			display: "inline-block",
			textDecoration: "none",
			color: "#ffffff",
		},
		logo: {
			maxWidth: 60,
		},
		layout: {
			display: "flex",
			flexDirection: "column",
			justifyContent: "center",
			maxWidth: "1349px",
		},
		header: {
			display: "flex",
			flexDirection: "row",
			maxWidth: "1300px",
		},
		headerLeft: {
			justifyContent: "flex-start",
			padding: 30,
			textAlign: "left",
		},
		headerRight: {
			justifyContent: "flex-end",
			padding: 30,
			textAlign: "right",
			marginLeft: 300,
		},
		headerText: {
			justifyContent: "flex-start",
			color: "#325ca8",
		},
		tip: {
			textDecoration: "none",
		},
		locate: {
			position: "absolute",
			right: 100,
			background: "none",
			border: "none",
			zIndex: 10,
		},
		search: {
			position: "absolute",
			left: 80,
			"&:hover": {
				backgroundColor: fade(theme.palette.common.white, 0.25),
			},
			borderColor: "white",
			marginLeft: 0,
			margin: "0 10px 5px 10px",
		},
		searchIcon: {
			position: "absolute",
			top: 15,
			left: 350,
			cursor: "pointer",
		},
		select: {
			padding: 10,
			top: 15,
			width: 200,
		},
		listItem: {
			alignItems: "flex-start",
			cursor: "pointer",
		},
		inner: {
			display: "inline",
			variant: "body2",
		},
		button: {
			marginTop: 10,
			marginRight: 10,
			position: "absolute",
			right: 100,
		},
	});

const Home = (props: { classes: any; history: any }) => {
	const { classes } = props;

	const userId = localStorage.getItem("userId");

	dayjs.extend(relativeTime);
	const [nearbyplaces, setNearbyplaces] = useState<any>({});
	const [type, setType] = useState<any>({
		search: "",
	});
	const [coordinates, setCoordinates] = useState<any>({
		lat: 0,
		lng: 0,
	});
	const [history, sethistory] = useState<any>([]);
	const [distance, setDistance] = useState<any>("");
	const [loading, setLoading] = useState<any>(false);
	const [error, setError] = useState<any>("");

	const handleLocation = () => {
		navigator.geolocation.getCurrentPosition(
			(position: Position) => {
				setCoordinates({
					lat: position.coords.latitude,
					lng: position.coords.longitude,
				});
			},
			(error: any) => {
				alert("Geolocation Failed, try enable your location");
			}
		);
	};
	const handleChange = (event: { target: { name: any; value: any } }) => {
		const { name, value } = event.target;
		setType((type: any) => ({ ...type, [name]: value }));
	};

	const handleSelect = (event: { target: { value: any } }) => {
		const { value } = event.target;
		handleLocation();
		setDistance(value);
	};

	const clearFields = () => {
		setType({
			search: "",
		});
		setDistance("");
	};

	const logout = () => {
		localStorage.clear();
		firebase.auth().signOut();
		props.history.push("/login");
	};

	useEffect(() => {
		const fetchResults = () => {
			axios
				.get(
					`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coordinates.lat},${coordinates.lng}&radius=${distance}&type=health&name=${type.search}&key=AIzaSyDAHDj8RP4hlRA_GZsaLWqTUxkXlxU-8U8`
				)
				.then((res) => {
					console.log(res.data);
					const database = firebase.firestore();
					database.collection("searches").add({
						userId: userId,
						latitude: coordinates.lat,
						longitude: coordinates.lng,
						radius: distance,
						searchTerm: type.search,
						createdAt: Date.now(),
					});
					setNearbyplaces(res.data);
				})
				.catch((error) => setError(error.message));
			console.log(coordinates.lat);
			console.log(coordinates.lng);
			console.log(userId);
		};
		if (coordinates.lat && coordinates.lng && type.search && distance)
			fetchResults();
	}, [coordinates.lat, coordinates.lng, type.search, distance]);

	useEffect(() => {
		firebase

			.firestore()

			.collection("searches")
			.where("userId", "==", userId)
			.orderBy("createdAt", "desc")
			.onSnapshot((snapshot) => {
				const lists = snapshot.docs.map((doc) => ({
					id: doc.id,

					...doc.data(),
				}));

				sethistory(lists);
				console.log(lists);
				console.log(history);
			});
	}, []);

	const handleSearchHistory = (
		event: any,
		latitude: any,
		longitude: any,
		searchTerm: any,
		radius: any
	) => {
		setCoordinates({
			lat: latitude,
			lng: longitude,
		});
		setType({
			search: searchTerm,
		});
		setDistance(radius);
	};
	const handleSubmit = (event: { preventDefault: () => void }) => {
		setLoading(true);
		setNearbyplaces("");
		event.preventDefault();

		const SearchDetails = {
			search: type.search,
		};
		const DistanceDetails = {
			distance,
		};
		if (
			SearchDetails.search !== "" ||
			("" && DistanceDetails.distance !== "")
		) {
			clearFields();
		} else if (SearchDetails.search === "" || DistanceDetails.distance === "") {
			alert("Please fill the Details");
		}
	};

	return (
		<Fragment>
			<AppBar>
				<Toolbar>
					<Link to="/">
						<img src="Hospital.png" alt="Hospital" className={classes.logo} />
						<h3 className={classes.title}>HospitalNow</h3>
					</Link>
					<Button
						type="submit"
						variant="contained"
						color="secondary"
						className={classes.button}
						onClick={logout}
					>
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
								id="outline-search"
								name="search"
								type="text"
								label="Enter any health related term"
								color="primary"
								inputProps={{}}
								value={type.search}
								onChange={handleChange}
								variant="outlined"
								className={classes.MuiFormControlRoot}
							/>

							<SearchIcon
								className={classes.searchIcon}
								onClick={handleSubmit}
							/>

							<InputLabel id="label" className={classes.select}>
								Choose a Range(in KM)
							</InputLabel>
							<Select
								labelId="label"
								id="select"
								value={distance}
								onChange={handleSelect}
								className={classes.MuiInputRoot}
							>
								<MenuItem value="1000">1</MenuItem>
								<MenuItem value="2000">2</MenuItem>
								<MenuItem value="3000">3</MenuItem>
								<MenuItem value="4000">4</MenuItem>
								<MenuItem value="5000">5</MenuItem>
							</Select>
						</form>

						<Result
							classes={classes}
							distance={distance}
							places={nearbyplaces}
							loading={loading}
							error={error}
						/>
					</div>
					<div className={classes.headerRight}>
						<h1 className={classes.headerText}>Recent Searches</h1>
						{history ? (
							history.map(
								(list: {
									id: any;
									searchTerm: any;
									createdAt: any;
									latitude: any;
									longitude: any;
									radius: any;
								}) => (
									<List key={list.id} className={classes.roott}>
										<ListItem key={list.id} className={classes.listItem}>
											<ListItemText
												primary={list.searchTerm}
												onClick={(event) => {
													handleSearchHistory(
														event,
														list.latitude,
														list.longitude,
														list.searchTerm,
														list.radius
													);
												}}
												secondary={
													<Fragment>
														<Typography
															className={classes.inner}
															variant="body2"
															color="primary"
														>
															{dayjs(list.createdAt).fromNow()}
														</Typography>
													</Fragment>
												}
											/>
										</ListItem>
									</List>
								)
							)
						) : (
							<div>
								{loading && (
									<CircularProgress size={20} className={classes.progress} />
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</Fragment>
	);
};

export default withStyles(styles)(Home);
