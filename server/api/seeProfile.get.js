import { accessT, refreshT } from "~~/server/utils/jwt";
import jwt from "jsonwebtoken";
const refreshMaxAge = 60 * 60 * 24 * 7;

export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, "refreshToken");
  if (!refreshToken) {
    throw createError({
      statusCode: 401,
      message: "Please Login First",
    });
  }
  const config = useRuntimeConfig();

  let decoded;
  try {
    decoded = await jwt.verify(refreshToken, config.refreshToken);
  } catch (err) {
    throw createError({
      statusCode: 401,
      message: "Session Expired",
    });
  }

  const accessToken = await accessT(config.accessToken, decoded, "15m");
  const NewRefreshToken = await refreshT(
    config.refreshToken,
    decoded,
    refreshMaxAge,
  );

  setCookie(event, "refreshToken", NewRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: refreshMaxAge,
  });

  return {
    accessToken,
    user: {
      id: decoded.id,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      email: decoded.email,
    },
  };
});
