import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import { createSkill, deleteSkill, getSkills, updateSkill } from "../controllers/skill.controller.js";
import { upload } from "../middlewares/multer.middleware.js";


const router = Router();


// Public Route
router.route("/").get(getSkills)

// Admin Route

router.route("/").post(verifyJWT, isAdmin, upload.single("icon"), createSkill);
router.route("/:id").patch(verifyJWT, upload.single("icon"), isAdmin, updateSkill);
router.route("/:id").delete(verifyJWT, isAdmin,  deleteSkill);



export default router;
