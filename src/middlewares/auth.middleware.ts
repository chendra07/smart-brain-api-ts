import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";
import { responses } from "../utils/responses";
import { passwordValidator } from "../utils/passwordValidator";
import { checkParsePositive } from "../utils/requestChecker";

dotenv.config();
const { JWT_ACCESS_SECRET } = process.env;

export type TokenAuth = {
  refreshed_token?: boolean | undefined;
  email: string;
  userid: number;
  iat: number;
  exp: number;
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
  jwt.verify(token, JWT_ACCESS_SECRET!, (err, userData) => {
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
});

export type BodyRegisterType = z.infer<typeof zodBodyRegister>;

export function verifyBody_Register(
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

  const { password } = req.body as BodyRegisterType;

  if (!passwordValidator(password)) {
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

const zodBodyRefreshToken = z.object({
  refreshToken: z.string(),
  email: z.string().email(),
  userid: z.number().positive(),
});

export type BodyRefreshTokenType = z.infer<typeof zodBodyRefreshToken>;

export function verifyBody_RefreshToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const verifyZod = zodBodyRefreshToken.safeParse(req.body);

  if (!verifyZod.success) {
    return responses.res400(
      req,
      res,
      null,
      `invalid body (${fromZodError(verifyZod.error).message})`
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
