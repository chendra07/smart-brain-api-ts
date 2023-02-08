import { compareSync, genSaltSync, hashSync } from "bcrypt";

const { BCRYPT_SALT } = process.env;

export function hashPassword(password: string) {
  const salt = genSaltSync(parseInt(BCRYPT_SALT!));
  const hash = hashSync(password, salt);
  return hash;
}

export function comparePassword(password: string, hash: string) {
  return compareSync(password, hash);
}
