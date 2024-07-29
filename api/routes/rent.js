import express from "express";
import {
	getDriverRents,
	getUserRents,
	getCarRents,
} from "../controllers/rent.js";

const router = express.Router();

router.get("/userRents/find/:userId", getUserRents);
router.get("/driverRents/find/:driverId", getDriverRents);
router.get("/carRents/find/:carId", getCarRents);

export default router;
