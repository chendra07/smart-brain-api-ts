import jwt from "jsonwebtoken";

const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = process.env;

type JWTBodyType = {
  refreshed_token?: boolean;
  email: string;
};

export function signNewAccessToken(data: JWTBodyType) {
  return jwt.sign(data, JWT_ACCESS_SECRET!, {
    algorithm: "HS256",
    expiresIn: "60s",
  });
}

export function signNewRefreshToken(data: JWTBodyType) {
  return jwt.sign(data, JWT_REFRESH_SECRET!, {
    algorithm: "HS256",
    expiresIn: "180s",
  });
}

export function signRefreshedAccessToken(data: JWTBodyType) {
  return jwt.sign({ ...data, refreshedToken: true }, JWT_ACCESS_SECRET!, {
    algorithm: "HS256",
    expiresIn: "20s",
  });
}
