import { Airport } from "./Airport";

export interface User {
	id: number;
	email: string;
	fullName: string;
	airports: Airport[];
}
