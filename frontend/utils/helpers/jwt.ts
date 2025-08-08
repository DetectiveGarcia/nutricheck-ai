import { jwtDecode } from "jwt-decode"; //npm i jwt-decode

type JWTPayload = {
  exp: number;
  userId?: string;
};

export const isTokenValid = (token: string) => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  } catch {
    return false;
  }
};
