import React from "react";
import { withRouter } from "react-router-dom";
import UserService from "src/services/user.service";
import { User } from "src/types/User";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import MaterialTable from "material-table";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import { LinearProgress } from "@material-ui/core";
import { UsersDialog } from "components/usersDialog";
import { useSnackbar } from "notistack";

const useStyles = makeStyles({
	container: {
		paddingTop: 30,
	},
});

const Main: React.FC = () => {
	const classes = useStyles();
	const snackbar = useSnackbar();

	const [open, setOpen] = React.useState(false);
	const [isLoading, setIsLoading] = React.useState(true);
	const [airportsAdministrators, setAirportsAdministrators] = React.useState<Array<User>>([]);

	const handleClose = () => {
		setOpen(false);
	};

	const handleAddUser = (user: User) => {
		setOpen(false);
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
							setOpen(true);
						},
					},
				]}
			/>
			<UsersDialog onSelectUser={handleAddUser} open={open} onClose={handleClose} />
		</Container>
	);
};

export default withRouter(Main);
