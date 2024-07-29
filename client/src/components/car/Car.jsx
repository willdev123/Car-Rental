import "./car.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { makeRequest } from "../../axios";

import dayjs from "dayjs";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import React, { useState } from "react";

const Car = ({ data }) => {
	const param = useLocation().pathname.split("/")[1];
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const [date, setDate] = useState({
		startDate: dayjs(),
		endDate: dayjs(),
	});
	const [dateErr, setDateErr] = useState(null);
	const handleBook = () => {
		setOpen(true);
	};

	const handleDialogContinue = async () => {
		try {
			await makeRequest.post("/books/availableDrivers", {
				date: [
					date.startDate.format("YYYY-MM-DD"),
					date.endDate.format("YYYY-MM-DD"),
				],
			});
			setOpen(false);
			setDateErr(null);
			navigate("/bookDetail", {
				state: {
					date: date,
					data: data,
				},
			});
		} catch (error) {
			setDateErr(error.response.data);
		}
	};

	const handleDialogCancel = (async) => {
		setDate({
			startDate: dayjs(),
			endDate: dayjs(),
		});
		setOpen(false);
		setDateErr(null);
	};
	return (
		<div className="car">
			<div className="container">
				<img
					src="https://cdn.vectorstock.com/i/1000x1000/46/50/missing-picture-page-for-website-design-or-mobile-vector-27814650.webp"
					alt=""
				/>
				<div className="line"></div>
				<div className="right">
					<div className="header">
						{data.brand} {data.model}
					</div>
					<div className="content">
						<div className="content-left">
							<div className="made">Made: {data.made}</div>
							<div className="color">Color : {data.color}</div>
							<div className="reg_num">
								Registration Number : {data.reg_num}
							</div>
							{param === "carList" ? (
								<div className="status">Status : {data.status}</div>
							) : null}
						</div>
						<div className="content-right">
							<div className="cat_name">Category : {data.cat_name}</div>
							<div className="no_of_seat">
								Number of Seats : {data.no_of_seats}
							</div>
							<div className="cost_per_day">
								Cost Per Day: {data.cost_per_day} THB
							</div>
						</div>
					</div>
					{param === "carList" ? (
						<button
							className="info-button"
							onClick={() => navigate("/carRents/" + data.car_id)}>
							View Info
						</button>
					) : (
						<button className="book-button" onClick={handleBook}>
							Book
						</button>
					)}
				</div>
			</div>
			<Dialog open={open}>
				<DialogTitle style={{ color: "#a9a9a9", fontWeight: "bold" }}>
					Choose Start Date and End Date
				</DialogTitle>
				<DialogContent>
					<LocalizationProvider dateAdapter={AdapterDayjs}>
						<DemoContainer components={["DatePicker", "DatePicker"]}>
							<div
								className="content"
								style={{ display: "flex", alignItems: "center", gap: "10px" }}>
								<DesktopDatePicker
									minDate={dayjs()}
									defaultValue={dayjs()}
									value={date.startDate}
									onChange={(newValue) =>
										setDate((prev) => ({ ...prev, startDate: newValue }))
									}
								/>
								<div> To </div>
								<DesktopDatePicker
									minDate={dayjs()}
									value={date.endDate}
									defaultValue={dayjs()}
									onChange={(newValue) =>
										setDate((prev) => ({ ...prev, endDate: newValue }))
									}
								/>
							</div>
						</DemoContainer>
					</LocalizationProvider>
					{dateErr ? (
						<div style={{ color: "red", fontSize: "12px" }}>{dateErr}</div>
					) : null}
				</DialogContent>
				<DialogActions>
					<Button
						name="owner_update"
						variant="contained"
						style={{ backgroundColor: "lightcoral" }}
						onClick={handleDialogContinue}>
						Continue
					</Button>
					<Button
						name="owner_update"
						variant="contained"
						style={{ backgroundColor: "lightcoral" }}
						onClick={handleDialogCancel}>
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default Car;
