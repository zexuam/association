import { authentication } from "~~/server/utils/authentication";
import Auth from "~~/server/models/authSchema";
import { accessT, refreshT } from "~~/server/utils/jwt";

const refreshMaxAge = 60 * 60 * 24 * 7;

export default defineEventHandler(async (event) => {
  const db = await authentication();
  const auth = await Auth(db);
  const body = await readBody(event);

  const config = useRuntimeConfig();
  let user;
  let accessToken;
  let refreshToken;
  try {
    user = await auth.create(body);

    accessToken = accessT(config.accessToken, user, "15m");

    refreshToken = refreshT(config.refreshToken, user, refreshMaxAge);

    setCookie(event, "refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: refreshMaxAge,
    });
  } catch (err) {
    if (err.code === 11000) {
      throw createError({
        statusCode: 409,
        message: "User Already Exists with the Email",
      });
    }
    throw createError({
      statusCode: 500,
      message: "Server Error",
    });
  }

  return {
    accessToken,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
  };
});
