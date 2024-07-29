import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getAvailableDrivers = async (req, res) => {
	//Quries
	const q1 = `SELECT *
    FROM drivers
    WHERE driver_id NOT IN (
    SELECT driver_id
    FROM rent_info
    WHERE NOT (? > end_date OR ? < start_date)
    AND status = "rented")`;
	//Dates
	const startDate = req.body.date[0];
	const endDate = req.body.date[1];

	//Start Date Info
	const startDate_day = parseInt(startDate.split("-")[2]);
	const startDate_month = parseInt(startDate.split("-")[1]);
	const startDate_year = parseInt(startDate.split("-")[0]);

	//End Date Info
	const endDate_day = parseInt(endDate.split("-")[2]);
	const endDate_month = parseInt(endDate.split("-")[1]);
	const endDate_year = parseInt(endDate.split("-")[0]);

	const token = req.cookies.accessToken;
	if (!token) return res.status(401).json("Not authenticated!");

	jwt.verify(token, "secretkey", (err, userInfo) => {
		if (err) return res.status(403).json("Token is not valid!");
	});

	if (endDate_year < startDate_year)
		return res.status(400).json("Invalid Date Inputs!");
	if (endDate_year === startDate_year && endDate_month < startDate_month)
		return res.status(400).json("Invalid Date Inputs!");
	if (
		endDate_year === startDate_year &&
		endDate_month === startDate_month &&
		endDate_day < startDate_day
	)
		return res.status(400).json("Invalid Date Inputs!");

	try {
		const result = await db.query(q1, [startDate, endDate]);
		return res.status(200).json(result[0]);
	} catch (err) {
		console.log(err.message);
		return res.status(500).json("Server Error!");
	}
};

export const createRent = async (req, res) => {
	const q1 = `
    INSERT INTO rent_info (car_id, user_id, driver_id, start_date, end_date, total_cost) VALUES (?)`;
	const values = [
		req.body.car_id,
		req.body.user_id,
		req.body.driver_id,
		req.body.start_date,
		req.body.end_date,
		req.body.total_cost,
	];

	const token = req.cookies.accessToken;
	if (!token) return res.status(401).json("Not authenticated!");

	jwt.verify(token, "secretkey", (err, userInfo) => {
		if (err) return res.status(403).json("Token is not valid!");
	});
	try {
		await db.query(q1, [values]);
		return res.status(200).json("Booking Successful!");
	} catch (err) {
		console.log(err.message);
		return res.status(500).json("Server Error!");
	}
};

export const cancelBooking = async (req, res) => {
	const rent_id = req.body.rent_id;
	const q1 = `SELECT * from rent_info WHERE id = ?`;
	const q2 = `UPDATE rent_info SET status="canceled" WHERE id = ?`;
	const q3 = `UPDATE cars SET status="available" WHERE car_id = ? `;

	const token = req.cookies.accessToken;
	if (!token) return res.status(401).json("Not authenticated!");

	jwt.verify(token, "secretkey", (err, userInfo) => {
		if (err) return res.status(403).json("Token is not valid!");
	});

	try {
		const rent_info = await db.query(q1, [rent_id]);

		await db.query(q2, [rent_id]);
		await db.query(q3, [rent_info[0][0].car_id]);
		return res.status(200).json("Cancel Successful!");
	} catch (err) {
		console.log(err);
		return res.status(500).json("Server Error!");
	}
};
