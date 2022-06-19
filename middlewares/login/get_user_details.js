const mysql = require("../../config/mysql_config");

exports.getUseDetails = (req, res, next) => {
  const { phonenumber } = req.body;

  var sqlQuery = `
      SELECT u.user_id,token.access_token, token.refresh_token , u.name, u.email, u.phonenumber, u.password, u.profile_image, t.type,g.latitude, g.longitude, g.door_number, g.street, g.city, g.state, g.zip_code, g.country, u.date_created
      FROM users u
      JOIN user_type t
      	ON u.user_type = t.user_type_id
      JOIN tokens token
      	ON u.user_id = token.user_id
      JOIN geo_location g
      	ON u.user_id = g.user_id
      WHERE u.phonenumber = ${phonenumber}
  `;

  mysql.query(sqlQuery, function (err, result) {
    if (err) return next({ message: err.message });
    if (result.length == 0) {
      return next({ message: `no user found with ${phonenumber}` });
    } else {
      req.user = result[0];
      next();
    }
  });
};

exports.checkDeviceToken = (req, res, next) => {
  const userID = req.user["user_id"];
  const { device_token } = req.body;

  const sqlQuery = `
  SELECT device_token
  FROM device_token
  WHERE user_id = ${userID}
  `;

  mysql.query(sqlQuery, function (err, result) {
    if (err) return next({ message: err.message });
    console.log(result[0]);
    if (result.length == 0) {
      return next({ message: "no device token found" });
    } else {
      const device_token_db = result[0]["device_token"];
      if (device_token == device_token_db) {
        next();
      } else {
        return next({ message: "password required" });
      }
    }
  });
};
