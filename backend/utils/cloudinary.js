import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    //  upload the file on cloudinary
    const isPDF = localFilePath.endsWith(".pdf");

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: isPDF ? "raw" : "image",
      folder: "uploads",
      use_filename: true,
      unique_filename: false,
      type: "upload",
      access_mode: "public",
    });
    //  file has been uploaded successfully
    // console.log("file uploaded on cloudinary!!!", response.url)
    console.log(response);
    console.log("TYPE:", response.type);
    console.log("RESOURCE TYPE:", response.resource_type);
    console.log("ACCESS MODE:", response.access_mode);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    return response;
  } catch (error) {
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    } // remove the locally saved temporary files as the upload operation get failed
    return null;
  }
};

const deleteFromCloudinary = async (public_id) => {
  try {
    if (!public_id) return null;
    const deleteResponse = await cloudinary.uploader.destroy(public_id);
    console.log("Deleted from Cloudinary: ", deleteResponse);
    return deleteResponse;
  } catch (error) {
    console.error("Cloudinary deletion error: ", error);
    return null;
  }
};
export { uploadOnCloudinary, deleteFromCloudinary };
