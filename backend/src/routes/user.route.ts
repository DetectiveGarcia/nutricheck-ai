import { Router } from "express";
import { checkAuth } from "../middleware/middleware.js";
import { registerUser, loginUser, refreshToken, getMe, getMyProducts, deleteUser } from "../controllers/users.controller.js";


const userRouter = Router();


userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/refreshToken", refreshToken);
userRouter.get("/me", checkAuth, getMe);
userRouter.get("/me/products", checkAuth, getMyProducts);
userRouter.get("/:id", deleteUser);

export default userRouter