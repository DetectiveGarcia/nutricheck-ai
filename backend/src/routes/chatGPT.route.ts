import { Router } from "express";
import { chatGPTController } from "../controllers/chatgpt.controller.js";
import { checkAuth } from "../middleware/middleware.js";

const chatGPTRouter = Router()

chatGPTRouter.post('/askChatGPT', checkAuth, chatGPTController)

export default chatGPTRouter