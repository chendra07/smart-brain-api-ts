import jwt from "jsonwebtoken";

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = process.env;

type JWTBodyType = {
  refreshed_token?: boolean;
  email: string;
  userid: number;
};

export function signNewAccessToken(data: JWTBodyType) {
  return jwt.sign(data, JWT_ACCESS_SECRET!, {
    algorithm: "HS256",
    expiresIn: "10m",
  });
}

export function signNewRefreshToken(data: JWTBodyType) {
  return jwt.sign(data, JWT_REFRESH_SECRET!, {
    algorithm: "HS256",
    expiresIn: "7d",
  });
}

export function signRefreshedAccessToken(data: JWTBodyType) {
  return jwt.sign({ ...data, refreshedToken: true }, JWT_ACCESS_SECRET!, {
    algorithm: "HS256",
    expiresIn: "10m",
  });
}
