import mongoose, { Schema } from "mongoose";

const skillSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    category: {
      type: String,
      enum: ["frontend", "backend", "database", "devops", "tools", "other"],
      default: "other",
      required: true,
    },

    icon: {
      url: { type: String, default: "" },       // Cloudinary URL
      public_id: { type: String, default: "" }, // Cloudinary public ID
    },

    isFeatured: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Skill = mongoose.model("Skill", skillSchema);



// import mongoose,{Schema} from "mongoose";

// const skillSchema = new Schema({
//     category: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     skills: [
//         {
//             name: {
//                 type: String,
//                 required: true
//             },
//             icon: {
//                 type: String,   //Cloudinary image url
//                 required: true
//             }
//         }
//     ]
// }, {timestamps: true})

// export const Skill = mongoose.model("Skill", skillSchema)