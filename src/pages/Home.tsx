import React, { Fragment, useState } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link } from "react-router-dom";
import axios from "axios";

//other Helper components
import Result from "./Result";
//Material Ui
import { fade, createStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import TextField from "@material-ui/core/TextField";
import Alert from "@material-ui/lab/Alert";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import SearchIcon from "@material-ui/icons/Search";
import Select from "@material-ui/core/Select";

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
			width: "1349px",
		},
		header: {
			display: "flex",
			flexDirection: "column",
		},
		headerLeft: {
			justifyContent: "flex-start",
			padding: 30,
			textAlign: "left",
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
	});

const Home = (props: { classes: any }) => {
	const { classes } = props;

	const [nearbyplaces, setNearbyplaces] = useState({});
	const [type, setType] = useState({
		search: "",
	});
	const [coordinates, setCoordinates] = useState({
		lat: null,
		lng: null,
	});
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
						`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lati},${longi}&radius=${distance}&type=${type.search}&keyword=hospital&key=YOURAPIKEY`
					)
					.then((res) => {
						console.log(res.data);
						setNearbyplaces(res.data);
					})
					.catch((error) => setError(error.message));
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
				</div>
			</div>
		</Fragment>
	);
};

export default withStyles(styles)(Home);
