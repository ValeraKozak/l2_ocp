import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";

const controller = new AuthController();
export const authRouter = Router();

authRouter.post("/", controller.register);
