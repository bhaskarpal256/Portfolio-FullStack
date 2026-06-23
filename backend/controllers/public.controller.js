import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Project } from "../models/project.model.js";
import { Resume } from "../models/resume.model.js";
import { Skill } from "../models/skill.model.js";

const getPublicPortfolio = asyncHandler(async (req, res) => {

    //Get the req as it will all be a get request fetch all the documents from all the db calls 
    // i.e. Project, Skill, Resume.

    const [projects, resume, skills] = await Promise.all([
        Project.find({ isFeatured: true }).sort({ createdAt: -1 }),
        Resume.findOne(),
        Skill.find({ isFeatured: true })
    ])

    if (!resume) {
        throw new ApiError(404, "Resume not found");
    }

    return res.status(200).json(new ApiResponse(200, {projects, resume, skills} , "Successfully fetched Project, Resume, Skill!"))

    
})


export {getPublicPortfolio}