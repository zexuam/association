import { authentication } from "~~/server/utils/authentication";
import dipositSchema from "~~/server/models/dipositSchema";

export default defineEventHandler(async (event) => {
  const db = await authentication();

  const schemas = await dipositSchema(db);

  const deposits = await schemas.find();

  if (!deposits) {
    throw createError({
      statusCode: 500,
      message: "Server error.",
    });
  }

  return deposits;
});
