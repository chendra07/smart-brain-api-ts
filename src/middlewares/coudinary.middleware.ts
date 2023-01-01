import { Request, Response, NextFunction } from "express";
import { UploadedFile } from "express-fileupload";
import { z } from "zod";

import { responses } from "../utils/responses";
import { extensionExtractor, matchExtension } from "../utils/extensionFunction";

const zodBodyUploadCloudinary = z.object({
  userid: z.number(),
});

export type BodyUploadCloudinary = z.infer<typeof zodBodyUploadCloudinary>;

export function verifyBody_UploadCloudinary(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const verifyBody = zodBodyUploadCloudinary.safeParse(req.body).success;

  if (verifyBody) {
    next();
  } else {
    return responses.res400(req, res, null, "Invalid request");
  }
}

export function verifyFiles_UploadCloudinary(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.files?.image) {
    return responses.res400(req, res, null, "No image detected");
  }

  const maxSize = 4000000; //1 MB = 1000000 Bytes (in decimal), max: 4 mb or 4,000,000 bytes
  const { image } = req.files;
  const userImage = image as UploadedFile;
  const ext = extensionExtractor(userImage.name) ?? "undefined";

  if (ext === "undefined") {
    return responses.res400(req, res, null, "Invalid file name");
  }

  if (matchExtension(ext[ext.length - 1], ["png", "jpg", "jpeg"])) {
    return responses.res400(req, res, null, "Invalid file extension");
  }

  if (userImage.size <= maxSize) {
    return responses.res400(req, res, null, "Maximum file limit is 4MB");
  }

  next();
}
