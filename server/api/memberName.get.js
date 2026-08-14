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

  if (!["admin", "moderator"].includes(decoded.role)) {
    throw createError({
      statusCode: 401,
      message: "You're not allowed to update deposit",
    });
  }

  const db = await authentication();

  const model = await Auth(db);

  const users = await model.find({}, { firstName: 1, lastName: 1, _id: 0 });

  return users;
});
