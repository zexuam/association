import { authentication } from "~~/server/utils/authentication";
import dipositSchema from "~~/server/models/dipositSchema";
import jwt from "jsonwebtoken";
export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, "refreshToken");
  if (!refreshToken) {
    throw createError({
      statusCode: 401,
      message: "Please login first",
    });
  }

  const config = useRuntimeConfig();

  try {
    await jwt.verify(refreshToken, config.refreshToken);
  } catch (err) {
    throw createError({
      statusCode: 401,
      message: "Session Expired. Please Login",
    });
  }

  const db = await authentication();
  const schemas = await dipositSchema(db);

  const diposits = await schemas.find();

  if (!diposits) {
    throw createError({
      statusCode: 500,
      message: "server error. Please refresh the page",
    });
  }

  return {
    diposits: diposits,
  };
});
