import React, { useEffect, useState } from "react";
import "./profile.scss";

import Inputs from "../../components/inputs/Inputs";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { makeRequest } from "../../axios";
import { useLocation, useNavigate } from "react-router-dom";

export const Profile = () => {
	const userId = useLocation().pathname.split("/")[2];

	const [driverDialog, setDriverDialog] = useState(false);
	const [ownerDialog, setOwnerDialog] = useState(false);
	const [driverUpdateDialog, setDriverUpdateDialog] = useState(false);
	const [ownerUpdateDialog, setOwnerUpdateDialog] = useState(false);
	const [updateText, setUpdateText] = useState(null);
	const [inputs, setInputs] = useState({
		first_name: "",
		last_name: "",
		email: "",
		phone_no: "",
		address: "",
		driver_lic: "",
		lic_exp_date: "",
		insur_provider: "",
		insur_exp_date: "",
		driver_status: "",
		owner_status: "",
		owner_id: "",
		driver_id: "",
	});
	const [fetchError, setFetchError] = useState(null);
	const [updateError, setUpdateError] = useState(null);
	const [driverReg, setDriverReg] = useState(null);
	const [ownerReg, setOwnerReg] = useState(null);
	const navigate = useNavigate();

	// to write handelRegister for driver and owner dialogs

	const handleDriverRegister = async (e) => {
		e.preventDefault();
		setDriverDialog(false);
		try {
			const result = await makeRequest.post("/users/driver", {
				driver_lic: inputs.driver_lic,
				lic_exp_date: inputs.lic_exp_date,
			});

			const user_updated_result = await makeRequest.get(
				"/users/find/" + userId,
			);
			console.log(user_updated_result.data);

			setInputs(user_updated_result.data);
			setDriverUpdateDialog(true);
			setDriverReg(result.data);
		} catch (err) {
			setDriverUpdateDialog(true);
			setDriverReg(err.response.data);
		}
	};

	const handleOwnerRegister = async (e) => {
		e.preventDefault();

		setOwnerDialog(false);
		try {
			const result = await makeRequest.post("/users/owner", {
				insur_provider: inputs.insur_provider,
				insur_exp_date: inputs.insur_exp_date,
			});

			const user_updated_result = await makeRequest.get(
				"/users/find/" + userId,
			);
			setInputs(user_updated_result.data);
			setOwnerUpdateDialog(true);
			setOwnerReg(result.data);
		} catch (err) {
			setOwnerUpdateDialog(true);
			setOwnerReg(err.response.data);
		}
	};

	//Handlers
	const handleDialogCancel = (e) => {
		e.preventDefault();
		if (e.target.name === "driver") {
			setDriverDialog(false);
		}
		if (e.target.name === "owner") {
			setOwnerDialog(false);
		}
		if (e.target.name === "driver_update") {
			setDriverUpdateDialog(false);
			navigate("/login");
		}
		if (e.target.name === "owner_update") {
			setOwnerUpdateDialog(false);
			navigate("/login");
		}
	};
	const handleDialog = (e) => {
		e.preventDefault();
		if (e.target.name === "driver") {
			setDriverDialog(true);
		}
		if (e.target.name === "owner") {
			setOwnerDialog(true);
		}
		if (e.target.name === "driver_update") {
			setDriverUpdateDialog(true);
		}
		if (e.target.name === "owner_update") {
			setOwnerUpdateDialog(true);
		}
	};
	const handleChange = (e) => {
		setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	// to write Update event -> post api and setState
	const handleUpdate = async (e) => {
		e.preventDefault();
		try {
			const result = await makeRequest.put("/users/user", inputs);
			setUpdateText(result.data);
		} catch (error) {
			setUpdateError(error.response.data);
		}
	};

	useEffect(() => {
		const getUser = async () => {
			try {
				const user = await makeRequest.get("/users/find/" + userId);
				setInputs(user.data);
			} catch (error) {
				setFetchError(error.response.data);
			}
		};
		getUser();
	}, []);

	if (fetchError) {
		return (
			<h1
				className="error"
				style={{
					color: "lightcoral",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}>
				{fetchError}
			</h1>
		);
	}

	if (updateError) {
		return (
			<h1
				className="error"
				style={{
					color: "lightcoral",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
				}}>
				{updateError}
			</h1>
		);
	}
	return (
		<div className="profile">
			<div className="container">
				<h2>Profile</h2>
				<div className="form">
					<div className="child1">
						<div className="field">
							<label htmlFor="first_name">First Name</label>
							<input
								id="first_name"
								defaultValue={inputs?.first_name}
								name="first_name"
								onChange={handleChange}
							/>
						</div>
						<div className="field">
							<label htmlFor="last_name">Last Name</label>
							<input
								id="last_name"
								defaultValue={inputs?.last_name}
								name="last_name"
								onChange={handleChange}
							/>
						</div>
						<div className="field">
							<label htmlFor="email">Email</label>
							<input
								className="email"
								defaultValue={inputs?.email}
								name="email"
								onChange={handleChange}
							/>
						</div>
						<div className="field">
							<label htmlFor="phone">Phone Number</label>
							<input
								id="phone"
								defaultValue={inputs?.phone_no}
								name="phone_no"
								onChange={handleChange}
							/>
						</div>
						<div className="field">
							<label htmlFor="address">Address</label>
							<input
								id="address"
								defaultValue={inputs?.address}
								name="address"
								onChange={handleChange}
							/>
						</div>
						<div className="field">
							<label htmlFor="status">Status</label>
							<div className="text">
								{inputs?.driver_status === 1 && inputs?.owner_status === 1 ? (
									<span>Driver/ Owner</span>
								) : inputs?.owner_status === 1 ? (
									<span>Owner</span>
								) : inputs?.driver_status === 1 ? (
									<span>Driver</span>
								) : (
									<span>Normal User</span>
								)}
							</div>
						</div>
					</div>

					<div className="child2">
						{inputs?.driver_status === 1 ? (
							<Inputs
								id={["driver_lic", "lic_exp_date"]}
								labels={["Driver License", "License Expiry"]}
								e_name={["driver_lic", "lic_exp_date"]}
								defaultValue={[inputs?.driver_lic, inputs?.lic_exp_date]}
								handleChange={handleChange}
							/>
						) : null}

						{inputs?.owner_status === 1 ? (
							<Inputs
								id={["insur_provider", "insur_exp_date"]}
								labels={["Insurance Provider", "Insurance Expiry"]}
								e_name={["insur_provider", "insur_exp_date"]}
								defaultValue={[inputs?.insur_provider, inputs?.insur_exp_date]}
								handleChange={handleChange}
							/>
						) : null}
					</div>
				</div>
				<div className="buttons">
					<Button variant="contained" className="update" onClick={handleUpdate}>
						Update
					</Button>
					{/* To Change Status*/}
					{inputs?.driver_status === 0 ? (
						<Button
							variant="contained"
							className="driver"
							name="driver"
							onClick={handleDialog}>
							Register as Driver
						</Button>
					) : null}
					{/* To Change Status*/}
					{inputs?.owner_status === 0 ? (
						<Button
							variant="contained"
							className="owner"
							name="owner"
							onClick={handleDialog}>
							Register as Owner
						</Button>
					) : null}
				</div>
				{updateText ? (
					<div
						style={{
							marginTop: "20px",
							color: "lightcoral",
							fontSize: "30px",
						}}>
						{updateText}
					</div>
				) : null}
			</div>

			<Dialog open={driverDialog}>
				<DialogTitle style={{ color: "#a9a9a9", fontWeight: "bold" }}>
					Enter Driver Information
				</DialogTitle>
				<DialogContent>
					<Inputs
						id={["driver_lic", "lic_exp_date"]}
						labels={["Driver License", "License Expiry"]}
						e_name={["driver_lic", "lic_exp_date"]}
						defaultValue={""}
						handleChange={handleChange}
					/>
				</DialogContent>
				<DialogActions>
					{/* to change handeler*/}
					<Button
						name="driver"
						variant="contained"
						style={{ backgroundColor: "lightcoral" }}
						onClick={handleDriverRegister}>
						Register
					</Button>
					<Button
						name="driver"
						variant="contained"
						style={{ backgroundColor: "lightcoral" }}
						onClick={handleDialogCancel}>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog open={ownerDialog}>
				<DialogTitle style={{ color: "#a9a9a9", fontWeight: "bold" }}>
					Enter Owner Information
				</DialogTitle>
				<DialogContent>
					<Inputs
						id={["insur_provider", "insur_exp_date"]}
						labels={["Insurance Provider", "Insurance Expiry"]}
						e_name={["insur_provider", "insur_exp_date"]}
						defaultValue={""}
						handleChange={handleChange}
					/>
				</DialogContent>
				<DialogActions>
					{/* to change handeler*/}
					<Button
						name="owner"
						variant="contained"
						style={{ backgroundColor: "lightcoral" }}
						onClick={handleOwnerRegister}>
						Register
					</Button>
					<Button
						name="owner"
						variant="contained"
						style={{ backgroundColor: "lightcoral" }}
						onClick={handleDialogCancel}>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={driverUpdateDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description">
				<DialogContent>
					<div className="text">{driverReg}</div>
				</DialogContent>
				<DialogActions>
					<Button
						name="driver_update"
						variant="contained"
						style={{ backgroundColor: "lightcoral" }}
						onClick={handleDialogCancel}>
						OK
					</Button>
				</DialogActions>
			</Dialog>

			<Dialog
				open={ownerUpdateDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description">
				<DialogContent>
					<div className="text">{ownerReg}</div>
				</DialogContent>
				<DialogActions>
					<Button
						name="owner_update"
						variant="contained"
						style={{ backgroundColor: "lightcoral" }}
						onClick={handleDialogCancel}>
						OK
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default Profile;
