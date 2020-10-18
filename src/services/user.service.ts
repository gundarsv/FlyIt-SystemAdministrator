import { Airport } from "src/types/Airport";
import AuthService from "./auth.service";
import { User } from "src/types/User";
import authHeader from "./auth-header";
import axios from "axios";

const API_URL = "https://flyit.azurewebsites.net/";

enum Roles {
	AirportsAdministrators = 1,
	SystemAdministrator = 2,
}

class UserService {
	private axiosInstance = axios.create();

	constructor() {
		this.axiosInstance.interceptors.response.use(
			response => {
				return response;
			},
			error => {
				if (error.response.status === 401) {
					AuthService.logout();
					window.location.reload();
				}

				return Promise.reject(error);
			},
		);
	}

	getUsers() {
		return this.axiosInstance.get<Array<User>>(API_URL + "api/User/Users", { headers: authHeader() });
	}

	getAirportsAdministrators() {
		return this.axiosInstance.get<Array<User>>(API_URL + "api/User/AirportsAdministrators", {
			headers: authHeader(),
		});
	}

	addAirportsAdministrator(id: number) {
		return this.axiosInstance.post<Airport>(
			API_URL + "api/Role/User/" + id + "/Role/" + Roles.AirportsAdministrators,
			{},
			{
				headers: authHeader(),
			},
		);
	}

	removeAirportsAdministrator(id: number) {
		return this.axiosInstance.delete(API_URL + "api/Role/User/" + id + "/Role/" + Roles.AirportsAdministrators, {
			headers: authHeader(),
		});
	}
}

export default new UserService();
