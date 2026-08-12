import { authentication } from "~~/server/utils/authentication";
import Auth from "~~/server/models/authSchema";
import jwt from "jsonwebtoken";

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
      message: "Session Expired. Please Login",
    });
  }

  if (decoded.role !== "admin") {
    throw createError({
      statusCode: 401,
      message: "You're not allowed to update deposit",
    });
  }

  return true;
});
