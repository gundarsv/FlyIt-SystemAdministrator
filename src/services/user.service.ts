import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "https://localhost:44305/api/User/";

class UserService {
	private axiosInstance = axios.create();

	constructor() {
		this.axiosInstance.interceptors.response.use(
			(response) => {
				return response;
			},
			(error) => {
				if (error.response.status === 401) {
					localStorage.removeItem("token");
				}

				return Promise.reject(error);
			}
		);
	}

	getUsers() {
		return axios.get(API_URL + "Users", { headers: authHeader() });
	}
}

export default new UserService();
