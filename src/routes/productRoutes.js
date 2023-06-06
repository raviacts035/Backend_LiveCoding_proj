import { Router } from "express";
import { isLogedIn } from "../middlewares/authMiddleware.js";
import { addProduct, updateProduct, getProducts, getProductById, getProductsByCollectionId, deleteProduct } from "../controllers/productController.js"


const productRouter= Router();

productRouter.get("/",getProducts);
productRouter.get("/:Id",getProductById);
productRouter.get("/collection/:Id",getProductsByCollectionId);
productRouter.post("/add/new", isLogedIn,addProduct);
productRouter.post("/update/:Id", isLogedIn,updateProduct);
productRouter.post("/delete/:Id", isLogedIn,deleteProduct);



export default productRouter;