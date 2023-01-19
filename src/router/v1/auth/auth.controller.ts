import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";

//utils
import { responses } from "../../../utils/responses";
import { hashPassword, comparePassword } from "../../../utils/bcryptPassword";
import { verifyTokenAndUserData } from "../../../utils/requestChecker";

//models
import { sequelizeCfg } from "../../../models/postgresDB";
import {
  createNewLogin,
  getOneLoginData,
  updateLoginData,
} from "../../../models/login.model";
import {
  createNewUser,
  getOneUser,
  updateUserData,
} from "../../../models/users.model";
import {
  uploadFileCloudinary,
  deleteFileCloudinary,
} from "../../../models/cloudinary.model";

//types
import {
  BodyRegisterType,
  BodyLoginType,
  QueryLogoutType,
  BodyChangePassword,
} from "../../../middlewares/auth.middleware";

export async function httpPostRegister(req: Request, res: Response) {
  const { email, password, name, image64 } = req.body as BodyRegisterType;
  let tempFileUrl: string | undefined;
  let tempFileName: string | undefined;

  sequelizeCfg
    .transaction(async (t) => {
      //insert to user table
      const userData = await createNewUser(name, email, t);

      //insert to login table
      await createNewLogin(
        {
          email: email,
          hash: hashPassword(password),
          userid: userData.userid!,
        },
        t
      );

      //if user send image when register, upload the image
      if (image64) {
        const { userid, name } = userData;
        const { fileName, url } = await uploadFileCloudinary(
          image64,
          userid!,
          name
        );
        tempFileUrl = url;
        tempFileName = fileName;
      }

      //update image field
      await updateUserData({ name: name, image: tempFileUrl }, email, t);

      return responses.res201(req, res, {
        userid: userData.userid,
        email: email,
        image: tempFileUrl,
        name: name,
      });
    })
    .catch(async (error) => {
      if (tempFileName) {
        //if registration failed and image has been uploaded, delete the file
        await deleteFileCloudinary(tempFileName);
      }
      return responses.res500(req, res, null, error.toString());
    });
}

export async function httpPostLogin(req: Request, res: Response) {
  const { email, password } = req.body as BodyLoginType;

  const loginData = await getOneLoginData(email);

  //verify password
  if (!loginData || !comparePassword(password, loginData.hash)) {
    return responses.res403(
      req,
      res,
      null,
      "your email or password are invalid"
    );
  }

  //get user data
  const userData = await getOneUser(loginData.userid, email).then((result) => {
    const { userid, email, name, image } = result;
    return {
      userid,
      email,
      name,
      image,
    };
  });

  return responses.res200(req, res, userData, "user login successfully");
}

export async function httpLogoutUser(req: Request, res: Response) {
  const { email, userid } = req.query as QueryLogoutType;
  req.session = null;

  return responses.res200(req, res, null, "session deleted");
}

export async function httpDeleteUser(req: Request, res: Response) {
  const { email, userid } = req.query as QueryLogoutType;

  sequelizeCfg
    .transaction(async (t) => {
      //performing soft delete actions in Logins & Users table:
      await updateLoginData({ isdeleted: true }, email, t);
      await updateUserData({ isdeleted: true }, email, t);

      return responses.res200(req, res, null, "User deleted successfully");
    })
    .catch((error) => {
      return responses.res500(req, res, null, error.toString());
    });
}

export async function httpChangePassword(req: Request, res: Response) {
  const { email, userid, newPassword, oldPassword } =
    req.body as BodyChangePassword;

  const loginData = await getOneLoginData(email);

  //if old password did not match the database: reject request
  if (!comparePassword(oldPassword, loginData.hash)) {
    return responses.res403(req, res, null, "Unable to update password");
  }

  //hash new pass
  const hashNewPass = hashPassword(newPassword);

  sequelizeCfg
    .transaction(async (t) => {
      await updateLoginData({ hash: hashNewPass }, email, t);
    })
    .catch((error) => {
      return responses.res500(req, res, null, "Unable to update password");
    });

  return responses.res200(
    req,
    res,
    null,
    "password successfully updated, please login again"
  );
}
