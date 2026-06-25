import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token",
    );
  }
};

const loginUser = asyncHandler(async (req, res) => {
  //get user details
  //validate if fields are not empty
  //check if user with username or email exists
  //check if the password matches
  //generate access and refresh token
  //send them through cookies
  //return user

  const { username, email, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "username or email is required!");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(400, "user with this username or email doesn't exist!");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid Password!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id,
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  //Options is used so that cookies can only be modified by the server without it (if false) even front-end can modify the cookies
  const options = {
  httpOnly: true,
  secure: true,        // MUST be HTTPS
  sameSite: "none"     // REQUIRED for cross-site
};

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in Successfully",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $unset: { refreshToken: 1 },
    });

    const options = {
  httpOnly: true,
  secure: true,        // MUST be HTTPS
  sameSite: "none"     // REQUIRED for cross-site
};
  } catch (error) {
    console.error(error);
    throw error;
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "User logged Out Successfully!!!"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  //Get the refresh token from the req
  //Verify/decode the refresh token in req
  //As the payload in the decoded refresh token contains the id of the user, make a db call with that id
  //Match if the refresh token in db is the same as the incomingRefreshToken
  //If matched generate new access & refresh token and send in the response

  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request!");
  }

  try {
    const decodedRefreshToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    if (!decodedRefreshToken) {
      throw new ApiError(
        400,
        "Some error occurred while verifying refresh token!",
      );
    }

    const user = await User.findById(decodedRefreshToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid user / refresh token!");
    }

    if (user?.refreshToken !== incomingRefreshToken) {
      user.refreshToken = undefined;
      await user.save({ validateBeforeSave: false });
      throw new ApiError(401, "Invalid refresh token!!");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    const options = {
  httpOnly: true,
  secure: true,        // MUST be HTTPS
  sameSite: "none"     // REQUIRED for cross-site
};

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken: newRefreshToken,
          },
          "Access token refreshed successfully!!!",
        ),
      );
  } catch (error) {
    throw new ApiError(
      401,
      error?.message || "Some Error Occurred while refreshing access token!",
    );
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  //Get old and new password from req.body
  //get user from req.user (as the current account should be logged in to change password)
  //Make a db call with user._id
  //Check user.isPasswordCorrect(oldPassword)
  //if(!isPasswordValid) throw error
  //user.password = newPassword;
  //user.save({validateBeforeSave: false})
  //send response with 200 , {}, and a message like "password changed successfully"

  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(401, "Invalid User");
  }

  const isPasswordValid = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid Old Password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully!!!"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(200, req.user, "Fetched current user successfully!!!"),
    );
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!fullName || !email) {
    throw new ApiError(401, "fullname or email is required");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullName,
        email,
      },
    },
    {
      new: true,
    },
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "Account Details Updated Successfully!!!"),
    );
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  //Get image file from the request(LocalFilePath)
  //delete the existing avatar image file from cloudinary
  //Upload new Avatar to cloudinary and store response in db
  //create response

  const newAvatarLocalPath = req.file?.path;

  if (!newAvatarLocalPath) {
    throw new ApiError(401, "New avatar local path not found!");
  }

  const user = await User.findById(req.user._id).select(
    "-password -refreshToken",
  );

  if (!user) {
    throw new ApiError(400, "Invalid User");
  }

  const deleteExistingAvatar = await deleteFromCloudinary(
    user.avatar?.public_id,
  );

  console.log(deleteExistingAvatar);

  if (!deleteExistingAvatar) {
    throw new ApiError(401, "Was not able to delete Existing Avatar!!!");
  }

  const uploadNewAvatar = await uploadOnCloudinary(newAvatarLocalPath);

  if (!uploadNewAvatar) {
    throw new ApiError(401, "Error while uploading avatar on cloudinary!");
  }

  user.avatar = {
    url: uploadNewAvatar.url,
    public_id: uploadNewAvatar.public_id,
  };

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, user, "avatar iamge updated successfully!"));
});

export {
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
};
