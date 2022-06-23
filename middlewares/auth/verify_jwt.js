const util = require("util");
const jwt = require("jsonwebtoken");
const jwtVerifyAsync = util.promisify(jwt.verify);

module.exports = async function (req, res, next) {
  console.log("i am here");
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  try {
    const verify = await jwtVerifyAsync(token, process.env.JWT_SECRET);
    console.log(verify);
    next();
  } catch (e) {
    next({ message: "token is expired" });
  }
};
