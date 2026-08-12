import jwt from "jsonwebtoken";

const refreshMaxAge = 60 * 60 * 24 * 7;
export default defineEventHandler(async (event) => {
  const refreshToken = getCookie(event, "refreshToken");

  if (!refreshToken) {
    throw createError({
      statusCode: 401,
      message: "not logged in",
    });
  }

  let decoded;
  const config = useRuntimeConfig();
  try {
    decoded = await jwt.verify(refreshToken, config.refreshToken);
  } catch (err) {
    throw createError({
      statusCode: 401,
      message: "Session Expired",
    });
  }

  const accessToken = await jwt.sign(
    {
      id: decoded._id,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      email: decoded.email,
      role: decoded.role,
    },
    config.accessToken,
    { expiresIn: "15m" },
  );

  const newRefreshToken = jwt.sign(
    {
      id: decoded._id,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      email: decoded.email,
      role: decoded.role,
    },
    config.refreshToken,
    { expiresIn: refreshMaxAge },
  );

  setCookie(event, "refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: refreshMaxAge,
  });

  return {
    accessToken,
    user: {
      id: decoded._id,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      email: decoded.email,
    },
  };
});
