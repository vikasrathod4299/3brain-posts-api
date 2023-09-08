const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token = req.header("authentication");
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRETE, (err, user) => {
      if (err) {
        console.log(err);
        res.status(401).json("Token in invalid");
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res
      .status(403)
      .json("You are not authorize to visit, Please provide access token!");
  }
};

module.exports = { verifyToken };
