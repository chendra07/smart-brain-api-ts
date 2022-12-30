import { Request, Response, NextFunction } from "express";

import { responses } from "../utils/responses";

export function checkCloudinaryFile(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //checking extension, size
  if (false) {
    next();
  } else {
    console.log("Hello!!!!!");

    return responses.res500(req, res, null);
  }
}
