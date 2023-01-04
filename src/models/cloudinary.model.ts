import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import cloudinary from "cloudinary";

import { responses } from "../utils/responses";
import { extensionExtractor } from "../utils/extensionFunction";

const { CLD_NAME, CLD_API_KEY, CLD_API_SECRET } = process.env;

const cloudinaryV2 = cloudinary.v2;

cloudinaryV2.config({
  cloud_name: CLD_NAME!,
  api_key: CLD_API_KEY!,
  api_secret: CLD_API_SECRET!,
});

export async function uploadFileCloudinary(
  image: UploadedFile,
  userId: number,
  userName: string
) {
  try {
    const ext = extensionExtractor(image.name);

    //get the extension & removing "." (dot) from regex result
    const dataImagePrefix = `data:image/${ext![ext!.length - 1].substring(
      1
    )};base64,`;

    //convert image buffer to base64 string
    const base64File = image.data.toString("base64");

    const uploadedResponse = await cloudinaryV2.uploader.upload(
      `${dataImagePrefix}${base64File}`,
      {
        upload_preset: "smart-brain-dev",
        public_id: `${userId}-${userName}`,
      }
    );

    return {
      url: uploadedResponse.url,
      fileName: `${userId}-${userName}`,
    };
  } catch (error) {
    console.error(error);

    throw new Error("[Cloudinary - Upload]: Failed to upload image");
  }
}

export async function deleteFileCloudinary(fileName: string) {
  try {
    await cloudinaryV2.uploader.destroy(
      "smart-brain-user-profiles/" + fileName
    );
  } catch (error) {
    throw new Error("[Cloudinary]: Failed to delete file");
  }
}
