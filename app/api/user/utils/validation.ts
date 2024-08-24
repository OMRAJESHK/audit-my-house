import { z } from "zod";
import { ErrorMessages } from "./enums";

export const UserValidator = z
  .object({
    username: z.string().min(3).max(32),
    password: z.string().min(3),
    display_password: z.string().min(3),
    role_id: z.number().min(1, ErrorMessages.ROLE_REQUIRED),
    email: z
      .string()
      .email(ErrorMessages.EMAIL_INVALID)
      .min(1, ErrorMessages.EMAIL_REQUIRED),
    mobile: z
      .number()
      .min(1, ErrorMessages.MOBILE_INVALID)
      .refine((value) => value.toString().length === 10),
    created_date: z.date().default(() => new Date()),
    remarks: z.string(),
  })
  .strict();

export const UpdatedUserValidator = z
  .object({
    username: z.string().min(3).max(32).optional(),
    password: z.string().min(3).optional(),
    display_password: z.string().min(3).optional(),
    role_id: z.number().min(1, "role ID is Required").optional(),
    email: z
      .string()
      .email(ErrorMessages.EMAIL_INVALID)
      .min(1, ErrorMessages.EMAIL_REQUIRED)
      .optional(),
    mobile: z
      .number()
      .min(1, ErrorMessages.MOBILE_INVALID)
      .refine((value) => value.toString().length === 10)
      .optional(),
    remarks: z.string().optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    const extraKeys = Object.keys(data).filter(
      (key) =>
        ![
          "username",
          "password",
          "display_password",
          "role_id",
          "email",
          "mobile",
          "remarks",
        ].includes(key)
    );
    if (extraKeys.length > 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Unexpected fields: ${extraKeys.join(", ")}`,
      });
    }
  });

export const PaginationValidator = z
  .object({
    limit: z.string().optional().default("10"),
    page: z.string().optional().default("1"),
  })
  .strict();
