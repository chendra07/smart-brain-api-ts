import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

import { responses } from "../utils/responses";
import { checkParsePositive } from "../utils/requestChecker";

// export function verifyFiles_UploadImage(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   if (req.files?.image) {
//     const maxSize = 4000000; //1 MB = 1000000 Bytes (in decimal), max: 4 mb or 4,000,000 bytes
//     const { image } = req.files;
//     const userImage = image as UploadedFile;
//     const ext = extensionExtractor(userImage.name) ?? "undefined";

//     //block request if name has no extension
//     if (ext === "undefined") {
//       return responses.res400(req, res, null, "Invalid file name");
//     }

//     //block request if extension is not png, jpg, or jpeg
//     if (
//       !matchExtension(ext[ext.length - 1].substring(1), ["png", "jpg", "jpeg"])
//     ) {
//       return responses.res400(req, res, null, "Invalid file extension");
//     }

//     //block request if size limit is more than 4 mb
//     if (userImage.size >= maxSize) {
//       return responses.res400(req, res, null, "Maximum file limit is 4MB");
//     }
//   }

//   next();
// }

//===================================================

const zodBodyDetectFace = z.object({
  imageUrl: z.string().url(),
  userid: z.number().positive(),
  email: z.string().email(),
});

export type BodyDetectFace = z.infer<typeof zodBodyDetectFace>;

export function verifyBody_detectFace(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const verifyZod = zodBodyDetectFace.safeParse(req.body);

  if (!verifyZod.success) {
    return responses.res400(
      req,
      res,
      null,
      `Invalid body (${fromZodError(verifyZod.error).message})`
    );
  }

  next();
}

//===================================================

const zodBodyViewUserHistory = z.object({
  email: z.string().email(),
  userid: z.number().positive(),
  skip: z.number().gte(0),
  limit: z.number().positive(),
});

export type BodyViewUserHistory = z.infer<typeof zodBodyViewUserHistory>;

export function verifyBody_ViewUserHistory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const verifyZod = zodBodyViewUserHistory.safeParse(req.body);

  if (!verifyZod.success) {
    return responses.res400(
      req,
      res,
      null,
      `Invalid Body (${fromZodError(verifyZod.error).message})`
    );
  }

  next();
}

//===================================================

const zodQueryDeleteHistory = z.object({
  email: z.string().email(),
  userid: z.string(),
  historyid: z.string(),
});

export type QueryDeleteHistory = z.infer<typeof zodQueryDeleteHistory>;

export function verifyQuery_DeleteHistory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const verifyZod = zodQueryDeleteHistory.safeParse(req.query);

  if (!verifyZod.success) {
    return responses.res400(
      req,
      res,
      null,
      `Invalid Query (${fromZodError(verifyZod.error).message})`
    );
  }

  const query = req.query as QueryDeleteHistory;

  if (!checkParsePositive(query.userid)) {
    return responses.res400(
      req,
      res,
      null,
      "userid should be number and positive value"
    );
  }

  if (!checkParsePositive(query.historyid)) {
    return responses.res400(
      req,
      res,
      null,
      "historyid should be number and positive value"
    );
  }

  next();
}

//===================================================

const zodBodyDummy = z.object({
  image64: z.string(),
});

export type BodyDummy = z.infer<typeof zodBodyDummy>;
