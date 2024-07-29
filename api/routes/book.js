import express from "express";
import {
	cancelBooking,
	createRent,
	getAvailableDrivers,
} from "../controllers/book.js";

const router = express.Router();

router.post("/availableDrivers", getAvailableDrivers);
router.post("/book", createRent);
router.put("/cancelBook", cancelBooking);

export default router;
