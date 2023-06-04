import { Router } from "express";
import { logIn, signUp, getProfile, logout, deleteUser } from "../controllers/authControl.js";
import { isLogedIn } from "../middlewares/authMiddleware.js";


const authRouter = Router();

authRouter.post("/login", logIn);
authRouter.post("/signup", signUp)
authRouter.get("logout", logout);

authRouter.get("/profile", isLogedIn, getProfile);
authRouter.post("/deleteUser", deleteUser);



export default authRouter