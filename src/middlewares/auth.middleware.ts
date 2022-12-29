import { Request, Response, NextFunction } from "express";

import { responses } from "../utils/responses";

export function verifyUserData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //checking id, name
  next();
}
