import { Router } from "express";
import { getPosts, addPost } from "../controllers/postController.js";
import authRouter from "./authRoutes.js";
import { isLogedIn } from "../middlewares/authMiddleware.js";


const router = Router();

router.use("/auth", authRouter);

router.get("/post", isLogedIn, getPosts);
router.post("/createPost",isLogedIn, addPost);

export default router