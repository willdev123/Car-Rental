import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dayjs from "dayjs";
import schedule from "node-schedule";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import categoryRoutes from "./routes/category.js";
import carRoutes from "./routes/car.js";
import bookRoutes from "./routes/book.js";
import rentRoutes from "./routes/rent.js";
import { db } from "./connect.js";

const app = express();

app.use((req, res, next) => {
	res.header("Access-Control-Allow-Credentials", true);
	next();
});
app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:3000",
	}),
);
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/users", profileRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/books", bookRoutes);

app.use("/api/rents", rentRoutes);

app.listen("5000", () => {
	console.log("Server is listening");
	console.log(dayjs().format("YYYY-MM-DD"));
	schedule.scheduleJob("0 * * * *", async () => {
		console.log("running script");
		const q1 = `SELECT id, car_id from rent_info  WHERE end_date <  ?`;

		const q2 = `UPDATE rent_info SET status= "completed" WHERE end_date < ? AND status = "rented"`;
		const q3 = `UPDATE cars SET status = "available" WHERE car_id IN (?)`;
		const q4 = `SELECT id, car_id from rent_info  WHERE start_date <=  ?`;
		const q5 = `UPDATE cars SET status = "rented" WHERE car_id IN (?)`;
		try {
			const car_id_available = await db.query(q1, [
				dayjs().format("YYYY-MM-DD"),
			]);
			const car_id_rented = await db.query(q4, [dayjs().format("YYYY-MM-DD")]);
			console.log(car_id_available[0]);
			console.log(car_id_rented[0]);
			const car_ids_available = car_id_available[0].map((c) => c.car_id);
			const car_ids_rented = car_id_rented[0].map((c) => c.car_id);
			await db.query(q2, [dayjs().format("YYYY-MM-DD")]);
			await db.query(q3, [car_ids_available]);
			await db.query(q5, [car_ids_rented]);

			console.log(car_ids_available);
			console.log(car_ids_rented);
		} catch (err) {
			console.log(err.message);
		}
	});
});
