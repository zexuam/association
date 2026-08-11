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

  const db = await authentication();

  const Schema = await dipositSchema(db);

  const { _id, note } = await readBody(event);

  const doc = await Schema.findOne({ _id });

  if (doc.name !== `${decoded.firstName}${decoded.lastName}`) {
    throw createError({
      statusCode: 401,
      message: "You're not allowed to edit others notes.",
    });
  }

  if (!doc) {
    throw createError({
      statusCode: 401,
      message: "Not found",
    });
  }
  if (!note) {
    throw createError({
      statusCode: 401,
      message: "Note is required",
    });
  }

  doc.note = note;
  await doc.save();

  return doc;
});
