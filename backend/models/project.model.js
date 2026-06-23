import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    techStack: [
      {
        type: String,
        required: true,
      },
    ],
    githubLink: {
      type: String,
      default: "",
    },
    liveLink: {
      type: String, //Link where the site is live as of now
      default: "",
    },
    imageUrl: {
      url: {
        type: String, //Cloudinary Url
        default: "",
      },
      public_id: {
        type: String, //cloudinary image public_id
      },
    },
    isFeatured: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      default: "Full Stack",
    },
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);
