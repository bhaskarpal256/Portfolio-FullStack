import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Project } from "../models/project.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import mongoose from "mongoose";

const getProjects = asyncHandler(async (req, res) => {
  //To return all the projects make an empty find() query , it will return all the documents in the collection
  //sort is used with createdAt -1 to show the document in the descending manner, i.e., newest project to oldest

  const projects = await Project.find().sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, projects, "All projects fetched Successfully!!!"),
    );
});

const getProjectById = asyncHandler(async (req, res) => {
  //Get project id from req.params
  //Check if mongoDB id is valid , if not could throw a cast error
  //find the project in db on the basis of this id

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB ID!");
  }

  const project = await Project.findById(id);

  if (!project) {
    throw new ApiError(404, "Project doesn't exist!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Got Project by Id successfully!!!"));
});

const createProject = asyncHandler(async (req, res) => {
  //Get all the details required to create the project with the request

  const {
    title,
    description,
    techStack,
    githubLink,
    liveLink,
    isFeatured,
    category,
  } = req.body;

  const techStackArray =
    typeof techStack === "string"
      ? techStack
          .split(",")
          .map((text) => text.trim())
          .filter((value) => value.length > 0)
      : techStack;

  if (techStackArray.length === 0) {
    throw new ApiError(400, "Tech Used can't be empty!");
  }

  const isFeaturedFix =
    typeof isFeatured === "string"
      ? isFeatured.toLowerCase() === "true"
      : isFeatured;

  const projectImage = req.file?.path;

  if (!projectImage) {
    throw new ApiError(400, "Project thumbnail is required!");
  }

  const uploadProjectImage = await uploadOnCloudinary(projectImage);

  if (!uploadProjectImage) {
    throw new ApiError(404, "Upload to cloudinary failed/ uploadProjectImage");
  }

  const project = await Project.create({
    title,
    description,
    techStack: techStackArray,
    githubLink,
    liveLink,
    imageUrl: {
      url: uploadProjectImage.secure_url,
      public_id: uploadProjectImage.public_id,
    },
    isFeatured: isFeaturedFix,
    category,
  });

  if (!project) {
    throw new ApiError(400, "Was not able to create project!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, project, "Project Created Successfully!!!"));
});

const updateProjectdetails = asyncHandler(async (req, res) => {
  //Get all the new information that needs to be changed in req
  //validate that data

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(404, "Invalid Project ID!");
  }

  const project = await Project.findById(id);

  if (!project) {
    throw new ApiError(404, "Project doesn't exist!");
  }

if (!req.body || Object.keys(req.body).length === 0) {
    throw new ApiError(404, "Cannot update details with empty data!");
  }

  const allowedItems = [
    "title",
    "description",
    "techStack",
    "githubLink",
    "liveLink",
    "isFeatured",
    "category",
  ];

  const invalidKeys = Object.keys(req.body).filter(
    (key) => !allowedItems.includes(key),
  );

  if (invalidKeys.length > 0) {
    throw new ApiError(400, "Request contains invalid keys!");
  }

  //filter-in only the fields which are provided and included
  const filteredFields = Object.fromEntries(
    Object.entries(req.body).filter(([key]) => allowedItems.includes(key)),
  );

  const parseTechStack = (techStack) => {
    if (Array.isArray(techStack)) return techStack;

    if (typeof techStack === "string") {
      return techStack
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }

    return [];
  };

  if ("techStack" in filteredFields) {
    filteredFields.techStack = parseTechStack(filteredFields.techStack);

    if (filteredFields.techStack.length === 0) {
      throw new ApiError(400, "TechStack cannot be empty!");
    }
  }

  for (let [key, value] of Object.entries(filteredFields)) {
    if (value === "" || value === null || value === undefined) {
      throw new ApiError(400, `${key} can't be empty or null!`);
    }
  }

  Object.assign(project, filteredFields);
  await project.save();

  // const updatedProject = await Project.findByIdAndUpdate(id, filteredFields, {
  //   new: true,
  //   runValidators: true,
  // });

  // if (!updatedProject) {
  //   throw new ApiError(400, "Error while updating project!");
  // }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        project,
        "Project details updated successfully!!!",
      ),
    );
});

const updateProjectImage = asyncHandler(async (req, res) => {
  //Get the image file through multer in your request
  // delete the existing project image from cloudinary
  //upload image to cloudinary and get the response.url ( or .secure_url)
  //make a db call to replace with the new image url along with the publicID

  const { id } = req.params;

  const projectImage = req.file?.path;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB ID!!!");
  }

  if (!projectImage) {
    throw new ApiError(400, "ImageFile not found!!!");
  }

  const project = await Project.findById(id);

  if (!project) {
    throw new ApiError(404, "project not found!!!");
  }

  const uploadedImage = await uploadOnCloudinary(projectImage);

  if (!uploadedImage) {
    throw new ApiError(500, "Image upload failed!");
  }

  try {
    if (project.imageUrl.public_id) {
      await deleteFromCloudinary(project.imageUrl?.public_id);
    }
  } catch (err) {
    console.error(err);
  }

  project.imageUrl = {
    url: uploadedImage.secure_url,
    public_id: uploadedImage.public_id,
  };

  await project.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { image: project.imageUrl },
        "Project Image Successfully Updated!",
      ),
    );
});

const deleteProject = asyncHandler(async (req, res) => {
  // get the id of the project you want to delete
  //make a db call to find the project with that ID
  //Delete the project and send a success message as response

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Project-ID is not a valid MongoDB ID!");
  }

  const deletedProject = await Project.findByIdAndDelete(id);

  if (!deletedProject) {
    throw new ApiError(400, "Was not able to delete requested Project!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { deletedProject },
        "Project Successfully Deleted!!!",
      ),
    );
});

export {
  getProjects,
  getProjectById,
  createProject,
  updateProjectdetails,
  deleteProject,
  updateProjectImage,
};
