import { authentication } from "~~/server/utils/authentication";
import dipositSchema from "~~/server/models/dipositSchema";

export default defineEventHandler(async (event) => {
  const db = await authentication();

  const schemas = await dipositSchema(db);

  const { name } = await readBody(event);

  const client = await schemas.find({ name }).sort({ dipositDate: -1 });

  if (!client) {
    throw createError({
      statusCode: 500,
      message: "User Not Found",
    });
  }

  return client;
});
