import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

import { responses } from "../utils/responses";

const zodBodyPostOneUser = z.object({
  userid: z.number(),
});

export type BodyPostOneUserType = z.infer<typeof zodBodyPostOneUser>;

export function verifyBody_PostOneUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const verifyZod = zodBodyPostOneUser.safeParse(req.body);

  if (!verifyZod.success) {
    return responses.res400(
      req,
      res,
      null,
      `invalid request ${fromZodError(verifyZod.error).message}`
    );
  }

  next();
}
