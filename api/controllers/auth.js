import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
	//CHECK USER IF EXISTS
	const q1 = "SELECT * FROM users WHERE email = ?";
	const q2 =
		"INSERT INTO users (`first_name`,`last_name`,`email`,`password`) VALUE (?)";

	try {
		const user = await db.query(q1, [req.body.email]);

		if (user[0].length) return res.status(400).json("User already exists!");

		const salt = bcrypt.genSaltSync(10);
		const hashedPassword = bcrypt.hashSync(req.body.password, salt);

		const values = [
			req.body.firstname,
			req.body.lastname,
			req.body.email,
			hashedPassword,
		];

		await db.query(q2, [values]);
		return res.status(200).json("Register Successful!");
	} catch (err) {
		console.log(err);
		return res.status(500).json("Server Error!");
	}
};

export const login = async (req, res) => {
	const q1 = "SELECT * FROM users WHERE email = ?";
	const q2 = "SELECT * FROM drivers where user_id = ?";
	const q3 = "SELECT * FROM owners where user_id = ?";
	const result = {};
	try {
		const user = await db.query(q1, [req.body.email]);

		if (user[0].length === 0) return res.status(404).json("User not found!");

		const checkPassword = bcrypt.compareSync(
			req.body.password,
			user[0][0].password,
		);
		if (!checkPassword) return res.status(400).json("Wrong password!");

		const token = jwt.sign({ id: user[0][0].id }, "secretkey");

		const { password, ...others } = user[0][0];
		Object.assign(result, { ...others });
		if (user[0][0].driver_status === 1) {
			const driver_res = await db.query(q2, [others.id]);
			Object.assign(result, { ...driver_res[0][0] });
		}
		if (user[0][0].owner_status === 1) {
			const owner_res = await db.query(q3, [others.id]);
			Object.assign(result, { ...owner_res[0][0] });
		}

		return res
			.cookie("accessToken", token, {
				httpOnly: true,
			})
			.status(200)
			.json(result);
	} catch (err) {
		console.log(err);
		return res.status(500).json("Server Error!");
	}
};

export const logout = (req, res) => {
	res
		.clearCookie("accessToken", {
			secure: true,
			sameSite: "none",
		})
		.status(200)
		.json("User has been logged out.");
};
