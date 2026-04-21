import { Router } from "express";
import { OrderController } from "../controllers/OrderController.js";

const controller = new OrderController();
export const orderRouter = Router();

orderRouter.post("/", controller.create);
