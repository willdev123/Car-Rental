import React from "react";
import "./carRentList.scss";
import { useEffect, useState } from "react";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";

const CarRentList = () => {
	const driverId = useLocation().pathname.split("/")[2];
	const [result, setResult] = useState([]);
	const [err, setErr] = useState("");
	const carRentList = [
		"Start Date",
		"Return Date",
		"Total Cost",
		"status",
		"Customer Name",
		"Customer Phone",
	];

	const fetchCarRents = async () => {
		try {
			const data = await makeRequest.get("/rents/carRents/find/" + driverId);
			console.log(data.data);
			setResult(data.data);
		} catch (err) {
			setErr(err.response.data);
		}
	};

	useEffect(() => {
		fetchCarRents();
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
		<div className="carRentList">
			<div className="container">
				<table>
					<thead>
						<tr>
							{carRentList.map((l) => {
								return <th>{l}</th>;
							})}
						</tr>
					</thead>
					<tbody id="tableBody">
						{result.map((r) => {
							return (
								<tr key={r.id}>
									<td>{r.start_date.slice(0, 10)}</td>
									<td>{r.end_date.slice(0, 10)}</td>
									<td>{r.total_cost} THB</td>
									<td>{r.status}</td>
									<td>{r.first_name}</td>
									<td>{r.phone_no}</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default CarRentList;
