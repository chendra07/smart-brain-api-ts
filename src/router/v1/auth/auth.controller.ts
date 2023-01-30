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
  let tempFileUrl: string | undefined;
  let tempFileName: string | undefined;

  sequelizeCfg
    .transaction(async (t) => {
      //insert to user table
      const userData = await createOneUser(name, email, t);

      //generate token
      const accessToken = signNewAccessToken({
        email,
        userid: userData.userid!,
      });

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
      await updateOneUser(
        { name: name, image: tempFileUrl },
        email,
        userData.userid,
        t
      );

      // req.session!.user = {
      //   userid: userData.userid,
      //   email: email,
      // };

      return responses.res201(req, res, {
        userid: userData.userid,
        email: email,
        image: tempFileUrl,
        name: name,
        token: accessToken,
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

    // req.session!.user = {
    //   userid,
    //   email,
    // };

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

//just delete JWT from client side
// export async function httpLogoutUser(req: Request, res: Response) {
//   //delete user's session
//   req.session = null;

//   return responses.res200(req, res, null, "session deleted");
// }

export async function httpDeleteUser(req: Request, res: Response) {
  const { email, userid } = (req as any).userData as tokenType;

  sequelizeCfg
    .transaction(async (t) => {
      //performing soft delete actions in Logins & Users table:
      await updateOneLogin({ isdeleted: true }, email, userid, t);
      await updateOneUser({ isdeleted: true }, email, userid, t);

      // req.session!.user = null;

      return responses.res200(req, res, null, "User deleted successfully");
    })
    .catch((error) => {
      return responses.res500(req, res, null, error.toString());
    });
}

export async function httpChangePassword(req: Request, res: Response) {
  const { email, userid } = (req as any).userData as tokenType;

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
