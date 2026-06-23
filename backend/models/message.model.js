import mongoose,{Schema} from "mongoose";

const messageSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    subject: {
        type: String,
        default: "No Subject"
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    isRead: {
        type: Boolean,
        default: false,
        index: true
    }
}, {timestamps: true})

export const Message = mongoose.model("Message", messageSchema)