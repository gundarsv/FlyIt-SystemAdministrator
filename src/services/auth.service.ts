import axios from "axios";
import { AuthenticationToken } from "src/types/Auth";

const API_URL = "https://localhost:44305/api/Auth/";

class AuthService {
	async singIn(emal: string, password: string) {
		const response = await axios.post<AuthenticationToken>(API_URL + "sysadmin/SignIn", {
			email: emal,
			password: password
		});
		if (response.data.accessToken) {
			localStorage.setItem("token", JSON.stringify(response.data));
		}
		return response.data;
	}

	logout() {
		localStorage.removeItem("token");
	}

	getAuthenticationToken() {
		return JSON.parse(localStorage.getItem("token"));
	}
}

export default new AuthService();
