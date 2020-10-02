import axios from "axios";
import { User } from "src/types/User";
import authHeader from "./auth-header";

const API_URL = "https://flyit.azurewebsites.net/api/User/";

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
		return axios.get<Array<User>>(API_URL + "Users", { headers: authHeader() });
	}

	getAirportsAdministrators() {
		return axios.get<Array<User>>(API_URL + "AirportsAdministrators", {
			headers: authHeader(),
		});
	}
}

export default new UserService();
