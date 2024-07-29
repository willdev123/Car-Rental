import React, { useContext, useEffect, useState } from "react";
import "./registerCar.scss";
import { AuthContext } from "../../context/authContext";
import { Button } from "@mui/material";

import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Select from "@mui/material/Select";

import { makeRequest } from "../../axios";
import { useNavigate } from "react-router-dom";

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: 50 * 4.5 + 5,
			width: 400,
			overflowX: "scroll",
		},
	},
};
const RegisterCar = () => {
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();

	const [category, setCategory] = useState([]);
	const [inputs, setInputs] = useState({
		brand: "",
		model: "",
		made: "",
		color: "",
		reg_num: "",
		category_id: null,
		owner_id: user.owner_id,
	});
	const [err, setError] = useState({
		inputErr: null,
		categoryErr: null,
		regErr: null,
		createErr: null,
	});
	const [result, setResult] = useState("");
	const [open, setOpen] = useState(false);

	const handleChange = (e) => {
		setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleRegister = async (e) => {
		e.preventDefault();
		if (inputs.brand === "") {
			setError((prev) => ({
				...prev,
				inputErr: "Brand cannot be empty!",
				regErr: null,
				createErr: null,
			}));
		}
		if (inputs.reg_num === "") {
			setError((prev) => ({
				...prev,
				inputErr: null,
				regErr: "Registration Number cannot be empty!",
				createErr: null,
			}));
		}
		if (inputs.brand === "" && inputs.reg_num === "") {
			setError((prev) => ({
				...prev,
				inputErr: "Brand cannot be empty!",
				regErr: "Registration Number cannot be empty!",
				createErr: null,
			}));
		}
		if (inputs.brand !== "" && inputs.reg_num !== "") {
			setError((prev) => ({
				...prev,
				inputErr: null,
				regErr: null,
				createErr: null,
			}));
			try {
				const result = await makeRequest.post("/cars", inputs);
				setResult(result.data);
				setOpen(true);
				setError((prev) => ({
					...prev,
					createErr: null,
				}));
			} catch (err) {
				console.log(err);
				setError((prev) => ({
					...prev,
					createErr: err.response.data,
				}));
			}
		}
	};

	const handleChangeSelect = (e) => {
		setInputs((prev) => ({ ...prev, category_id: e.target.value }));
	};

	useEffect(() => {
		const getCategory = async () => {
			try {
				const category = await makeRequest.get("/category/find");
				setCategory(category.data);
			} catch (err) {
				setError((prev) => ({
					...prev,
					categoryErr: err.response.data,
				}));
			}
		};
		getCategory();
	}, []);
	return (
		<div className="registerCar">
			<div className="container">
				<h2>Register Car</h2>
				<div className="form">
					<div className="field">
						<label htmlFor="brand">Brand</label>
						<input
							id="brand"
							name="brand"
							onChange={handleChange}
							placeholder="Honda..."
						/>
					</div>
					{err?.inputErr ? (
						<div style={{ color: "red", fontSize: "12px" }}>{err.inputErr}</div>
					) : null}
					<div className="field">
						<label htmlFor="model">Model</label>
						<input
							id="model"
							name="model"
							onChange={handleChange}
							placeholder="City..."
						/>
					</div>
					<div className="field">
						<label htmlFor="made">Made</label>
						<input
							id="made"
							name="made"
							onChange={handleChange}
							placeholder="2012..."
						/>
					</div>
					<div className="field">
						<label htmlFor="color">Color</label>
						<input
							id="color"
							name="color"
							onChange={handleChange}
							placeholder="Silver..."
						/>
					</div>
					<div className="field">
						<label htmlFor="reg_num">Registration Number</label>
						<input
							id="reg_num"
							name="reg_num"
							onChange={handleChange}
							placeholder="AA XXXXXX"
						/>
					</div>
					{err?.regErr ? (
						<div style={{ color: "red", fontSize: "12px" }}>{err.regErr}</div>
					) : null}
					<div className="field">
						<label htmlFor="category"> Category</label>

						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={inputs?.category}
							label="Category"
							className="select"
							onChange={handleChangeSelect}
							MenuProps={MenuProps}>
							{category?.map((c) => {
								return (
									<MenuItem key={c?.id} value={c?.id}>
										{c.cat_name} -- {c.cost_per_day} THB
									</MenuItem>
								);
							})}
						</Select>
					</div>
					{err?.createErr ? (
						<div style={{ color: "red", fontSize: "12px" }}>
							{err.createErr}
						</div>
					) : null}
				</div>

				<Button
					variant="contained"
					className="register"
					onClick={handleRegister}>
					Register
				</Button>
			</div>
			<Dialog
				open={open}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description">
				<DialogContent>
					<div className="text">{result}</div>
				</DialogContent>
				<DialogActions>
					<Button
						variant="contained"
						style={{ backgroundColor: "lightcoral" }}
						onClick={() => {
							setOpen(false);
							navigate("/carList");
						}}>
						OK
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default RegisterCar;
