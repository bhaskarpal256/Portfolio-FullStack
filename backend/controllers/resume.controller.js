import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Resume } from "../models/resume.model.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const getResume = asyncHandler(async (req, res) => {
  //Get the resume id from req
  //Make a db call to Resume(DB) to find the document on the basis of the id

  const resume = await Resume.findOne();

  if (!resume) {
    throw new ApiError(404, "Resume NOT FOUND!!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, resume, "Fetched Resume Successfully!"));
});

const updateResume = asyncHandler(async (req, res) => {
  //Get all the details from req
  //check if they're not invalid fields
  //check if they're not empty, null or undefined

  const {
    summary,
    skills,
    education,
    experience,
    certifications,
    links,
    languages,
  } = req.body;
  
  // JSON.parse(req.body);

  if (Object.entries(req.body).length === 0) {
    throw new ApiError(400, "Cannot update resume details with empty values");
  }

  const allowedFields = [
    "summary",
    "skills",
    "education",
    "experience",
    "certifications",
    "links",
    "languages",
  ];

  // if (req.body.languages) {
  //   JSON.parse(req.body.languages);
  // }

  const invalidFields = Object.keys(req.body).filter(
    (key) => !allowedFields.includes(key)
  );

  if (invalidFields.length > 0) {
    throw new ApiError(400, "Update data contains some invalid fields!!!");
  }

  const filteredFields = {};
  for (let key of allowedFields) {
    if (req.body[key] !== undefined && req.body[key] !== null) {
      filteredFields[key] = req.body[key];
    }
  }

  if (filteredFields.summary !== undefined && (filteredFields.summary === "" || filteredFields.summary.trim().length < 30)) {
    throw new ApiError(400, "Summary is required and must be at least 30 characters!!!");
  }

  let resume = await Resume.findOne();

  if (!resume) {
    resume = await Resume.create(filteredFields);
  } else {
    Object.assign(resume, filteredFields);
    await resume.save();
  }

  //   const resume = await Resume.updateOne({
  //     summary,
  //     skills,
  //     education,
  //     experience,
  //     certifications,
  //     links,
  //     languages
  // });


  return res
    .status(200)
    .json(new ApiResponse(200, resume, "Resume Details Updated Successfully!"));
});

const resumePdfUpdate = asyncHandler(async (req, res) => {
  //Get the file from req
  //upload the file on cloudinary
  //then try to delete the old resume pdf from cloudinary
  //Make a db call for Resume to update the link and public id of the new uploaded resume pdf

  const resumePdf = req.file?.path;

  if (req.file.mimetype !== "application/pdf") {
  throw new ApiError(400, "Only PDF files are allowed");
}


  if (!resumePdf) {
    throw new ApiError(400, "New pdf not found!");
  }

  const resume = await Resume.findOne();

  if (resume === null) {
    throw new ApiError(404, "Resume does not exist!!!");
  }

  const uploadResumeOnCloudinary = await uploadOnCloudinary(resumePdf);

  if (!uploadResumeOnCloudinary) {
    throw new ApiError(400, "File upload failed on Cloudinary!!!");
  }

  try {
    if (resume.resumePdf?.public_id) {
      await deleteFromCloudinary(resume.resumePdf?.public_id);
    }
  } catch (err) {
    console.error(err);
  }

  resume.resumePdf = {
    url: uploadResumeOnCloudinary.secure_url,
    public_id: uploadResumeOnCloudinary.public_id,
  };

  await resume.save();

  return res
    .status(200)
    .json(new ApiResponse(200, resume, "Resume PDF updated Successfully!"));
});

export { getResume, updateResume, resumePdfUpdate };
