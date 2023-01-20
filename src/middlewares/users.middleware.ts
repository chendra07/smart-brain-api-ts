import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

import { responses } from "../utils/responses";

import { checkParsePositive } from "../utils/requestChecker";
import { base64ImgCheck } from "../utils/base64Checker";

//===================================================================================

const zodBodyUpdateUser = z.object({
  newName: z.string(),
  deleteImage: z.boolean(),
  image64: z.string().optional(),
});

export type BodyUpdateUser = z.infer<typeof zodBodyUpdateUser>;

export async function verifyBody_UpdateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const verifyZod = zodBodyUpdateUser.safeParse(req.body);

  if (!verifyZod.success) {
    console.log(req.body);
    console.log(verifyZod.success);

    return responses.res400(
      req,
      res,
      null,
      `invalid request ${fromZodError(verifyZod.error).message}`
    );
  }

  const { image64 } = req.body as BodyUpdateUser;

  if (image64 && !(await base64ImgCheck(image64))) {
    return responses.res400(
      req,
      res,
      null,
      "image64 extension must be png/jpg/jpeg and maximum size is 4 MB"
    );
  }

  next();
}
