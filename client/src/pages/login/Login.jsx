import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";

import React, { useState, useContext } from "react";

const Login = () => {
	const [inputs, setInputs] = useState({
		email: "",
		password: "",
	});
	const [err, setErr] = useState(null);
	const { login } = useContext(AuthContext);
	const navigate = useNavigate();
	const handleChange = (e) => {
		setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			await login(inputs);
			navigate("/");
		} catch (err) {
			console.log(err);
			setErr(err.response.data);
		}
	};
	return (
		<div className="login">
			<div className="container">
				<h1>Welcome to Auto Heroes</h1>
				<div className="form">
					<h3>Login</h3>
					<form>
						<input
							type="email"
							placeholder="Email"
							name="email"
							onChange={handleChange}
						/>
						<input
							type="password"
							placeholder="Password"
							name="password"
							onChange={handleChange}
						/>
						<Link
							to="/register"
							style={{ textDecoration: "none", color: "lightcoral" }}>
							<span>Register Here</span>
						</Link>

						{err && <span>{err} </span>}
						<button onClick={handleLogin}>Login</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
