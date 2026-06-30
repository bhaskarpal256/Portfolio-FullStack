import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "../routes/user.routes.js"
import projectRouter from "../routes/project.routes.js"
import skillRouter from "../routes/skill.routes.js"
import resumeRouter from "../routes/resume.routes.js"
import publicRouter from "../routes/public.routes.js"
import messageRouter from "../routes/message.routes.js"
import { errorHandler } from "../middlewares/error.middleware.js";


const app = express();

app.use(cors({
    origin: process.env.CORS,
    credentials: true
}))

app.use(express.json({
    limit: "16kb",
}))

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(express.static("public"));

app.use(cookieParser())


//route declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/projects", projectRouter)
app.use("/api/v1/skills", skillRouter);
app.use("/api/v1/resume", resumeRouter);
app.use("/api/v1", publicRouter);
app.use("/api/v1", messageRouter);

app.use(errorHandler);

export { app } 