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

  const name = `${decoded.firstName}${decoded.lastName}`;

  const doc = await Schema.findOne({ name }).sort({ dipositTimes: -1 });

  let times = 1;

  if (doc) {
    times += parseInt(doc.dipositTimes, 10);
  }
  const body = await readBody(event);

  const newDoc = await Schema.create({
    name,
    dipositTimes: times,
    amount: body.amount,
    dipositDate: body.dipositDate,
  });

  return newDoc;
});
