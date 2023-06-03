import { Router } from "express";
import {addBlog, updateBlog, getBlogs, addLike, deleteBlog} from "../controllers/blogController.js"
const router = Router();

router.post("/createBlog", addBlog);
router.get("/blogs", getBlogs);
router.post("/updateBlog", updateBlog);
router.get("/deleteBlog", deleteBlog);
router.post("/addLike", addLike);


export default router