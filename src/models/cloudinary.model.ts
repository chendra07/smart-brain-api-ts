import dotenv from "dotenv";
import cloudinary from "cloudinary";

import { fromBuffer } from "file-type";

dotenv.config();
const { CLD_NAME, CLD_API_KEY, CLD_API_SECRET } = process.env;

const cloudinaryV2 = cloudinary.v2;

cloudinaryV2.config({
  cloud_name: CLD_NAME!,
  api_key: CLD_API_KEY!,
  api_secret: CLD_API_SECRET!,
});

export async function uploadFileCloudinary(
  image64: string,
  userId: number,
  userName: string
) {
  try {
    const base64Type = await fromBuffer(Buffer.from(image64, "base64"));
    //get the extension from base64 string
    const dataImagePrefix = `data:image/${base64Type!.ext};base64,`;

    const uploadedResponse = await cloudinaryV2.uploader.upload(
      `${dataImagePrefix}${image64}`,
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
