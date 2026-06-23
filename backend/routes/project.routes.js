import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createProject, deleteProject, getProjectById, getProjects, updateProjectdetails, updateProjectImage } from "../controllers/project.controller.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const router = Router();

router.route("/").get(getProjects);

router.route("/:id").get(getProjectById);

//SECURED ROUTES

router.route("/").post(verifyJWT, isAdmin, upload.single("projectImage"), createProject);

router.route("/:id").patch(verifyJWT, isAdmin, updateProjectdetails)

router.route("/:id/image").patch(verifyJWT, isAdmin, upload.single("projectImage"), updateProjectImage)

router.route("/:id").delete(verifyJWT, isAdmin, deleteProject)




export default router;
