import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { responses } from "../utils/responses";
import { passwordValidator } from "../utils/passwordValidator";

export function sessionChecker(
  req: Request,
  res: Response,
  next: NextFunction
) {
  //checking session
  console.log(`Session Checker: ${req.session.id}`);
  console.log(req.session);
  next();
  // if (req.session) {
  //     console.log(`Found User Session`);
  //     next();
  // } else {
  //     console.log(`No User Session Found`);
  //     res.redirect('/login');
  // }
}

const zodBodyLoginUser = z.object({
  email: z.string().max(100).email(),
  password: z.string().min(8),
});

export type BodyLoginUser = z.infer<typeof zodBodyLoginUser>;

export function verifyBody_loginUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const verifyZod = zodBodyLoginUser.safeParse(req.body).success;
  if (!verifyZod) {
    return responses.res400(req, res, null, "Invalid login body");
  }

  const { password } = req.body as BodyLoginUser;

  const verifyPass = passwordValidator(password);

  if (!verifyPass) {
    return responses.res400(
      req,
      res,
      null,
      "Password did not meet the requirement"
    );
  }

  next();
}
