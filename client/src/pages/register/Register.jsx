import { useState } from "react";
import axios from "axios";
import "./register.scss";
import { Link } from "react-router-dom";

const Register = () => {
	const [inputs, setInputs] = useState({
		firstname: "",
		lastname: "",
		email: "",
		password: "",
	});
	const [result, setResult] = useState(null);
	const [err, setErr] = useState(null);

	const handleChange = (e) => {
		setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleClick = async (e) => {
		e.preventDefault();
		try {
			const result = await axios.post(
				"http://localhost:5000/api/auth/register",
				inputs,
			);
			setErr(null);
			setResult(result.data);
		} catch (err) {
			console.log(err);
			setResult(null);
			setErr(err.response.data);
		}
	};
	return (
		<div className="register">
			<div className="container">
				<h1>Welcome to Auto Heroes</h1>
				<div className="form">
					<h3>Register</h3>
					<form>
						<input
							type="text"
							placeholder="First Name"
							name="firstname"
							onChange={handleChange}
						/>
						<input
							type="text"
							placeholder="Last Name"
							name="lastname"
							onChange={handleChange}
						/>
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
						{err ? err : ""}
						{result ? (
							<div>
								<span>{result} </span>
								<Link
									to="/login"
									style={{
										textDecoration: "none",
										color: "limegreen",
									}}>
									Login Here
								</Link>
							</div>
						) : (
							""
						)}
						<button onClick={handleClick}>Register</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Register;
