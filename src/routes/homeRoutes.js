import { Router } from "express";
import { HomeController } from "../controllers/HomeController.js";

const controller = new HomeController();
export const homeRouter = Router();

homeRouter.get("/", controller.index);
