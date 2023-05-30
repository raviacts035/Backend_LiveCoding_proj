import { Router } from "express";
import authRouter from "./authRoutes.js";

const router = Router();

router.post("/auth", authRouter);


export default router