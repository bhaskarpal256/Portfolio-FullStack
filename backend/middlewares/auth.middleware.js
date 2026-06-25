import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    // 1. Get token from either cookies OR Authorization header
    const authHeader = req.headers.authorization;

    const token =
      req.cookies?.accessToken ||
      (authHeader && authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null);

    if (!token) {
      throw new ApiError(401, "Unauthorized request - no token provided");
    }

    // 2. Verify token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedToken?._id) {
      throw new ApiError(401, "Invalid Access Token");
    }

    // 3. Find user
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "User not found / invalid token");
    }

    // 4. Attach user to request
    req.user = user;

    console.log("AUTH SUCCESS USER ID:", user._id);

    next();
  } catch (error) {
    throw new ApiError(
      401,
      error?.message || "Invalid or expired Access Token"
    );
  }
});