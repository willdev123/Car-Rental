import axios from "axios";
import { useState, useEffect, createContext } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
	const [user, setUser] = useState(
		JSON.parse(localStorage.getItem("user")) || null,
	);

	const login = async (inputs) => {
		const result = await axios.post(
			"http://localhost:5000/api/auth/login",
			inputs,
			{
				withCredentials: true,
			},
		);

		setUser(result.data);
	};

	useEffect(() => {
		localStorage.setItem("user", JSON.stringify(user));
	}, [user]);

	return (
		<AuthContext.Provider value={{ user, login }}>
			{children}
		</AuthContext.Provider>
	);
};
