import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import {
  createMessage,
  deleteMessage,
  getAllMessages,
  markMessageAsRead,
} from "../controllers/message.controller.js";

const router = Router();

// Public Route

router.route("/public/message").post(createMessage);

// Admin Route

router.route("/messages").get(verifyJWT, isAdmin, getAllMessages);
router.route("/messages/:id/read").patch(verifyJWT, isAdmin, markMessageAsRead);
router.route("/messages/:id").delete(verifyJWT, isAdmin, deleteMessage);

export default router;
