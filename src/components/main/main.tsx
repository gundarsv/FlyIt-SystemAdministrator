import AddIcon from "@material-ui/icons/Add";
import { Airport } from "src/types/Airport";
import AirportService from "src/services/airport.service";
import { Airports } from "components/airports";
import { AirportsDialog } from "components/airportsDialog";
import Container from "@material-ui/core/Container";
import DeleteIcon from "@material-ui/icons/Delete";
import { LinearProgress } from "@material-ui/core";
import LocalAirportIcon from "@material-ui/icons/LocalAirport";
import MaterialTable from "material-table";
import React from "react";
import { User } from "src/types/User";
import UserService from "src/services/user.service";
import { UsersDialog } from "components/usersDialog";
import { makeStyles } from "@material-ui/core/styles";
import { useSnackbar } from "notistack";
import { withRouter } from "react-router-dom";

const useStyles = makeStyles({
	container: {
		paddingTop: 30,
	},
	link: {
		"&:hover": {
			cursor: "pointer",
		},
	},
});

const Main: React.FC = () => {
	const classes = useStyles();
	const snackbar = useSnackbar();

	const [isUserDialogOpen, setIsUserDialogOpen] = React.useState(false);
	const [isAirportsDialogOpen, setIsAirportsDialogOpen] = React.useState({ isOpen: false, userId: undefined, setAiports: undefined });
	const [isLoading, setIsLoading] = React.useState(true);
	const [airportsAdministrators, setAirportsAdministrators] = React.useState<Array<User>>([]);

	const handleUsersDialogClose = () => {
		setIsUserDialogOpen(false);
	};

	const handleAirportsDialogClose = () => {
		setIsAirportsDialogOpen({ isOpen: false, userId: undefined, setAiports: undefined });
	};

	const handleAddUser = (user: User) => {
		setIsUserDialogOpen(false);
		UserService.addAirportsAdministrator(user.id).then(
			response => {
				if (response.status === 200) {
					setAirportsAdministrators([...airportsAdministrators, user]);
					snackbar.enqueueSnackbar("User - " + user.email + " was added", { variant: "success", autoHideDuration: 2000 });
				}
			},
			error => {
				snackbar.enqueueSnackbar(error.response.data[0], { variant: "error", autoHideDuration: 2000 });
			},
		);
	};

	const handleRemoveUser = (user: User) => {
		UserService.removeAirportsAdministrator(user.id).then(
			response => {
				if (response.status === 200) {
					setAirportsAdministrators(airportsAdministrators.filter(u => u.id !== user.id));
					snackbar.enqueueSnackbar("User - " + user.email + " was removed", { variant: "success", autoHideDuration: 2000 });
				}
			},
			error => {
				snackbar.enqueueSnackbar(error.response.data[0], { variant: "error", autoHideDuration: 2000 });
			},
		);
	};

	const handleAddAirport = (airport: Airport) => {
		const userId = isAirportsDialogOpen.userId;
		const setAiports: React.Dispatch<React.SetStateAction<Airport[]>> = isAirportsDialogOpen.setAiports;
		setIsAirportsDialogOpen({ isOpen: false, userId: undefined, setAiports: undefined });
		AirportService.addAiportToUser(userId, airport.id).then(
			response => {
				if (response.status === 201) {
					const updatedAirportsAdministrators = airportsAdministrators.map(user => {
						if (user.id === userId) {
							user.airports.push(airport);
							setAiports(user.airports);
						}

						return user;
					});

					setAirportsAdministrators(updatedAirportsAdministrators);

					snackbar.enqueueSnackbar("Airport - " + airport.id + " was added to User - " + userId, { variant: "success", autoHideDuration: 2000 });
				}
			},
			error => {
				snackbar.enqueueSnackbar(error.response.data[0], { variant: "error", autoHideDuration: 2000 });
			},
		);
	};

	const onAirportDeleted = (airport: Airport, userId: number) => {
		const updatedAirportsAdministrators = airportsAdministrators.map(user => {
			user.id === userId ? (user.airports = user.airports.filter(a => a.id !== airport.id)) : null;
			return user;
		});

		setAirportsAdministrators(updatedAirportsAdministrators);
	};

	const onAddAirport = (userId: number, setAiports: React.Dispatch<React.SetStateAction<Airport[]>>) => {
		setIsAirportsDialogOpen({ isOpen: true, userId: userId, setAiports: setAiports });
	};

	React.useEffect(() => {
		setIsLoading(true);
		UserService.getAirportsAdministrators().then(
			response => {
				setAirportsAdministrators(response.data);
				setIsLoading(false);
			},
			error => {
				snackbar.enqueueSnackbar(error.response.data[0], { variant: "error", autoHideDuration: 2000 });
				setIsLoading(false);
			},
		);
	}, [setAirportsAdministrators, setIsLoading, snackbar]);

	if (isLoading) {
		return <LinearProgress />;
	}

	return (
		<Container className={classes.container} maxWidth="xl">
			<MaterialTable
				style={{ fontFamily: "'Roboto', 'Helvetica', 'Arial', 'sans-serif'" }}
				columns={[
					{ title: "Id", field: "id" },
					{ title: "E-mail", field: "email" },
					{ title: "Full name", field: "fullName" },
					{
						title: "Airports",
						align: "center",
						field: "airports.length",
						sorting: false,
						disableClick: false,
					},
				]}
				detailPanel={[
					{
						// eslint-disable-next-line react/display-name
						icon: () => <LocalAirportIcon />,
						// eslint-disable-next-line react/display-name
						render: rowdata => <Airports user={rowdata} onDeleted={onAirportDeleted} onAdd={onAddAirport} />,
					},
				]}
				data={airportsAdministrators}
				options={{ showTitle: false, sorting: true, paging: false, minBodyHeight: 750, maxBodyHeight: 750, actionsColumnIndex: -1 }}
				actions={[
					{
						// eslint-disable-next-line react/display-name
						icon: () => <DeleteIcon />,
						tooltip: "Remove",
						onClick: (event, rowData) => {
							handleRemoveUser(rowData as User);
						},
					},
					{
						// eslint-disable-next-line react/display-name
						icon: () => <AddIcon />,
						tooltip: "Add System Administrator",
						isFreeAction: true,
						onClick: () => {
							setIsUserDialogOpen(true);
						},
					},
				]}
			/>
			{isUserDialogOpen ? <UsersDialog onSelectUser={handleAddUser} open={isUserDialogOpen} onClose={handleUsersDialogClose} /> : null}
			{isAirportsDialogOpen.isOpen ? <AirportsDialog onSelectAirport={handleAddAirport} open={isAirportsDialogOpen} onClose={handleAirportsDialogClose} /> : null}
		</Container>
	);
};

export default withRouter(Main);
