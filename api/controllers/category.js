import { db } from "../connect.js";

export const getCategory = async (req, res) => {
	const q = "SELECT * FROM category";

	try {
		const result = await db.query(q);
		return res.status(200).json(result[0]);
	} catch (err) {
		console.log(err);
		return res.status(500).json("Server Error!");
	}
};
