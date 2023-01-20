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
import { SessionType } from "../../../middlewares/auth.middleware";

const { CLARIFAI_USER_ID, CLARIFAI_APP_ID, CLARIFAI_API_KEY } = process.env;

export async function detectFaceAI(req: Request, res: Response) {
  const { userid } = req.session!.user as SessionType;
  const { imageUrl } = req.body as BodyDetectFace;

  const MODEL_ID = "face-detection";

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
  const { userid } = req.session!.user as SessionType;
  const { limit, skip } = req.body as BodyViewUserHistory;

  const userHistory = await findUserHistory(userid, skip, limit);

  return responses.res200(req, res, userHistory);
}

export async function deleteHistory(req: Request, res: Response) {
  const { userid } = req.session!.user as SessionType;
  const { historyid } = req.query as QueryDeleteHistory;

  const listOfHistoryid = historyid.split(",").map((id) => Number(id));

  sequelizeCfg
    .transaction(async (t) => {
      await deleteUserHistory(listOfHistoryid, userid, t);

      return responses.res200(req, res, null, "History deleted");
    })
    .catch((error) => {
      return responses.res500(req, res, null, error);
    });
}
