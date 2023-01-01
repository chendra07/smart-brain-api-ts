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

export async function uploadCloudinary(req: Request, res: Response) {
  try {
    console.log("message: ", req.body.message);

    if (!req.files) {
      throw new Error("No data uploaded!");
    }

    const { image } = req.files;
    const userFile = image as UploadedFile;
    const ext = extensionExtractor(userFile.name);

    //get the extension & removing "." (dot) from regex result
    const dataImagePrefix = `data:image/${ext![ext!.length - 1].substring(
      1
    )};base64,`;

    //convert image buffer to base64 string
    const base64File = userFile.data.toString("base64");

    const uploadedResponse = await cloudinaryV2.uploader.upload(
      `${dataImagePrefix}${base64File}`,
      {
        upload_preset: "smart-brain-dev",
        public_id: "1234-test",
      }
    );
    console.log("uploadedResponse: ", uploadedResponse);
    responses;
  } catch (error) {
    console.error(error);
    responses.res500(req, res, null, "Failed to upload image");
  }
}
