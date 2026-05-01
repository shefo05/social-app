import jwt, { JwtPayload } from "jsonwebtoken";
import { randomUUID } from "crypto";
import { StringValue } from "ms";
const generateToken = (
  payload: Record<string, unknown>,
  secret: string,
  expireTime: number | StringValue,
): string => {
  const tokenPayload = {
    ...payload,
    jti: randomUUID(),
  };

  const token = jwt.sign(tokenPayload, secret, {
    expiresIn: expireTime,
  });
  return token;
};

export function generateTokens(payload: JwtPayload) {
  const accessToken = generateToken(
    payload,
    "vhfdsfgkfsutgrufdkcxzvjkvuirlficubzliuxvaspi",
    3600,
  );

  const refreshToken = generateToken(
    payload,
    "kkkkkfkfkfkfkfghfsfdgfysdgyuzfcvytxcvxcuczcftvffuygastjkg",
    "1y",
  );

  return { accessToken, refreshToken };
}

export function verifyToken(
  token: string,
  secret = "vhfdsfgkfsutgrufdkcxzvjkvuirlficubzliuxvaspi",
) {
  const payload = jwt.verify(token, secret);
  return payload;
}
