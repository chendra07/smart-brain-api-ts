import { Request, Response } from "express";
import { responses } from "../../../utils/responses";
import { sequelizeCfg } from "../../../models/postgresDB";
import { getAllUser, getOneUser } from "../../../models/users.model";

//Request Body Type form Middleware
import { BodyGetOneUserType } from "../../../middlewares/users.middleware";

export async function httpGetAllUsers(req: Request, res: Response) {
  return await getAllUser()
    .then((result) => {
      return responses.res200(req, res, {
        result,
      });
    })
    .catch((error) => {
      console.error(error);

      return responses.res500(req, res, null, error);
    });
}

export async function httpGetOneUser(req: Request, res: Response) {
  const { userid } = req.body as BodyGetOneUserType;

  return await getOneUser(userid)
    .then((result) => {
      return responses.res200(req, res, {
        result,
      });
    })
    .catch((error) => {
      return responses.res500(req, res, null, error);
    });
}
