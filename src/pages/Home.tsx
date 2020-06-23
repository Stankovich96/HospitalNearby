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
		roott: {
			width: "100%",
			top: 150,
			maxWidth: 400,
		},
		listItem: {
			alignItems: "flex-start",
		},
		inner: {
			display: "inline",
			variant: "body2",
		},
	});

const Home = (props: { classes: any }) => {
	const { classes } = props;

	dayjs.extend(relativeTime);
	const [nearbyplaces, setNearbyplaces] = useState({});
	const [type, setType] = useState({
		search: "",
	});
	const [coordinates, setCoordinates] = useState({
		lat: null,
		lng: null,
	});
	const [history, sethistory] = useState<any>([]);
	const [distance, setDistance] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const handleChange = (event: { target: { name: any; value: any } }) => {
		const { name, value } = event.target;
		setType((type) => ({ ...type, [name]: value }));
		// console.log(event.target.value);
	};

	const handleSelect = (event: { target: { value: any } }) => {
		const { value } = event.target;
		setDistance(value);
		// console.log(event.target.value);
	};

	const clearFields = () => {
		setType({
			search: "",
		});
		setDistance("");
	};

	useEffect(() => {
		firebase

			.firestore()

			.collection("searches")

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
			SearchDetails.search === "Hospital" ||
			("hospital" && DistanceDetails.distance !== "")
		) {
			var lati = coordinates.lat;
			var longi = coordinates.lng;

			const success = (position: {
				coords: { latitude: any; longitude: any };
			}) => {
				lati = position.coords.latitude;
				longi = position.coords.longitude;
				console.log(lati);
				console.log(longi);

				axios
					.get(
						`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lati},${longi}&radius=${distance}&type=${type.search}&keyword=hospital&key=AIzaSyDXvUDt3rdySy5vFgR3MnHGvbiRT2-6sdA`
					)
					.then((res) => {
						console.log(res.data);
						const database = firebase.firestore();
						database.collection("searches").add({
							latitude: position.coords.latitude,
							longitude: position.coords.longitude,
							radius: distance,
							searchTerm: type.search,
							createdAt: Date.now(),
						});
						setNearbyplaces(res.data);
					})
					.catch((error) => setError(error.message));
				console.log(lati);
				console.log(longi);
			};
			const error = () => {
				alert("Geolocation Failed, try enable your location");
			};
			navigator.geolocation.getCurrentPosition(success, error);
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
								label="Type Hospital"
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
								(list: { id: any; searchTerm: any; createdAt: any }) => (
									<List key={list.id} className={classes.roott}>
										<ListItem key={list.id} className={classes.listItem}>
											<ListItemText
												primary={list.searchTerm}
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
