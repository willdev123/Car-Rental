import { db } from "../connect.js";
import jwt from "jsonwebtoken";

const LIMIT = 5;

export const createCar = async (req, res) => {
	const q =
		"INSERT INTO cars (`brand`,`model`,`made`,`color`, `reg_num`, `category_id`, `owner_id`) VALUE (?)";

	const token = req.cookies.accessToken;

	if (!token) return res.status(401).json("Not authenticated!");

	jwt.verify(token, "secretkey", (err, userInfo) => {
		if (err) return res.status(403).json("Token is not valid!");
	});

	if (!req.body.category_id)
		return res.status(401).json("Category cannot be empty");
	const values = [
		req.body.brand,
		req.body.model,
		req.body.made,
		req.body.color,
		req.body.reg_num,
		req.body.category_id,
		req.body.owner_id,
	];

	try {
		await db.query(q, [values]);
		return res.status(200).json("Car created Successful!");
	} catch (err) {
		console.log(err.message);
		return res.status(500).json("Server Error!");
	}
};

export const getCars = async (req, res) => {
	let { page } = req.query;

	const owner_id = req.params.ownerId;
	const offset = (parseInt(page) - 1) * LIMIT;

	const q = `SELECT * FROM cars JOIN category ON cars.category_id = category.id WHERE owner_id = ? ORDER BY cars.created_date DESC LIMIT ? OFFSET ?`;

	const token = req.cookies.accessToken;

	if (!token) return res.status(401).json("Not authenticated!");

	jwt.verify(token, "secretkey", (err, userInfo) => {
		if (err) return res.status(403).json("Token is not valid!");
	});

	try {
		const result = await db.query(q, [owner_id, LIMIT, offset]);
		return res.status(200).json(result[0]);
	} catch (err) {
		console.log(err);
		return res.status(500).json("Server Error!");
	}
};

export const getAvailableCars = async (req, res) => {
	let { page } = req.query;

	const offset = (parseInt(page) - 1) * LIMIT;
	const q = `SELECT * FROM cars JOIN category ON cars.category_id = category.id WHERE cars.status = "available" ORDER BY cars.created_date DESC LIMIT ? OFFSET ?`;

	const token = req.cookies.accessToken;

	if (!token) return res.status(401).json("Not authenticated!");

	jwt.verify(token, "secretkey", (err, userInfo) => {
		if (err) return res.status(403).json("Token is not valid!");
	});

	try {
		const result = await db.query(q, [LIMIT, offset]);
		return res.status(200).json(result[0]);
	} catch (err) {
		console.log(err);
		return res.status(500).json("Server Error!");
	}
};
