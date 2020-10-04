import axios from "axios";
import { User } from "src/types/User";
import authHeader from "./auth-header";

const API_URL = "https://flyit.azurewebsites.net/";

enum Roles {
	AirportsAdministrators = 1,
	SystemAdministrator = 2,
}

const config = {
	headers: {
		"Content-Type": "application/json",
		Authorization: "Bearer perm:<my token>",
	},
	responseType: "json",
};

class UserService {
	private axiosInstance = axios.create();

	constructor() {
		this.axiosInstance.interceptors.response.use(
			response => {
				return response;
			},
			error => {
				if (error.response.status === 401) {
					localStorage.removeItem("token");
				}

				return Promise.reject(error);
			},
		);
	}

	getUsers() {
		return axios.get<Array<User>>(API_URL + "api/User/Users", { headers: authHeader() });
	}

	getAirportsAdministrators() {
		return axios.get<Array<User>>(API_URL + "api/User/AirportsAdministrators", {
			headers: authHeader(),
		});
	}

	addAirportsAdministrator(id: number) {
		return axios.post(
			API_URL + "api/Role/User/" + id + "/Role/1",
			{},
			{
				headers: authHeader(),
			},
		);
	}

	removeAirportsAdministrator(id: number) {
		return axios.delete(API_URL + "api/Role/User/" + id + "/Role/1", {
			headers: authHeader(),
		});
	}
}

export default new UserService();
