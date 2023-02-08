import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

import { responses } from "../utils/responses";
import { isStringOfNumber } from "../utils/requestChecker";

const zodBodyDetectFace = z.object({
  imageUrl: z.string().url(),
});

export type BodyDetectFace = z.infer<typeof zodBodyDetectFace>;

export function verifyBody_detectFace(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const verifyZod = zodBodyDetectFace.safeParse(req.body);

  if (!verifyZod.success) {
    return responses.res400(
      req,
      res,
      null,
      `Invalid body (${fromZodError(verifyZod.error).message})`
    );
  }

  next();
}

//===================================================

const zodBodyViewUserHistory = z.object({
  skip: z.number().gte(0),
  limit: z.number().positive(),
});

export type BodyViewUserHistory = z.infer<typeof zodBodyViewUserHistory>;

export function verifyBody_ViewUserHistory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const verifyZod = zodBodyViewUserHistory.safeParse(req.body);

  if (!verifyZod.success) {
    return responses.res400(
      req,
      res,
      null,
      `Invalid Body (${fromZodError(verifyZod.error).message})`
    );
  }

  next();
}

//===================================================

const zodQueryDeleteHistory = z.object({
  historyid: z.string(),
});

export type QueryDeleteHistory = z.infer<typeof zodQueryDeleteHistory>;

export function verifyQuery_DeleteHistory(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const verifyZod = zodQueryDeleteHistory.safeParse(req.query);

  if (!verifyZod.success) {
    return responses.res400(
      req,
      res,
      null,
      `Invalid Query (${fromZodError(verifyZod.error).message})`
    );
  }

  const query = req.query as QueryDeleteHistory;

  if (!isStringOfNumber(query.historyid)) {
    return responses.res400(
      req,
      res,
      null,
      `Invalid Query (please check your query again)`
    );
  }

  next();
}
