const { Schema, model } = require("mongoose");

const postsSchema = new Schema(
  {
    title: { type: String, required: true, maxlength: 30 },
    banner: { type: String, required: true, maxlength: 100 },
    description: { type: String, required: true, maxlength: 150 },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    tags: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

module.exports = model("Post", postsSchema);
