import { User } from "../../models/user.model";

export const getAuthToken = () => localStorage.getItem("auth-token");

export const setAuthToken = (token: string) =>
  localStorage.setItem("auth-token", token);

export const removeAuthToken = () => localStorage.removeItem("auth-token");

export const getUser = () => JSON.parse(localStorage.getItem("user") || "{}");

export const setUser = (user: User) =>
  localStorage.setItem("user", JSON.stringify(user));

export const removeUser = () => localStorage.removeItem("user");
