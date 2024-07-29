import "./rentList.scss";
import { useLocation } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";
import { useEffect, useState } from "react";
import { makeRequest } from "../../axios";

const RentList = () => {
	const userId = useLocation().pathname.split("/")[2];
	const [open, setOpen] = useState(false);
	const [err, setError] = useState({
		fetchErr: "",
		cancelErr: "",
	});
	const [cancel, setCancel] = useState("");
	const [result, setResult] = useState([]);
	const userRentList = [
		"Car",
		"Category",
		"Number of seats",
		"Registration Number",
		"Start Date",
		"Return Date",
		"Total Cost",
		"Status",
		"Driver Name",
		"Driver Phone",
		"Actions",
	];

	const fetchUserRents = async () => {
		try {
			const data = await makeRequest.get("/rents/userRents/find/" + userId);
			setResult(data.data);
		} catch (err) {
			setError((prev) => ({ ...prev, fetchErr: err.response.data }));
		}
	};

	const handleCancel = async (e) => {
		setOpen(true);
		try {
			const result = await makeRequest.put("/books/cancelBook", {
				rent_id: e.target.value,
			});
			console.log(result.data);
			setCancel(result.data);
		} catch (err) {
			setError((prev) => ({ ...prev, cancelErr: err.response.data }));
		}
	};

	useEffect(() => {
		fetchUserRents();
	}, [open]);

	if (err.fetchErr !== "") {
		return (
			<div className="container-err">
				<div className="message">{err}</div>
			</div>
		);
	}

	if (result.length === 0) {
		return (
			<div className="container-err">
				<div className="message">"No rents to show!"</div>
			</div>
		);
	}
	return (
		<div className="rentList">
			<div className="container">
				<table>
					<thead>
						<tr>
							{userRentList.map((l) => {
								return <th>{l}</th>;
							})}
						</tr>
					</thead>
					<tbody id="tableBody">
						{result.map((d) => {
							return (
								<tr key={d.id}>
									<td>
										{d.brand} {d.model}
									</td>
									<td>{d.cat_name}</td>
									<td>{d.no_of_seats}</td>
									<td>{d.reg_num}</td>
									<td>{d.start_date.slice(0, 10)}</td>
									<td>{d.end_date.slice(0, 10)}</td>
									<td>{d.total_cost} THB</td>
									<td>{d.status}</td>
									<td>{d.first_name}</td>
									<td>{d.phone_no}</td>
									<td>
										<Button
											value={d.id}
											variant="contained"
											style={{ backgroundColor: "red" }}
											onClick={handleCancel}>
											Cancel
										</Button>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
			<Dialog
				open={open}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description">
				<DialogContent>
					<div className="text">{err.cancelErr ? err.cancelErr : cancel}</div>
				</DialogContent>
				<DialogActions>
					<Button
						variant="contained"
						style={{ backgroundColor: "lightcoral" }}
						onClick={() => {
							setOpen(false);
						}}>
						OK
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default RentList;
