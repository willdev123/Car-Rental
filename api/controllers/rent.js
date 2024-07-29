import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUserRents = async (req, res) => {
	const userId = req.params.userId;
	const q = `SELECT rent_info.id, cars.brand, cars.model, category.cat_name, category.no_of_seats, cars.reg_num, rent_info.start_date, rent_info.end_date, rent_info.total_cost, rent_info.status, users.first_name, users.phone_no FROM rent_info 
    JOIN cars ON rent_info.car_id = cars.car_id 
    JOIN drivers ON rent_info.driver_id = drivers.driver_id 
    JOIN users ON drivers.user_id = users.id 
    JOIN category ON cars.category_id = category.id WHERE rent_info.user_id = ? AND (rent_info.status = "rented" OR rent_info.status = "completed")`;

	const token = req.cookies.accessToken;
	if (!token) return res.status(401).json("Not authenticated!");

	jwt.verify(token, "secretkey", (err, userInfo) => {
		if (err) return res.status(403).json("Token is not valid!");
	});

	try {
		const result = await db.query(q, [userId]);
		return res.status(200).json(result[0]);
	} catch (err) {
		console.log(err.message);
		return res.status(500).json("Server Error!");
	}
};

export const getDriverRents = async (req, res) => {
	const driverId = req.params.driverId;
	const q = `SELECT rent_info.id, cars.brand, cars.model, category.cat_name, category.no_of_seats, cars.reg_num, rent_info.start_date, rent_info.end_date, rent_info.total_cost, rent_info.status, users.first_name, users.phone_no FROM rent_info 
    JOIN cars ON rent_info.car_id = cars.car_id 
    JOIN users ON rent_info.user_id = users.id 
    JOIN category ON cars.category_id = category.id WHERE rent_info.driver_id = ? `;

	const token = req.cookies.accessToken;
	if (!token) return res.status(401).json("Not authenticated!");

	jwt.verify(token, "secretkey", (err, userInfo) => {
		if (err) return res.status(403).json("Token is not valid!");
	});

	try {
		const result = await db.query(q, [driverId]);
		return res.status(200).json(result[0]);
	} catch (err) {
		console.log(err.message);
		return res.status(500).json("Server Error!");
	}
};

export const getCarRents = async (req, res) => {
	const carId = req.params.carId;
	const q = `SELECT rent_info.id, rent_info.start_date, rent_info.end_date, rent_info.total_cost, rent_info.status, users.first_name, users.phone_no 
	FROM rent_info JOIN users ON rent_info.user_id = users.id 
	WHERE rent_info.car_id = ? `;

	// const token = req.cookies.accessToken;
	// if (!token) return res.status(401).json("Not authenticated!");

	// jwt.verify(token, "secretkey", (err, userInfo) => {
	// 	if (err) return res.status(403).json("Token is not valid!");
	// });

	try {
		const result = await db.query(q, [carId]);
		return res.status(200).json(result[0]);
	} catch (err) {
		console.log(err.message);
		return res.status(500).json("Server Error!");
	}
};
