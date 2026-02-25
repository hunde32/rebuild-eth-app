import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (base64Image: string, folder: string) => {
  try {
    if (!base64Image) {
      throw new Error("No image data provided to uploadImage function");
    }

    const result = await cloudinary.uploader.upload(base64Image, { folder });
    return result.secure_url;
  } catch (error) {
    console.error("❌ Cloudinary Internal Error:", error);
    throw error;
  }
};
