const jwt = require("jsonwebtoken");

module.exports = function (userID, callback) {
  const token = jwt.sign({ user_id: userID }, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_LIFE,
  });
  const refreshToken = jwt.sign(
    { user_id: userID },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_LIFE,
    }
  );

  callback(null, {
    access_token: token,
    refresh_token: refreshToken,
  });
};
