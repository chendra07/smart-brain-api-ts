import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { fromZodError } from "zod-validation-error";
import { responses } from "../utils/responses";
import { isPasswordValid } from "../utils/passwordValidator";
import { base64ImgCheck } from "../utils/base64Checker";

dotenv.config();
const { JWT_SECRET } = process.env;

// const zodSessionType = z.object({
//   email: z.string().max(100).email({ message: "invalid email format" }),
//   userid: z.number().positive(),
// });

// export type SessionType = z.infer<typeof zodSessionType>;

// export function verifySession(req: Request, res: Response, next: NextFunction) {
//   if (!req.session?.user) {
//     return responses.res401(
//       req,
//       res,
//       null,
//       "Session expired, please login again"
//     );
//   }
//   const verifyZod = zodSessionType.safeParse(req.session.user);

//   if (!verifyZod.success) {
//     console.log(fromZodError(verifyZod.error));

//     return responses.res400(
//       req,
//       res,
//       null,
//       `Invalid session please login again`
//     );
//   }

//   next();
// }

export type tokenType = {
  email: string;
  userid: number;
};

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  //if token exist, split the "bearer" and the token
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return responses.res401(
      req,
      res,
      null,
      "No token detected, please login or register first"
    );
  }

  //verify the token
  jwt.verify(token, JWT_SECRET!, (err, userData) => {
    if (err) {
      return responses.res403(
        req,
        res,
        null,
        "Token expire or invalid, try to refresh token or login"
      );
    }

    //store decoded token body to userData
    (req as any).userData = userData;
    next();
  });
}

//==========================================================================

const zodBodyLogin = z.object({
  email: z.string().max(100).email({ message: "invalid email format" }),
  password: z
    .string()
    .min(8, { message: "Password should be 8 characters or more" }),
});

export type BodyLoginType = z.infer<typeof zodBodyLogin>;

export function verifyBody_Login(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const verifyZod = zodBodyLogin.safeParse(req.body);
  if (!verifyZod.success) {
    return responses.res400(
      req,
      res,
      null,
      `Invalid body (${fromZodError(verifyZod.error).message})`
    );
  }

  const { password } = req.body as BodyLoginType;

  const verifyPass = isPasswordValid(password);

  if (!verifyPass) {
    return responses.res400(
      req,
      res,
      null,
      "Password did not meet the security requirement"
    );
  }

  next();
}

//==========================================================================

const zodBodyRegister = z.object({
  name: z.string(),
  email: z.string().email({ message: "invalid email format" }),
  password: z
    .string()
    .min(8, { message: "Password should be 8 characters or more" }),
  image64: z.string().optional(),
});

export type BodyRegisterType = z.infer<typeof zodBodyRegister>;

export async function verifyBody_Register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const verifyZod = zodBodyRegister.safeParse(req.body);
  if (!verifyZod.success) {
    return responses.res400(
      req,
      res,
      null,
      `Invalid register body (${fromZodError(verifyZod.error).message})`
    );
  }

  const { password, image64 } = req.body as BodyRegisterType;

  if (!isPasswordValid(password)) {
    return responses.res400(
      req,
      res,
      null,
      "Password did not meet the security requirement"
    );
  }

  //if base64 exists: check size & extension
  //if size or extension invalid: reject

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

//==========================================================================

const zodBodyChangePassword = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
});

export type BodyChangePassword = z.infer<typeof zodBodyChangePassword>;

export function verifyBody_ChangePassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const verifyZod = zodBodyChangePassword.safeParse(req.body);

  if (!verifyZod.success) {
    return responses.res400(
      req,
      res,
      null,
      `Invalid Body (${fromZodError(verifyZod.error).message})`
    );
  }

  const { newPassword, oldPassword } = req.body as BodyChangePassword;

  if (!isPasswordValid(newPassword) || !isPasswordValid(oldPassword)) {
    return responses.res400(
      req,
      res,
      null,
      "Password did not meet the security requirement"
    );
  }

  next();
}
