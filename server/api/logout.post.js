export default defineEventHandler(async (event) => {
  setCookie(event, "refreshToken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 0,
  });

  return {
    message: "Logged out successfully",
  };
});
