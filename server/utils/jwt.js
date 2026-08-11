import jwt from "jsonwebtoken";
export function accessT(token, user, expiry) {
  return jwt.sign(
    {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
    token,
    { expiresIn: expiry },
  );
}

export function refreshT(token, user, expiry) {
  return jwt.sign(
    {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
    token,
    { expiresIn: expiry },
  );
}
