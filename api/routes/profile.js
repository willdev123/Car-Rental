import express from "express";
import {
	createDriver,
	createOwner,
	getDrivers,
	getUser,
	updateUser,
} from "../controllers/profile.js";

const router = express.Router();

router.get("/find/:userId", getUser);
router.put("/user", updateUser);
router.post("/driver", createDriver);
router.post("/owner", createOwner);
router.post("/drivers", getDrivers);

export default router;
