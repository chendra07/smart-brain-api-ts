import { Request, Response } from "express";

//utils
import { responses } from "../../../utils/responses";
import { signNewAccessToken } from "../../../utils/tokenJWT";
import { hashPassword, comparePassword } from "../../../utils/bcryptPassword";

//models
import { sequelizeCfg } from "../../../models/postgresDB";
import {
  createNewLogin,
  getOneLogin,
  updateOneLogin,
} from "../../../models/login.model";
import {
  createOneUser,
  getOneUser,
  updateOneUser,
} from "../../../models/users.model";
import {
  uploadFileCloudinary,
  deleteFileCloudinary,
} from "../../../models/cloudinary.model";

//types
import {
  BodyRegisterType,
  BodyLoginType,
  BodyChangePassword,
  tokenType,
} from "../../../middlewares/auth.middleware";

export async function httpPostRegister(req: Request, res: Response) {
  const { email, password, name, image64 } = req.body as BodyRegisterType;
  let tempImageUrl: string | undefined;
  let tempFileName: string | undefined;

  sequelizeCfg
    .transaction(async (t) => {
      //insert to user table
      const newUser = await createOneUser(name, email, t);

      //generate token
      const accessToken = signNewAccessToken({
        email,
        userid: newUser.userid!,
      });

      //insert to login table
      await createNewLogin(
        {
          email: email,
          hash: hashPassword(password),
          userid: newUser.userid!,
        },
        t
      );

      //if user send image when register, upload the image
      if (image64) {
        const { userid, name } = newUser;
        const { fileName, imageUrl } = await uploadFileCloudinary(
          image64,
          userid!,
          name
        );
        tempImageUrl = imageUrl;
        tempFileName = fileName;
      }

      //update image field
      await updateOneUser(
        { name: name, image: tempImageUrl },
        email,
        newUser.userid,
        t
      );

      return responses.res201(req, res, {
        userid: newUser.userid,
        email: email,
        image: tempImageUrl,
        name: name,
        token: accessToken,
      });
    })
    .catch(async (error) => {
      if (tempFileName) {
        //if registration failed and image has been uploaded: delete the file
        await deleteFileCloudinary(tempFileName);
      }
      return responses.res500(req, res, null, error.toString());
    });
}

export async function httpPostLogin(req: Request, res: Response) {
  const { email, password } = req.body as BodyLoginType;

  const loginData = await getOneLogin(email);

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

    const accessToken = signNewAccessToken({
      email,
      userid: userid,
    });

    return {
      userid,
      email,
      name,
      image,
      token: accessToken,
    };
  });

  return responses.res200(req, res, userData, "user login successfully");
}

export async function httpDeleteUser(req: Request, res: Response) {
  const { email, userid } = (req as any).tokenBody as tokenType;

  sequelizeCfg
    .transaction(async (t) => {
      //performing soft delete actions in Logins & Users table:
      await updateOneLogin({ isdeleted: true }, email, userid, t);
      await updateOneUser({ isdeleted: true }, email, userid, t);

      return responses.res200(req, res, null, "User deleted successfully");
    })
    .catch((error) => {
      return responses.res500(req, res, null, error.toString());
    });
}

export async function httpChangePassword(req: Request, res: Response) {
  const { email, userid } = (req as any).tokenBody as tokenType;

  const { newPassword, oldPassword } = req.body as BodyChangePassword;

  const loginData = await getOneLogin(email);

  //if old password did not match the database: reject request
  if (!comparePassword(oldPassword, loginData.hash)) {
    return responses.res403(req, res, null, "Unable to update password");
  }

  //hash new pass
  const hashNewPass = hashPassword(newPassword);

  sequelizeCfg
    .transaction(async (t) => {
      await updateOneLogin({ hash: hashNewPass }, email, userid, t);

      return responses.res200(req, res, null, "password successfully updated");
    })
    .catch((error) => {
      return responses.res500(req, res, null, "Unable to update password");
    });
}
