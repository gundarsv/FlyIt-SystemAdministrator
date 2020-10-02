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

const useStyles = makeStyles({
	container: {
		paddingTop: 30,
	},
});

function createData(name: string, calories: number, fat: number, carbs: number, protein: number) {
	return { name, calories, fat, carbs, protein };
}

const rows = [
	createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
	createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
	createData("Eclair", 262, 16.0, 24, 6.0),
	createData("Cupcake", 305, 3.7, 67, 4.3),
	createData("Gingerbread", 356, 16.0, 49, 3.9),
];

const Main: React.FC = () => {
	const classes = useStyles();

	const [isLoading, setIsLoading] = React.useState(true);
	const [airportsAdministrators, setAirportsAdministrators] = React.useState<Array<User>>([]);

	React.useEffect(() => {
		setIsLoading(true);
		UserService.getAirportsAdministrators().then(
			response => {
				setAirportsAdministrators(response.data);
				setIsLoading(false);
			},
			error => {
				setIsLoading(false);
			},
		);
	}, []);

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
							console.log(rowData);
						},
					},
					{
						// eslint-disable-next-line react/display-name
						icon: () => <AddIcon />,
						tooltip: "Add System Administrator",
						isFreeAction: true,
						onClick: event => {
							console.log(event);
						},
					},
				]}
			/>
		</Container>
	);
};

export default withRouter(Main);
