const z = require("zod");

const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be altest 3 characters long")
    .max(20, "Username is to long it should be less than 10 characters"),
  password: z
    .string()
    .min(8, "Password must me atleast 8 characters long")
    .max(20, "Password is to long")
    .refine(
      (password) => {
        return /[a-zA-Z]/.test(password) && /\d/.test(password);
      },
      {
        message: "Password must include both letters and numbers",
      }
    ),
});

const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be altest 3 characters long")
    .max(20, "Username is to long it should be less than 10 characters"),
  password: z
    .string()
    .min(8, "Password must me atleast 8 characters long")
    .max(20, "Password is to long")
    .refine(
      (password) => {
        return /[a-zA-Z]/.test(password) && /\d/.test(password);
      },
      {
        message: "Password must include both letters and numbers",
      }
    ),
});

module.exports = { loginSchema, registerSchema };
