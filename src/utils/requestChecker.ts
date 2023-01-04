import { TokenAuth } from "../middlewares/auth.middleware";

export function checkParsePositive(target: string): boolean {
  const parsed = parseInt(target);
  if (Number.isNaN(parsed) || parsed < 0) {
    return false;
  }

  return true;
}

export function verifyTokenAndUserData(
  tokenBody: TokenAuth,
  email: string,
  userid: number | string
) {
  let verification = true;
  let id = userid;

  if (typeof id === "string") {
    id = parseInt(id);
  }

  if (tokenBody.email !== email) {
    verification = false;
  }

  if (tokenBody.userid !== id) {
    verification = false;
  }

  return verification;
}
