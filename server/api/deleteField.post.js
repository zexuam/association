import { authentication } from "~~/server/utils/authentication";
import dipositSchema from "~~/server/models/dipositSchema";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, "refreshToken");
  if (!refreshToken) {
    throw createError({
      statusCode: 401,
      message: "Not logged In",
    });
  }

  let decoded;
  const config = useRuntimeConfig();
  try {
    decoded = await jwt.verify(refreshToken, config.refreshToken);
  } catch (er) {
    throw createError({
      statusCode: 401,
      message: "Session Expired. Please login",
    });
  }

  if (decoded.role !== "admin") {
    throw createError({
      statusCode: 401,
      message: "You're not allowed to delete deposit field",
    });
  }

  const db = await authentication();

  const Schema = await dipositSchema(db);

  const { _id } = await readBody(event);

  const doc = await Schema.findOneAndDelete({ _id });

  if (!doc) {
    throw createError({
      statusCode: 404,
      message: "Document not found.",
    });
  }

  return {
    message: "Deleted Successfully",
  };
});
