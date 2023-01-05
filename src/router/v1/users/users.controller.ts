import { Request, Response } from "express";
import { responses } from "../../../utils/responses";
import { sequelizeCfg } from "../../../models/postgresDB";
import { getOneUser } from "../../../models/users.model";

//Request Body Type form Middleware
import { TokenAuth } from "../../../middlewares/auth.middleware";
import { BodyPostOneUserType } from "../../../middlewares/users.middleware";

//utils
import { verifyTokenAndUserData } from "../../../utils/requestChecker";

export async function httpPostOneUser(req: Request, res: Response) {
  const tokenBody = (req as any).userData as TokenAuth;
  const { userid, email } = req.body as BodyPostOneUserType;

  console.log(tokenBody);

  if (!verifyTokenAndUserData(tokenBody, email, userid)) {
    return responses.res403(
      req,
      res,
      null,
      "User is unauthorized to access this resource"
    );
  }

  return await getOneUser(userid, email)
    .then((result) => {
      return responses.res200(req, res, {
        result,
      });
    })
    .catch((error) => {
      return responses.res500(req, res, null, error.toString());
    });
}
