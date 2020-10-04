import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import PersonIcon from "@material-ui/icons/Person";
import Typography from "@material-ui/core/Typography";
import { blue } from "@material-ui/core/colors";
import UserService from "src/services/user.service";
import { User } from "src/types/User";
import { useSnackbar } from "notistack";
import { If, Otherwise, When } from "tsx-control-statements/components";
import { CircularProgress, DialogContent, DialogContentText, Input, InputAdornment, InputLabel, Paper, TextField } from "@material-ui/core";

const useStyles = makeStyles({
	avatar: {
		backgroundColor: blue[100],
		color: blue[600],
	},
});

export interface UsersDialogProps {
	open: boolean;
	onClose: () => void;
	onSelectUser: (user: User) => void;
}

const UsersDialog: React.FC<UsersDialogProps> = ({ onClose, onSelectUser, open }: UsersDialogProps) => {
	const classes = useStyles();
	const snackbar = useSnackbar();

	const [isLoading, setIsLoading] = React.useState(true);
	const [users, setUsers] = React.useState<Array<User>>([]);
	const [searchedUsers, setSearchedUsers] = React.useState<Array<User>>([]);

	const handleClose = () => {
		onClose();
	};

	React.useEffect(() => {
		if (open) {
			setIsLoading(true);
			UserService.getUsers().then(
				response => {
					setUsers(response.data);
					setSearchedUsers(response.data);
					setIsLoading(false);
				},
				error => {
					snackbar.enqueueSnackbar(error.response.data[0], { variant: "error", autoHideDuration: 2000 });
					setIsLoading(false);
				},
			);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open === true, setUsers, setIsLoading, setSearchedUsers]);

	const onSearch = (value: string) => {
		const searchedUsers = users.filter(user => user.email.startsWith(value));
		setSearchedUsers(searchedUsers);
	};

	return (
		<Dialog maxWidth="lg" onClose={handleClose} aria-labelledby="users-dialog-title" open={open}>
			<DialogTitle id="users-dialog-title">Select user</DialogTitle>
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
							{searchedUsers.length > 0 ? (
								searchedUsers.map(user => {
									return (
										<ListItem button onClick={() => onSelectUser(user)} key={user.email}>
											<ListItemAvatar>
												<Avatar className={classes.avatar}>
													<PersonIcon />
												</Avatar>
											</ListItemAvatar>
											<ListItemText primary={user.email} />
										</ListItem>
									);
								})
							) : (
								<Typography variant="body1" gutterBottom align="center">
									No Users found
								</Typography>
							)}
						</>
					)}
				</List>
			</Paper>
		</Dialog>
	);
};

export default UsersDialog;
