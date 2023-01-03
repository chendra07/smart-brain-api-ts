import { Request, Response, NextFunction } from "express";
import { UploadedFile } from "express-fileupload";

import { responses } from "../utils/responses";
import { extensionExtractor, matchExtension } from "../utils/extensionFunction";

export function verifyFiles_UploadImage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.files?.image) {
    const maxSize = 4000000; //1 MB = 1000000 Bytes (in decimal), max: 4 mb or 4,000,000 bytes
    const { image } = req.files;
    const userImage = image as UploadedFile;
    const ext = extensionExtractor(userImage.name) ?? "undefined";

    //block request if name has no extension
    if (ext === "undefined") {
      return responses.res400(req, res, null, "Invalid file name");
    }

    //block request if extension is not png, jpg, or jpeg
    if (
      !matchExtension(ext[ext.length - 1].substring(1), ["png", "jpg", "jpeg"])
    ) {
      return responses.res400(req, res, null, "Invalid file extension");
    }

    //block request if size limit is more than 4 mb
    if (userImage.size >= maxSize) {
      return responses.res400(req, res, null, "Maximum file limit is 4MB");
    }
  }

  next();
}
