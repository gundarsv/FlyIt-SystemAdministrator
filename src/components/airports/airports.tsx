import {
	Avatar,
	Button,
	CircularProgress,
	Container,
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemSecondaryAction,
	ListItemText,
	Theme,
	Typography,
	createStyles,
	makeStyles,
} from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";
import { Airport } from "src/types/Airport";
import AirportService from "src/services/airport.service";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import { User } from "src/types/User";
import { useSnackbar } from "notistack";
import { withRouter } from "react-router-dom";

interface AirportProps {
	user: User;
	onDeleted: (airport: Airport, userId: number) => void;
	onAdd: (userId: number, setAirports: React.Dispatch<React.SetStateAction<Airport[]>>) => void;
}

const Airports: React.FC<AirportProps> = ({ user, onDeleted, onAdd }: AirportProps) => {
	const [isLoading, setIsLoading] = React.useState(false);
	const [airports, setAirports] = React.useState<Airport[]>(user.airports);
	const snackbar = useSnackbar();

	const renderAirports = (airports: Airport[]) => {
		return airports.map((airport, index) => {
			return (
				<ListItem key={index}>
					<ListItemText primary={airport.iata} secondary={airport.name} />
					<ListItemSecondaryAction>
						<IconButton edge="end" aria-label="delete" onClick={() => OnDeleteAirport(airport)}>
							<DeleteIcon color="error" />
						</IconButton>
					</ListItemSecondaryAction>
				</ListItem>
			);
		});
	};

	const OnDeleteAirport = (airport: Airport) => {
		setIsLoading(true);
		AirportService.removeAiportFromUser(user.id, airport.id).then(
			response => {
				if (response.status === 200) {
					setIsLoading(false);
					setAirports(airports.filter(a => a.id !== airport.id));
					onDeleted(airport, user.id);
					snackbar.enqueueSnackbar("Airport - " + airport.iata + " was removed from User - " + user.id, { variant: "success", autoHideDuration: 2000 });
				}
			},
			error => {
				setIsLoading(false);
				snackbar.enqueueSnackbar(error.response.data[0], { variant: "error", autoHideDuration: 2000 });
			},
		);
	};

	if (isLoading) {
		return (
			<div style={{ textAlign: "center", margin: 20 }}>
				<CircularProgress />
			</div>
		);
	}

	return (
		<div>
			<List>{renderAirports(airports)}</List>
			<div style={{ textAlign: "center", margin: 10 }}>
				<Button fullWidth={true} endIcon={<AddIcon />} onClick={() => onAdd(user.id, setAirports)}>
					Add airport
				</Button>
			</div>
		</div>
	);
};

export default withRouter(Airports);
