import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import cloudinary from "cloudinary";

const { CLD_NAME, CLD_API_KEY, CLD_API_SECRET } = process.env;

const cloudinaryV2 = cloudinary.v2;

cloudinaryV2.config({
  cloud_name: CLD_NAME,
  api_key: CLD_API_KEY,
  api_secret: CLD_API_SECRET,
});

function extensionFileExtractor(fileName: string) {
  return fileName.match(/\.[0-9a-z]+$/i);
}

export async function uploadCloudinary(
  req: Request,
  res: Response,
  profileId: string
) {
  try {
    console.log("message: ", req.body.message);

    if (!req.files) {
      throw new Error("No data uploaded!");
    }

    const dataImagePrefix = `data:image/png;base64,`;
    const { image } = req.files;

    const userFile = image as UploadedFile;

    console.log("ext: ", extensionFileExtractor(userFile.name)![0]);

    const base64File = userFile.data.toString("base64");

    const uploadedResponse = await cloudinaryV2.uploader.upload(
      `${dataImagePrefix}${base64File}`,
      {
        upload_preset: "smart-brain-dev",
        public_id: profileId,
      }
    );
    console.log("uploadedResponse: ", uploadedResponse);
    res.json({
      data: "Hi",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ err: "Failed!" });
  }
}
