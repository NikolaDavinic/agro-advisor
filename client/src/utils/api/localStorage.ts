import { User } from "../../models/user.model";

export const lsGetToken: () => string | null = () => {
  const lstoken = localStorage.getItem("auth-token");
  return lstoken;
};

export const lsSetToken = (token: string) =>
  localStorage.setItem("auth-token", token);

export const lsRemoveToken = () => localStorage.removeItem("auth-token");

export const lsGetUser = () => JSON.parse(localStorage.getItem("user") || "{}");

export const lsSetUser = (user: User) =>
  localStorage.setItem("user", JSON.stringify(user));

export const lsRemoveUser = () => localStorage.removeItem("user");
