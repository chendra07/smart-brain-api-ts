import { Request, Response, NextFunction } from "express";
import { z } from "zod";

import { responses } from "../utils/responses";

const zodBodyGetOneUser = z.object({
  userid: z.number(),
});

export type BodyGetOneUserType = z.infer<typeof zodBodyGetOneUser>;

export function verifyBody_GetOneUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (zodBodyGetOneUser.safeParse(req.body).success) {
    next();
  } else {
    responses.res400(req, res, null, "invalid request");
  }
}
