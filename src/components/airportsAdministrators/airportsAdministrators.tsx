import React from "react";
import { withRouter } from "react-router-dom";
import UserService from "src/services/user.service";

const AirportsAdministrators: React.FC = () => {
	const [isLoading, setIsLoading] = React.useState(false);

	React.useEffect(() => {
		setIsLoading(true);
		UserService.getUsers().then(
			(response) => {
				console.log(response.data);
				setIsLoading(false);
			},
			(error) => {
				console.log(error);
			}
		);
	}, []);

	if (isLoading) {
		return <div>...Loading</div>;
	}

	return <div>Hello</div>;
};

export default withRouter(AirportsAdministrators);
