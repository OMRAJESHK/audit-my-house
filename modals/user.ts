import { z } from "zod";

enum ErrorMessages {
  // email
  invalidemail = "Email is Invalid",
  requiredemail = "Email is Required",

  //
}

export const UserSchema = z.object({
  username: z.string().min(3).max(32),
  password: z.string().min(3),
  display_password: z.string().min(3),
  role_id: z.number().min(1, "role ID is Required"),
  email: z
    .string()
    .email(ErrorMessages.invalidemail)
    .min(1, ErrorMessages.requiredemail),
  mobile: z.number().refine((value) => value.toString().length === 10),
  created_date: z.date().default(() => new Date()),
  remarks: z.string(),
});

export const UpdatedUserSchema = z.object({
  username: z.string().min(3).max(32).optional(),
  password: z.string().min(3).optional(),
  display_password: z.string().min(3).optional(),
  role_id: z.number().min(1, "role ID is Required").optional(),
  email: z
    .string()
    .email(ErrorMessages.invalidemail)
    .min(1, ErrorMessages.requiredemail)
    .optional(),
  mobile: z
    .number()
    .refine((value) => value.toString().length === 10)
    .optional(),
  remarks: z.string().optional(),
});

// extract the inferred type
export type UserType = z.infer<typeof UserSchema>;
