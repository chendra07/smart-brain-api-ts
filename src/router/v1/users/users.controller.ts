import { Request, Response } from "express";
import { responses } from "../../../utils/responses";
import { getAllUsers } from "../../../models/users.model";

export async function httpGetAllUsers(req: Request, res: Response) {
  const result = await getAllUsers();
  return responses.res200(req, res, {
    result,
  });
}
