const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  // const token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWNjNWQyMGY2OWY3NjAxNTllNzUxNTIiLCJwaG9uZU51bWJlciI6IjEyMyIsImlhdCI6MTcwNzk3MTY0NywiZXhwIjoxNzA3OTkzMjQ3fQ.kmT73FynNOxHKIGfH29qgVAARb7bv095nvHGPmJMQmc";
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided" });
  }

  jwt.verify(token, "knolskape", (err, decoded) => {
    if (err) {
      // console.log(token, "this is auth");
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    req.user = decoded.user;
    next();
  });
};

module.exports = authMiddleware;
