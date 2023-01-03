import { Request, Response } from "express";
import { responses } from "../../../utils/responses";
import { sequelizeCfg } from "../../../models/postgresDB";
import { getOneUser } from "../../../models/users.model";

//Request Body Type form Middleware
import { BodyPostOneUserType } from "../../../middlewares/users.middleware";

export async function httpPostOneUser(req: Request, res: Response) {
  const { userid } = req.body as BodyPostOneUserType;

  return await getOneUser(userid)
    .then((result) => {
      return responses.res200(req, res, {
        result,
      });
    })
    .catch((error) => {
      return responses.res500(req, res, null, error.toString());
    });
}
