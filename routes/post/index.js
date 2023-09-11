const path = require("path");
const fs = require("fs");
const router = require("express").Router();
const { verifyToken } = require("../../middleware/verifyToken");
const Post = require("../../models/Post");
const multer = require("multer");
const {
  bodyValidation,
  paramsvalidation,
} = require("../../middleware/validation");
const { postSchema, postIdSchema } = require("../../validators/post");

const storage = multer.memoryStorage();
const upload = multer({ storage });

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
router.post(
  "/upload",
  upload.single("banner"),
  bodyValidation(postSchema),
  (req, res) => {
    const post = req.body;
    const user = req.user;
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileName = `${Date.now()}-${req.file.originalname}`;
    const filePath = path.join(path.join(__dirname, "../../uploads"), fileName);

    fs.writeFile(filePath, req.file.buffer, async (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Error uploading file" });
      }

      try {
        const newPost = new Post({
          title: post.title,
          description: post.description,
          banner: `/uploads/${fileName}`,
          tags: post.tags,
          author: user.id,
        });
        await newPost.save();
      } catch (err) {
        res.status(500).json("Somthing went wrong!");
      }

      const imageUrl = `${
        process.env.NODE_ENV === "development"
          ? `http://localhost:${process.env.PORT}`
          : `https://vikastestapi.onrender.com/`
      }uploads/${fileName}`;

      res.json({ imageUrl });
    });
  }
);

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
