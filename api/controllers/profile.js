import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser = async (req, res) => {
	const userId = req.params.userId;
	const q1 = "SELECT * FROM users where id = ?";
	const q2 = "SELECT * FROM drivers where user_id = ?";
	const q3 = "SELECT * FROM owners where user_id = ?";
	let result = {};

	try {
		const user_data = await db.query(q1, [userId]);
		if (user_data[0].length === 0)
			return res.status(404).json("Something Wrong!");

		const { password, ...others } = user_data[0][0];
		Object.assign(result, { ...others });

		if (user_data[0][0].driver_status === 1) {
			const driver_res = await db.query(q2, [userId]);
			Object.assign(result, { ...driver_res[0][0] });
		}

		if (user_data[0][0].owner_status === 1) {
			const owner_res = await db.query(q3, [userId]);
			Object.assign(result, { ...owner_res[0][0] });
		}

		return res.status(200).json(result);
	} catch (err) {
		console.log(err);
		return res.status(500).json("Server Error!");
	}
};

export const getDrivers = async (req, res) => {
	console.log(req.body.user_ids);
	const q =
		"SELECT * FROM users JOIN drivers ON users.id = drivers.user_id WHERE id IN (?)";

	try {
		const user = await db.query(q, [req.body.user_ids]);
		res.status(200).json(user[0]);
	} catch (err) {
		console.log(err);
		return res.status(500).json("Server Error!");
	}
};

export const updateUser = async (req, res) => {
	const q1 =
		"UPDATE users SET `first_name`=?, `last_name`=?, `email`=?, `address`=?, `phone_no`=? WHERE id=? ";
	const q2 =
		"UPDATE drivers SET `driver_lic`=?, `lic_exp_date`= ? WHERE user_id=? ";
	const q3 =
		"UPDATE owners SET `insur_provider`=?, `insur_exp_date`=? WHERE user_id=? ";
	const q4 = "SELECT * FROM users where id = ?";
	const token = req.cookies.accessToken;

	if (!token) return res.status(401).json("Not authenticated!");

	const userInfo = jwt.verify(token, "secretkey", (err, userInfo) => {
		if (err) return res.status(403).json("Token is not valid!");
		return userInfo;
	});

	try {
		await db.query(q1, [
			req.body.first_name,
			req.body.last_name,
			req.body.email,
			req.body.address,
			req.body.phone_no,
			userInfo.id,
		]);
		const user_data = await db.query(q4, [userInfo.id]);
		if (user_data[0][0].driver_status === 1) {
			await db.query(q2, [
				req.body.driver_lic,
				req.body.lic_exp_date.slice(0, 10),
				userInfo.id,
			]);
		}
		if (user_data[0][0].owner_status === 1) {
			await db.query(q3, [
				req.body.insur_provider,
				req.body.insur_exp_date.slice(0, 10),
				userInfo.id,
			]);
		}

		return res.status(200).json("Update Successful!");
	} catch (err) {
		console.log(err);
		return res.status(500).json("Server Error!");
	}
};

export const createDriver = async (req, res) => {
	const q1 =
		"INSERT INTO drivers (`user_id`, `driver_lic`, `lic_exp_date`) VALUE (?)";
	const token = req.cookies.accessToken;
	const q2 = "UPDATE users SET `driver_status`=? WHERE id=?";
	const q3 = "SELECT * from drivers where driver_lic = ?";
	if (!token) return res.status(401).json("Not authenticated!");

	const userInfo = jwt.verify(token, "secretkey", (err, userInfo) => {
		if (err) return res.status(403).json("Token is not valid!");
		return userInfo;
	});

	try {
		const driver = await db.query(q3, [req.body.driver_lic]);

		if (driver[0].length)
			return res.status(500).json("Invalid Licensce Number!!");

		await db.query(q1, [
			[userInfo.id, req.body.driver_lic, req.body.lic_exp_date],
		]);

		await db.query(q2, [1, userInfo.id]);
		return res.status(200).json("Driver Registration Successful!");
	} catch (err) {
		console.log(err);
		return res.status(500).json("Server Error!");
	}
};

export const createOwner = async (req, res) => {
	const q1 =
		"INSERT INTO owners (`user_id`, `insur_provider`, `insur_exp_date`) VALUE (?)";
	const q2 = "UPDATE users SET `owner_status`=? WHERE id=?";

	const token = req.cookies.accessToken;

	if (!token) return res.status(401).json("Not authenticated!");

	const userInfo = jwt.verify(token, "secretkey", (err, userInfo) => {
		if (err) return res.status(403).json("Token is not valid!");
		return userInfo;
	});

	try {
		await db.query(q1, [
			[userInfo.id, req.body.insur_provider, req.body.insur_exp_date],
		]);

		await db.query(q2, [1, userInfo.id]);
		return res.status(200).json("Owner Registration Successful!");
	} catch (err) {
		console.log(err);
		return res.status(500).json("Server Error!");
	}
};
