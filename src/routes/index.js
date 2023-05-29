import { Router } from "express";
import authRouter from "./authRoutes";

const router = Router();

router.post("/api/v1/auth", authRouter);


export default router