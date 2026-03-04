import jwt from "jsonwebtoken";
export const signToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: `${process.env.JWT_EXPIRES_DAYS || 7}d` });
};
