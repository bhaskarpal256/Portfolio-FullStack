import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getPublicPortfolio } from "../controllers/public.controller.js"
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const router = Router();

router.route("/public").get(getPublicPortfolio);





export default router;
