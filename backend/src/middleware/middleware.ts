import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../types/express/index.js";
import { verifyJWT } from "../../utils/jwt.js";

export async function checkAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await verifyJWT(token);
    if (!decoded) {
      res.status(403).json({ message: "Invalid token" });
      return;
    }
    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof Error) {
      const isExpired = err.name === "TokenExpiredError";
      res
        .status(403)
        .json({ message: isExpired ? "Expired token" : "Invalid token" });
    } else {
      res.status(403).json({ message: "Invalid token" });
    }
    return;
  }
}
