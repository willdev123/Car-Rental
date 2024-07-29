import React from "react";
import "./driverRentList.scss";
import { useEffect, useState } from "react";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";

const DriverRentList = () => {
	const driverId = useLocation().pathname.split("/")[2];
	const [result, setResult] = useState([]);
	const [err, setErr] = useState("");
	const driverRentList = [
		"Car",
		"Category",
		"Number of seats",
		"Registration Number",
		"Start Date",
		"Return Date",
		"Total Cost",
		"status",
		"Customer Name",
		"Customer Phone",
	];

	const fetchDriverRents = async () => {
		try {
			const data = await makeRequest.get("/rents/driverRents/find/" + driverId);
			setResult(data.data);
		} catch (err) {
			setErr(err.response.data);
		}
	};

	useEffect(() => {
		fetchDriverRents();
	}, []);

	if (err !== "") {
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
		<div className="driverRentList">
			<div className="container">
				<table>
					<thead>
						<tr>
							{driverRentList.map((l) => {
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
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default DriverRentList;
