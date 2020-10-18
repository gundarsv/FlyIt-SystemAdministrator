import { CircularProgress, DialogContent, Paper, TextField } from "@material-ui/core";

import { Airport } from "src/types/Airport";
import AirportService from "src/services/airport.service";
import Avatar from "@material-ui/core/Avatar";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import PersonIcon from "@material-ui/icons/Person";
import React from "react";
import Typography from "@material-ui/core/Typography";
import { User } from "src/types/User";
import { blue } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import { useSnackbar } from "notistack";

const useStyles = makeStyles({
	avatar: {
		backgroundColor: blue[100],
		color: blue[600],
	},
});

export interface AirportsDialogProps {
	open: { isOpen: boolean; userId: number };
	onClose: () => void;
	onSelectAirport: (airport: Airport) => void;
}

const AirportsDialog: React.FC<AirportsDialogProps> = ({ onClose, onSelectAirport, open }: AirportsDialogProps) => {
	const classes = useStyles();
	const snackbar = useSnackbar();

	const [isLoading, setIsLoading] = React.useState(true);
	const [airports, setAirports] = React.useState<Array<Airport>>([]);
	const [searchedAirports, setSearchedAirports] = React.useState<Array<Airport>>([]);

	const handleClose = () => {
		onClose();
	};

	React.useEffect(() => {
		if (open) {
			setIsLoading(true);
			AirportService.getAirports().then(
				response => {
					setAirports(response.data);
					setSearchedAirports(response.data);
					setIsLoading(false);
				},
				error => {
					snackbar.enqueueSnackbar(error.response.data[0], { variant: "error", autoHideDuration: 2000 });
					setIsLoading(false);
				},
			);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open.isOpen === true, setAirports, setIsLoading, setSearchedAirports]);

	const onSearch = (value: string) => {
		const searchedUsers = airports.filter(user => user.iata.startsWith(value) || user.name.startsWith(value));
		setSearchedAirports(searchedUsers);
	};

	return (
		<Dialog maxWidth="lg" onClose={handleClose} aria-labelledby="users-dialog-title" open={open.isOpen}>
			<DialogTitle id="users-dialog-title">Select aiport</DialogTitle>
			{!isLoading ? (
				<DialogContent>
					<TextField label="search" onChange={event => onSearch(event.target.value)}></TextField>
				</DialogContent>
			) : null}

			<Paper style={{ maxHeight: 200, overflow: "auto" }}>
				<List style={isLoading ? { textAlign: "center" } : {}}>
					{isLoading ? (
						<CircularProgress color="secondary" />
					) : (
						<>
							{searchedAirports.length > 0 ? (
								searchedAirports.map(airport => {
									return (
										<ListItem button onClick={() => onSelectAirport(airport)} key={airport.id}>
											<ListItemAvatar>
												<Avatar className={classes.avatar}>
													<PersonIcon />
												</Avatar>
											</ListItemAvatar>
											<ListItemText primary={airport.iata} secondary={airport.name} />
										</ListItem>
									);
								})
							) : (
								<Typography variant="body1" gutterBottom align="center">
									No Airports found
								</Typography>
							)}
						</>
					)}
				</List>
			</Paper>
		</Dialog>
	);
};

export default AirportsDialog;
