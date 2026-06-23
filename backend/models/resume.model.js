import mongoose, { Schema } from "mongoose";

const educationSchema = new Schema({
  institution: { type: String, required: true, trim: true },
  degree: { type: String, required: true, trim: true },
  fieldOfStudy: { type: String, trim: true },
  startYear: { type: Number, required: true },
  endYear: { type: Number }, // null → ongoing
  grade: { type: String, trim: true },
  description: { type: String, trim: true },
});

const experienceSchema = new Schema({
  company: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: ["internship", "full-time", "part-time", "freelance", "other"],
    default: "full-time",
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date }, // null → still working
  location: { type: String, trim: true },
  responsibilities: [{ type: String, trim: true }],
});

const resumeSchema = new Schema(
  {
    summary: {
      type: String,
      required: true,
      minlength: 30,
      trim: true,
    },

    skills: [
      {
        skill: {
          type: Schema.Types.ObjectId,
          ref: "Skill",
          required: true,
        },
        level: {
          type: String,
          enum: ["beginner", "intermediate", "advanced", "expert"],
          required: true,
        },
        rating: {
          type: Number,
          min: 1,
          max: 10,
          default: 7,
        },
      },
    ],

    education: [educationSchema],

    experience: [experienceSchema],

    certifications: [
      {
        title: { type: String, required: true, trim: true },
        issuer: { type: String, trim: true },
        date: { type: Date },
        url: { type: String, trim: true },
      },
    ],

    resumePdf: {
      url: { type: String, required: true },
      public_id: { type: String },
    },

    links: {
      website: { type: String, trim: true },
      github: { type: String, trim: true },
      linkedin: { type: String, trim: true },
      twitter: { type: String, trim: true },
      instagram: { type: String, trim: true },
    },

    languages: [
      {
        name: { type: String, trim: true },
        proficiency: {
          type: String,
          enum: ["basic", "conversational", "fluent", "native"],
        },
      },
    ],
  },
  { timestamps: true },
);

export const Resume = mongoose.model("Resume", resumeSchema);

// import mongoose, { Schema } from "mongoose";

// const resumeSchema = new Schema(
//   {
//     about: {
//       name: String,
//       title: String, // Full Stack Developer
//       description: String, //Short bio
//       email: String,
//       phone: String,
//       location: String,
//       resumeUrl: String, // Cloudinary PDF Url
//       profileImage: String, // Cloudinary image Url
//       socialLinks: {
//         github: String,
//         linkedIn: String,
//         twitter: String,
//       },
//     },
//     education: [
//       {
//         institution: String,
//         degree: String,
//         StartDate: Date,
//         endDate: Date,
//         grade: String, //optional: CGPA or percentage
//         description: String,
//       },
//     ],
//     experiences: [
//       {
//         company: String,
//         position: String,
//         StartDate: Date,
//         endDate: Date, // can be null if "Present"
//         description: String,
//         location: String,
//       },
//     ],
//     certifications: [
//       {
//         name: String,
//         issuer: String,
//         date: Date,
//         credentialUrl: String, // certification url
//       },
//     ],
//   },
//   { timestamps: true }
// );

// export const Resume = mongoose.model("Resume", resumeSchema);
