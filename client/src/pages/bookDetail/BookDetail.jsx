import { useLocation, useNavigate } from "react-router-dom";
import "./bookDetail.scss";
import { useState, useEffect, useContext } from "react";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: 50 * 4.5 + 5,
			width: 400,
			overflowX: "scroll",
		},
	},
};
const BookDetail = () => {
	const { user } = useContext(AuthContext);
	const navigate = useNavigate();

	const { data, date } = useLocation().state;
	const [drivers, setDrivers] = useState([]);
	const [err, setErr] = useState(null);
	const [driver, setDriver] = useState({
		id: null,
		name: "",
		driver_lic: "",
		lic_exp_date: "",
		phone_no: "",
	});
	const [result, setResult] = useState(null);
	const [open, setOpen] = useState(false);
	const duration = date.endDate.diff(date.startDate, "d") + 1;
	const total_cost = data.cost_per_day * duration;

	useEffect(() => {
		const getDriver = async () => {
			const driver_result = await makeRequest.post("/books/availableDrivers", {
				date: [
					date.startDate.format("YYYY-MM-DD"),
					date.endDate.format("YYYY-MM-DD"),
				],
			});
			const user_ids = driver_result.data.map((d) => {
				return d.user_id;
			});
			if (driver_result.data.length > 0) {
				const user_result = await makeRequest.post("/users/drivers", {
					user_ids: user_ids,
				});
				setDrivers((prev) => [...prev, ...user_result.data]);
			}
		};
		getDriver();
	}, []);

	const handleCreate = async () => {
		try {
			const result = await makeRequest.post("/books/book", {
				car_id: data.car_id,
				user_id: user.id,
				driver_id: driver.id,
				start_date: date.startDate.format("YYYY-MM-DD"),
				end_date: date.endDate.format("YYYY-MM-DD"),
				total_cost: total_cost,
			});
			setResult(result.data);
			setOpen(true);
		} catch (err) {
			setErr(err.response.data);
		}
	};
	return (
		<div className="bookDetail">
			<div className="container">
				<h2>Booking Detail</h2>
				<div className="contents">
					<div className="left">
						<span>Car Info</span>
						<div className="items">
							<div className="item">
								Name -- {data.brand} {data.model}
							</div>
							<div className="item">Made -- {data.made}</div>
							<div className="item">Category -- {data.cat_name}</div>
							<div className="item">Registration Number -- {data.reg_num}</div>
							<div className="item">
								Cost Per Day -- {data.cost_per_day} THB
							</div>
						</div>
					</div>
					<div className="right">
						<span> Booking Info </span>
						<div className="items">
							<div className="item">Total Cost -- {total_cost} THB</div>
							<div className="item">
								Start Date -- {date.startDate.format("YYYY-MM-DD")}
							</div>
							<div className="item">
								Return Date -- {date.endDate.format("YYYY-MM-DD")}
							</div>
							<div className="item">
								<label htmlFor="category">Select Driver </label>

								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={driver}
									label="Drivers"
									className="select"
									onChange={(e) => setDriver(e.target.value)}
									MenuProps={MenuProps}>
									{drivers.length === 0 ? (
										<MenuItem disabled> No drivers Available!!</MenuItem>
									) : (
										drivers.map((d) => {
											return (
												<MenuItem
													key={d.driver_id}
													value={{
														id: d.driver_id,
														name: d.first_name + " " + d.last_name,
														driver_lic: d.driver_lic,
														lic_exp_date: d.lic_exp_date,
														phone_no: d.phone_no,
													}}>
													ID: {d.driver_id} / Driver Name: {d.first_name}
												</MenuItem>
											);
										})
									)}
								</Select>
							</div>
							{driver.id !== -1
								? drivers.map((d) => {
										if (d.driver_id === driver.id) {
											return (
												<div
													className="driver-info"
													style={{
														display: "flex",
														flexDirection: "column",
														gap: "20px",
													}}>
													<span>Driver Info</span>
													<div className="item">
														Driver Name -- {driver.name}
													</div>
													<div className="item">
														Driver License Number -- {driver.driver_lic}
													</div>
													<div className="item">
														License Expiry Date --
														{driver.lic_exp_date.slice(0, 10)}
													</div>
													<div className="item">
														Driver Phone number --
														{driver.phone_no}
													</div>
												</div>
											);
										}
								  })
								: null}
						</div>
					</div>
				</div>
			</div>
			<div className="buttons">
				<Button
					name="owner_update"
					variant="contained"
					style={{ backgroundColor: "green" }}
					onClick={handleCreate}>
					Confirm Booking
				</Button>
				<Button
					name="owner_update"
					variant="contained"
					style={{ backgroundColor: "red" }}
					onClick={() => {
						navigate(-1);
					}}>
					Back
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
							navigate(-1);
						}}>
						OK
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default BookDetail;
