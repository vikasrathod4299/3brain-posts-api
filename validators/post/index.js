const z = require("zod");
const postSchema = z.object({
  title: z
    .string()
    .min(3, "Title is too short")
    .max(30, "Title is to long, it should be less than 30 charecters"),
  description: z
    .string()
    .min(20, "Description atleast have 20 charecters")
    .max(200, "Title is to long, it should be less than 200 charecters"),
  tags: z.array(
    z
      .string()
      .min(1, "Tag altest have one charecter")
      .max(20, "Tag is log long")
  ),
  banner: z.string(),
});

const postIdSchema = z.object({
  id: z.string().min(24, "Invalid post id").max(24, "Invalid post id"),
});

module.exports = { postSchema, postIdSchema };
