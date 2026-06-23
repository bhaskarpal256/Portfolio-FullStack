import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Skill } from "../models/skill.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";

const getSkills = asyncHandler(async (req, res) => {
  //find the skills(empty) and sort them by the most recent added order(-1)
  //return the document


  const skills = await Skill.find().sort({ createdAt: -1 });

  if (!skills) {
    throw new ApiError(400, "Cannot get skills!!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, skills, "Fetched skills successfully!!!"));
});

const createSkill = asyncHandler(async (req, res) => {
  // Get all the required field from req.
  // Check if all of them exist
  // Make a db call (Skill model) to create a new Skill
  
  const { name, category, isFeatured } = req.body;

  const icon = req.file?.path;

  if (
    [name, category, icon].some(
      (key) => key === "" || key === null || key === undefined,
    )
  ) {
    throw new ApiError(400, "All fields are required!!!");
  }

  if (!icon) {
    throw new ApiError(400, "Skill icon is required!!!");
  }

  const uploadIconOnCloudinary = await uploadOnCloudinary(icon);

  if (!uploadIconOnCloudinary) {
    throw new ApiError(400, "Skill icon uploading failed on cloudinary");
  }

  const skill = await Skill.create({ name, category, isFeatured });

  if (!skill) {
    throw new ApiError(400, "Some error occurred while creating new skill!!!");
  }

  try {
    skill.icon = {
      url: uploadIconOnCloudinary.secure_url,
      public_id: uploadIconOnCloudinary.public_id,
    };
  } catch (error) {
    console.log("skill icon creation failed in DB", error);
  }

  await skill.save();

  return res
    .status(201)
    .json(new ApiResponse(201, skill, "Skill Created Successfully!"));
});

const updateSkill = asyncHandler(async (req, res) => {
  //Get the new data from req
  //Confirm that data with the allowedItems list to check which item is present

  const { id } = req.params;

  const icon = req.file?.path;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB ID!!!");
  }

  const skill = await Skill.findById(id);

  if (!skill) {
    throw new ApiError(400, "Skill doesn't exist!!!");
  }

  if (Object.keys(req.body).length === 0 && !icon) {
    throw new ApiError(400, "Cannot update skills details with empty data!!!");
  }

  const allowedFields = ["name", "category", "isFeatured"];

  const invalidFields = Object.keys(req.body).filter(
    (key) => !allowedFields.includes(key)
  );

  if (invalidFields.length > 0) {
    throw new ApiError(400, "Request contains invalid fields!!!");
  }

  const filteredFields = Object.fromEntries(
    Object.entries(req.body).filter(([key]) => allowedFields.includes(key)),
  );

  for (let [key, value] of Object.entries(filteredFields)) {
    if (value === "" || value === undefined || value === null) {
      throw new ApiError(400, `${key} can't be empty!!!`);
    }

    skill[key] = value;
  }

  const oldPublicId = skill.icon?.public_id;

  try {
    if (icon) {
      const uploadIconOnCloudinary = await uploadOnCloudinary(icon);
      skill.icon = {
        url: uploadIconOnCloudinary.secure_url,
        public_id: uploadIconOnCloudinary.public_id,
      };
    }
  } catch (error) {
    throw new ApiError(400, "Skill icon update failed on Cloudinary!!!", [
      error.message,
    ]);
  }

  await skill.save();

  if (icon && oldPublicId) {
    await deleteFromCloudinary(oldPublicId);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, skill, "Skill Updated Successfully!"));
});

const deleteSkill = asyncHandler(async (req, res) => {
  //Get the skill id from the req
  //Check if skill id is valid mongoose id
  //make a db call on the basis of the id
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid MongoDB ID!!!");
  }

  const skill = await Skill.findById(id);

  if (skill.icon?.public_id) {
    try {
      await deleteFromCloudinary(skill.icon?.public_id);
    } catch (error) {
      throw new ApiError(400, "Skill icon deletion from Cloudinary failed!!!");
    }
  }

  const deletedSkill = await Skill.findByIdAndDelete(id);

  if (!deletedSkill) {
    throw new ApiError(404, "Skill deletion failed!!!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { success: true }, "Skill Deleted Successfully!"),
    );
});

export { getSkills, createSkill, updateSkill, deleteSkill };
