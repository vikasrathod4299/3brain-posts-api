const router = require("express").Router();
const { verifyToken } = require("../../middleware/verifyToken");
const Post = require("../../models/Post");
const {
  bodyValidation,
  paramsvalidation,
} = require("../../middleware/validation");
const { postSchema, postIdSchema } = require("../../validators/post");

router.use(verifyToken);

//get all posts and get post by Id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  let posts;
  try {
    if (id) {
      posts = await Post.findById(id).populate({
        path: "author",
        select: "username -_id",
      });
    } else {
      posts = await Post.find().populate({
        path: "author",
        select: "username -_id",
      });
    }
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json("Somthing went wrong!");
  }
});

//Add post
router.post("/add", bodyValidation(postSchema), async (req, res) => {
  const post = req.body;
  const user = req.user;
  try {
    const newPost = new Post({
      title: post.title,
      description: post.description,
      banner: post.banner,
      tags: post.tags,
      author: user.id,
    });
    const savedPost = await newPost.save();
    res.status(200).json({ message: "Post is uploaded!", data: savedPost });
  } catch (err) {
    console.log(err);
    res.status(500).json("Somthing went wrong!");
  }
});

//Update post by ID
router.put("/update/:id", paramsvalidation(postIdSchema), async (req, res) => {
  const { id } = req.params;
  const post = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $set: post },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Post updated successfully!", data: updatedPost });
  } catch (err) {
    console.log(err);
    res.status(500).json("Somthing went wrong!");
  }
});

//Delete post by ID
router.delete(
  "/delete/:id",
  paramsvalidation(postIdSchema),
  async (req, res) => {
    const { id } = req.params;
    try {
      await Post.findByIdAndDelete(id);
      res.status(200).json("Post has been deleted!");
    } catch (err) {
      console.log(err);
      res.status(500).json("Somthing went wrong");
    }
  }
);

module.exports = router;
