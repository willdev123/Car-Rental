import express from "express";
import { createCar, getCars, getAvailableCars } from "../controllers/car.js";

const router = express.Router();

router.post("/", createCar);
router.get("/find/:ownerId", getCars);
router.get("/find", getAvailableCars);

export default router;
