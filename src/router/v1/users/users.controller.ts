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
import { getOneUser, updateUserData } from "../../../models/users.model";
import { sequelizeCfg } from "../../../models/postgresDB";

//utils
import { responses } from "../../../utils/responses";
import { SessionType } from "../../../middlewares/auth.middleware";

export async function httpOneUser(req: Request, res: Response) {
  const { email, userid } = req.session!.user as SessionType;

  return await getOneUser(userid, email)
    .then((result) => {
      return responses.res200(req, res, result);
    })
    .catch((error) => {
      return responses.res500(req, res, null, error.toString());
    });
}

export async function httpUpdateUser(req: Request, res: Response) {
  const { userid, email } = req.session!.user as SessionType;
  const { newName, deleteImage, image64 } = req.body as BodyUpdateUser;
  let tempUrl: string | null | undefined;

  // 6 scenarios:
  // 1: user want to update name & update image (ok)
  // 2: user want to update name & delete image (ok)
  // 3: user want to update name & but don't want to update the image (ok)
  // 4: user want to update name & but don't want to delete the image (ok)
  // 5: user don't want to update name, but update image (ok)
  // 6: user don't want to update name, but delete image (ok)

  //get user data
  const userData = await getOneUser(userid, email);

  //if delete image is true & user data have image uploaded, delete image from cloudinary
  if (deleteImage && userData.image) {
    await deleteFileCloudinary(`${userData.userid}-${userData.name}`);
    tempUrl = null;
  }

  sequelizeCfg
    .transaction(async (t) => {
      //if image (request) is exists
      if (!deleteImage && image64) {
        //upload new image to cloudinary
        const result = await uploadFileCloudinary(image64, userid, newName);
        tempUrl = result.url;

        //if image in userData exists & newName !== old name,
        //delete cloudinary file
        if (userData.image && newName !== userData.name) {
          await deleteFileCloudinary(`${userData.userid}-${userData.name}`);
        }
      }

      //update new data to db users
      await updateUserData({ image: tempUrl, name: newName }, email, userid, t);

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
