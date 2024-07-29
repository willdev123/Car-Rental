import mysql from "mysql2";

export const db = mysql
	.createConnection({
		host: "localhost",
		user: "root",
		password: "lonelone2022",
		database: "car_rental",
	})
	.promise();
