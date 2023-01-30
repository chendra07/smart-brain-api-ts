import jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;

type JWTBodyType = {
  email: string;
  userid: number;
};

export function signNewAccessToken(data: JWTBodyType) {
  return jwt.sign(data, JWT_SECRET!, {
    algorithm: "HS256",
    expiresIn: "20s",
  });
}
