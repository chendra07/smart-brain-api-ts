import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import jwt from "jsonwebtoken";

//utils
import { responses } from "../../../utils/responses";
import { hashPassword, comparePassword } from "../../../utils/bcryptPassword";
import {
  signNewAccessToken,
  signNewRefreshToken,
} from "../../../utils/tokenJWT";

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
  BodyRefreshTokenType,
  QueryLogoutType,
} from "../../../middlewares/auth.middleware";

export async function httpPostRegister(req: Request, res: Response) {
  const { email, password, name } = req.body as BodyRegisterType;
  const image = req.files?.image as unknown as UploadedFile | null;
  let tempFileUrl: string | undefined;
  let tempFileName: string | undefined;

  sequelizeCfg
    .transaction(async (t) => {
      //insert to user table
      const userData = await createNewUser(name, email, t);

      //generate token
      const accessToken = signNewAccessToken({
        email,
      });
      const refreshToken = signNewRefreshToken({
        email,
      });

      //insert to login table
      await createNewLogin(
        {
          email: email,
          hash: hashPassword(password),
          userid: userData.userid!,
          refresh_token: refreshToken,
        },
        t
      );

      //if user send image when register, upload the image
      if (image) {
        const { userid, name } = userData;
        const { fileName, url } = await uploadFileCloudinary(
          image,
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
        image: image,
        name: name,
        accessToken,
        refreshToken,
      });
    })
    .catch(async (error) => {
      if (tempFileName) {
        //if registration failed and image has been uploaded, delete the file
        await deleteFileCloudinary(tempFileName);
        return responses.res500(req, res, null, error.toString());
      }
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

  //generate token
  const accessToken = signNewAccessToken({
    email: loginData.email,
  });
  const refreshToken = signNewRefreshToken({
    email: loginData.email,
  });

  //insert refresh token to db [login]
  sequelizeCfg
    .transaction(async (t) => {
      await updateLoginData(
        { refresh_token: refreshToken },
        loginData.email,
        t
      );
    })
    .catch((error) => {
      return responses.res500(req, res, null, error.toString());
    });

  //get user data
  const userData = await getOneUser(loginData.userid).then((result) => {
    const { userid, email, name, image } = result;
    return {
      userid,
      email,
      name,
      image,
    };
  });

  return responses.res200(
    req,
    res,
    {
      ...userData,
      accessToken,
      refreshToken,
    },
    "user login successfully"
  );
}

export async function httpRefreshToken(req: Request, res: Response) {
  const { refreshToken, email } = req.body as BodyRefreshTokenType;

  const userLoginData = await getOneLoginData(email);

  if (!userLoginData) {
    return responses.res404(req, res, null, "User not found");
  }

  if (!userLoginData.refresh_token) {
    return responses.res404(req, res, null, "No session found, please login.");
  }

  if (refreshToken !== userLoginData.refresh_token) {
    return responses.res403(req, res, null, "invalid refresh token");
  }

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!, (err, userData) => {
    if (err) {
      return responses.res403(
        req,
        res,
        null,
        "Token expired or invalid, please login again."
      );
    }

    const accessToken = signNewAccessToken({ refreshed_token: true, email });

    return responses.res200(req, res, { accessToken }, "token refreshed");
  });
}

export async function httpLogoutUser(req: Request, res: Response) {
  const { email } = req.query as QueryLogoutType;

  sequelizeCfg
    .transaction(async (t) => {
      await updateLoginData({ refresh_token: null }, email, t);
      return responses.res200(req, res, null, "Logout successful");
    })
    .catch((error) => {
      return responses.res500(req, res, null, error.toString());
    });
}

export async function httpDeleteUser(req: Request, res: Response) {
  const { email } = req.query as QueryLogoutType;

  sequelizeCfg
    .transaction(async (t) => {
      //performing soft delete actions in Logins & Users table:
      await updateLoginData({ isdeleted: true }, email, t);
      await updateUserData({ isdeleted: true }, email, t);

      return responses.res200(req, res, null, "User delete successfully");
    })
    .catch((error) => {
      return responses.res500(req, res, null, error.toString());
    });
}