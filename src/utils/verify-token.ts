import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants";

export default function verifyToken(token: string): string | null {
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    return decoded.playerId;
  } catch (err) {
    console.error(err);
    return null;
  }
}
