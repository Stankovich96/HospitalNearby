import React, { Fragment } from "react";
import withStyles from "@material-ui/core/styles/withStyles";

//Material Ui
import { CircularProgress } from "@material-ui/core";
import { createStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import Rating from "@material-ui/lab/Rating";

const styles = (theme: { palette: { common: { white: string } } }) =>
	createStyles({
		root: {
			width: "100%",
			top: 150,
			maxWidth: 400,
		},
		progress: {
			position: "absolute",
		},
		loadingScreen: {
			position: "absolute",
			top: 50,
			left: 30,
			zIndex: -1,
		},
		listItem: {
			alignItems: "flex-start",
		},
		inner: {
			display: "inline",
			variant: "body2",
		},
	});

const Result = (props: {
	classes: any;
	distance: any;
	places: any;
	loading: any;
	error: any;
}) => {
	const { classes, distance, places, loading, error } = props;

	if (error) {
		return (
			<div className={classes.loadingScreen}>
				<h1>{error}</h1>
			</div>
		);
	}
	if (places.status === "ZERO_RESULTS") {
		return (
			<div className={classes.loadingScreen}>
				<h1> No Places found.Try Again ...</h1>
			</div>
		);
	}
	if (places.status === "OVER_QUERY_LIMIT") {
		return (
			<div className={classes.loadingScreen}>
				<h1> {places.error_message}</h1>
			</div>
		);
	}
	return places.results ? (
		places.results.map(
			(place: {
				icon: string;
				name: string;
				vicinity: string;
				rating: any;
				place_id: any;
			}) => (
				<List key={place.place_id} className={classes.root}>
					<ListItem key={place.place_id} className={classes.listItem}>
						<ListItemAvatar>
							<Avatar alt="Place Icon" src={place.icon} />
						</ListItemAvatar>
						<ListItemText
							primary={place.name}
							secondary={
								<Fragment>
									<Typography
										className={classes.inner}
										variant="body2"
										color="primary"
									>
										{place.vicinity}
									</Typography>
								</Fragment>
							}
						/>
						<br />
						<Rating name="disabled" value={place.rating} disabled />
					</ListItem>
				</List>
			)
		)
	) : (
		<div className="spinner">
			{loading && <CircularProgress size={20} className={classes.progress} />}
		</div>
	);
};
export default withStyles(styles)(Result);
