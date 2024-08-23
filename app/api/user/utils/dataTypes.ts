import { z } from "zod";
import {
  PaginationValidator,
  UpdatedUserValidator,
  UserValidator,
} from "./validation";

export type QueryType = z.infer<typeof PaginationValidator>;
export type UserType = z.infer<typeof UserValidator>;
export type PaginationSchemaType = z.infer<typeof PaginationValidator>;
export type UpdateUserType = z.infer<typeof UpdatedUserValidator>;
export type ParamsType = { params: { userId: string } };

export type PaginationType = {
  total: number;
  currentPage: number;
  totalPages: number;
};
export type ResponseType = {
  message?: string;
  pagination?: PaginationType;
  data?: object | object[];
  error?: object | unknown;
};
