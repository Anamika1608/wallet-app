import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "Username must be at least 2 characters long.")
  .max(20, "Username must not exceed 20 characters.")
  .regex(/^[a-zA-Z0-9]*$/, "Username can only contain letters, numbers, and underscores");

export const userValidation = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string()
    .min(6, { message: "Password should be minimum of 6 characters" })
    .regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/, {
      message: "Password must include at least one letter, one number, and one special character"
    })
});

export const loginValidation = z.object({
  identifier: z.string(),
  password: z.string()
})

export type Username = z.infer<typeof usernameValidation>;
export type registerUser = z.infer<typeof userValidation>;
export type loginUser = z.infer<typeof loginValidation>;

