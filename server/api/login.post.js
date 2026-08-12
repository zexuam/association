import { authentication } from "~~/server/utils/authentication";
import Auth from "~~/server/models/authSchema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const refreshMaxAge = 60 * 60 * 24 * 7;

export default defineEventHandler(async (event) => {
  const db = await authentication();

  const body = await readBody(event);
  const { email, password } = await body;

  const user = await Auth(db);

  const doc = await user.findOne({ email });

  if (!doc) {
    throw createError({
      statusCode: 401,
      message: "User not found",
    });
  }

  const validPassword = await bcrypt.compare(password, doc.password);

  if (!validPassword) {
    doc.loginAttempts += 1;
    await doc.save();
    throw createError({
      status: 401,
      statusText: "Password is wrong.",
    });
  }
  const config = useRuntimeConfig();
  const accessToken = await jwt.sign(
    {
      id: doc._id,
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      role: doc.role,
    },
    config.accessToken,
    { expiresIn: "15m" },
  );

  const refreshToken = await jwt.sign(
    {
      id: doc._id,
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      role: doc.role,
    },
    config.refreshToken,
    { expiresIn: refreshMaxAge },
  );

  setCookie(event, "refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: refreshMaxAge,
  });

  return {
    accessToken,
    user: {
      id: doc._id,
      firstName: doc.firstName,
      lastName: doc.lastName,
      email: doc.email,
      att: doc.loginAttempted,
      role: doc.role,
    },
  };
});
