import { Router } from "express";
import { logIn, signUp, getProfile, logout, forgotPassword, resetPassword } from "../controllers/authControl.js";
import { isLogedIn } from "../middlewares/authMiddleware.js";


const authRouter = Router();

authRouter.post("/login", logIn);
authRouter.post("/signup", signUp)
authRouter.get("logout", logout);
authRouter.get("/password/forgot", forgotPassword);
authRouter.post("/password/reset/:token", resetPassword);
authRouter.get("/profile", isLogedIn, getProfile);



export default authRouter