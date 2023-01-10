import { Request, Response } from "express";
import { sequelizeCfg } from "../../../models/postgresDB";
import { axiosRequest } from "../../../utils/axiosRequest";
import { responses } from "../../../utils/responses";

//model
import {
  findUserHistory,
  createHistoryEntry,
  deleteUserHistory,
} from "../../../models/history.model";

//types
import {
  BodyDetectFace,
  BodyViewUserHistory,
  QueryDeleteHistory,
} from "../../../middlewares/image.middleware";

import { TokenAuth } from "../../../middlewares/auth.middleware";

//utils
import { verifyTokenAndUserData } from "../../../utils/requestChecker";

const { CLARIFAI_USER_ID, CLARIFAI_APP_ID, CLARIFAI_API_KEY } = process.env;

export async function detectFaceAI(req: Request, res: Response) {
  const tokenBody = (req as any).userData as TokenAuth;
  const { imageUrl, email, userid } = req.body as BodyDetectFace;

  const MODEL_ID = "face-detection";

  if (!verifyTokenAndUserData(tokenBody, email, userid)) {
    return responses.res403(
      req,
      res,
      null,
      "User is unauthorized to access this resource"
    );
  }

  const body = {
    user_app_id: {
      user_id: CLARIFAI_USER_ID,
      app_id: CLARIFAI_APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: imageUrl,
          },
        },
      },
    ],
  };

  const headerCfg = {
    Authorization: "Key " + CLARIFAI_API_KEY,
  };

  sequelizeCfg
    .transaction(async (t) => {
      await createHistoryEntry(
        { date: new Date(), imageurl: imageUrl, userid },
        t
      );

      const imageResult = await axiosRequest
        .Post(
          `https://api.clarifai.com`,
          `/v2/models/${MODEL_ID}/outputs`,
          body,
          headerCfg
        )
        .then((result: any) => {
          return result.data.outputs[0].data;
        })
        .catch((error) => {
          throw new Error(error);
        });

      return responses.res200(req, res, imageResult);
    })
    .catch((error) => {
      return responses.res500(
        req,
        res,
        null,
        `[DB - history / Request Error] unable to process image, Note: ${error}`
      );
    });
}

export async function viewUserHistory(req: Request, res: Response) {
  const tokenBody = (req as any).userData as TokenAuth;
  const { email, userid, limit, skip } = req.body as BodyViewUserHistory;

  if (!verifyTokenAndUserData(tokenBody, email, userid)) {
    return responses.res403(
      req,
      res,
      null,
      "User is unauthorized to access this resource"
    );
  }

  const userHistory = await findUserHistory(userid, skip, limit);

  return responses.res200(req, res, userHistory);
}

export async function deleteHistory(req: Request, res: Response) {
  const tokenBody = (req as any).userData as TokenAuth;
  const { email, userid, historyid } = req.query as QueryDeleteHistory;

  if (!verifyTokenAndUserData(tokenBody, email, userid)) {
    return responses.res403(
      req,
      res,
      null,
      "User is unauthorized to access this resource"
    );
  }

  sequelizeCfg
    .transaction(async (t) => {
      await deleteUserHistory(parseInt(historyid), parseInt(userid), t);

      return responses.res200(req, res, null, "History deleted");
    })
    .catch((error) => {
      return responses.res500(req, res, null, error);
    });
}
