import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { fromBuffer } from "file-type";

//Request Body Type form Middleware
import { BodyUpdateUser } from "../../../middlewares/users.middleware";

//models
import {
  deleteFileCloudinary,
  uploadFileCloudinary,
} from "../../../models/cloudinary.model";
import { getOneUser, updateOneUser } from "../../../models/users.model";
import { sequelizeCfg } from "../../../models/postgresDB";

//utils
import { responses } from "../../../utils/responses";
import { tokenType } from "../../../middlewares/auth.middleware";

export async function httpOneUser(req: Request, res: Response) {
  const { email, userid } = (req as any).tokenBody as tokenType;

  return await getOneUser(userid, email)
    .then((result) => {
      return responses.res200(req, res, result);
    })
    .catch((error) => {
      return responses.res500(req, res, null, error.toString());
    });
}

export async function httpUpdateUser(req: Request, res: Response) {
  const { email, userid } = (req as any).tokenBody as tokenType;

  const { newName, deleteImage, image64 } = req.body as BodyUpdateUser;
  let tempUrl: string | null | undefined;

  //get user data
  const user = await getOneUser(userid, email);

  //if delete image is true & user data have image uploaded, delete image from cloudinary
  if (deleteImage && user.image) {
    await deleteFileCloudinary(`${user.userid}-${user.name}`);
    tempUrl = null;
  }

  sequelizeCfg
    .transaction(async (t) => {
      //if image (request) is exists
      if (!deleteImage && image64) {
        //upload new image to cloudinary
        const result = await uploadFileCloudinary(image64, userid, newName);
        tempUrl = result.imageUrl;

        //if image in userData exists & newName !== old name,
        //delete cloudinary file
        if (user.image && newName !== user.name) {
          await deleteFileCloudinary(`${user.userid}-${user.name}`);
        }
      }

      await updateOneUser({ image: tempUrl, name: newName }, email, userid, t);

      return responses.res200(
        req,
        res,
        { image: tempUrl, name: newName },
        "user data updated successfully"
      );
    })
    .catch((error) => {
      return responses.res500(
        req,
        res,
        null,
        `Failed to update user data (${error})`
      );
    });
}
