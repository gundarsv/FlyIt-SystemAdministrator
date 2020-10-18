import { Airport } from "src/types/Airport";
import AuthService from "./auth.service";
import { User } from "src/types/User";
import authHeader from "./auth-header";
import axios from "axios";

const API_URL = "https://flyit.azurewebsites.net/";

class AirportService {
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

	getAirports() {
		return this.axiosInstance.get<Array<Airport>>(API_URL + "api/Airport/Airports", {
			headers: authHeader(),
		});
	}

	removeAiportFromUser(userId: number, airportId) {
		return this.axiosInstance.delete(API_URL + "api/Airport/" + airportId + "/User/" + userId, {
			headers: authHeader(),
		});
	}

	addAiportToUser(userId: number, airportId) {
		return this.axiosInstance.post(
			API_URL + "api/Airport/" + airportId + "/User/" + userId,
			{},
			{
				headers: authHeader(),
			},
		);
	}
}

export default new AirportService();
