import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import { upload, uploadPdf } from "../middlewares/multer.middleware.js";
import { getResume, resumePdfUpdate, updateResume } from "../controllers/resume.controller.js";


const router = Router();

// Public Route
router.route("/").get(getResume);

// Admin Route

router.route("/").patch(verifyJWT, isAdmin, updateResume);
router.route("/update-pdf").patch(verifyJWT, isAdmin, uploadPdf.single("resumePdf"), resumePdfUpdate);



export default router;
