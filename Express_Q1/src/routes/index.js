import { Router } from "express";
import { getPosts, addPost } from "../controllers/postController.js"

const router = Router();


router.get("/post", getPosts);
router.post("/createPost",addPost);


export default router