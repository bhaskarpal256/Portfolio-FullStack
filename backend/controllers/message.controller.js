import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Message } from "../models/message.model.js";
import { resend } from "../utils/email.js";

const createMessage = asyncHandler(async (req, res) => {
  // Get all the data required from the req i.e. Name, Email, Message (form from the front-end)

  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    throw new ApiError(400, "All fields are required!!!");
  }

  const createdMessage = await Message.create({
    name,
    email: email.trim(),
    subject,
    message,
  });

  try {
    const response = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: ["bhaskarpal256@gmail.com"],
      subject: `New Portfolio Message: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p>${message}</p>
      `,
    });

  } catch (error) {
    console.error("RESEND ERROR:", error);

    throw error;
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdMessage, "Message Sent Successfully!"));
});

const getAllMessages = asyncHandler(async (req, res) => {
  //This is an admin request

  const allMessages = await Message.find().sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, allMessages, "All Messages fetched successfully!"),
    );
});

const markMessageAsRead = asyncHandler(async (req, res) => {
  //This is an admin request, so the req. contains the id of a particular message
  //find the message on this basis of this id
  //Turn isRead to true

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "messageId is not a valid MongoDB ID!!!");
  }

  const message = await Message.findByIdAndUpdate(
    id,
    { isRead: true },
    { new: true },
  );

  if (!message) {
    throw new ApiError(400, "Message not found!!!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, message, "Message marked as Read Successfully!!!"),
    );
});

const deleteMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid message id");
  }

  const deletedMessage = await Message.findByIdAndDelete(id);

  if (!deletedMessage) {
    throw new ApiError(404, "Message not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        deletedMessage,
        "Message deleted successfully"
      )
    );
});

export { createMessage, getAllMessages, markMessageAsRead, deleteMessage };
