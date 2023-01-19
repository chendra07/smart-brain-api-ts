import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { responses } from "../utils/responses";
import { passwordValidator } from "../utils/passwordValidator";
import { checkParsePositive } from "../utils/requestChecker";
import { base64ImgCheck } from "../utils/base64Checker";

dotenv.config();
const { JWT_ACCESS_SECRET } = process.env;

const zodSessionType = z.object({
  email: z.string().max(100).email({ message: "invalid email format" }),
  userid: z.number().positive(),
});

export type SessionType = z.infer<typeof zodSessionType>;

export function verifySession(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.UserData) {
    return responses.res401(req, res, null);
  }

  const verifyZod = zodBodyLogin.safeParse(req.session.userData);

  if (!verifyZod.success) {
    return responses.res400(req, res, null, `Invalid session`);
  }

  next();
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

  const verifyPass = passwordValidator(password);

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

  if (!passwordValidator(password)) {
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

const zodQueryLogout = z.object({
  email: z.string().email(),
  userid: z.string(),
});

export type QueryLogoutType = z.infer<typeof zodQueryLogout>;

export function verifyQuery_Logout(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const verifyZod = zodQueryLogout.safeParse(req.query);

  if (!verifyZod.success) {
    return responses.res400(
      req,
      res,
      null,
      `Invalid Query (${fromZodError(verifyZod.error).message})`
    );
  }

  const logoutQuery = req.query as unknown as QueryLogoutType;

  if (!checkParsePositive(logoutQuery.userid)) {
    return responses.res400(
      req,
      res,
      null,
      `Invalid Query (userid should be a positive number)`
    );
  }

  next();
}

//==========================================================================

const zodQueryDeleteUser = z.object({
  email: z.string().email(),
  userid: z.string(),
});

export type QueryDeleteUserType = z.infer<typeof zodQueryLogout>;

export function verifyQuery_DeleteUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const verifyZod = zodQueryDeleteUser.safeParse(req.query);

  if (!verifyZod.success) {
    return responses.res400(
      req,
      res,
      null,
      `Invalid Query (${fromZodError(verifyZod.error).message})`
    );
  }

  const logoutQuery = req.query as unknown as QueryDeleteUserType;

  if (!checkParsePositive(logoutQuery.userid)) {
    return responses.res400(
      req,
      res,
      null,
      `Invalid Query (userid should be a positive number)`
    );
  }

  next();
}

//==========================================================================

const zodBodyChangePassword = z.object({
  email: z.string().email(),
  userid: z.number().positive(),
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

  if (!passwordValidator(newPassword) || !passwordValidator(oldPassword)) {
    return responses.res400(
      req,
      res,
      null,
      "Password did not meet the security requirement"
    );
  }

  next();
}
