const mysql = require("../../config/mysql_config"); //? this will automatically connect to the database

module.exports = function (req, res, next) {
  //? validate fields here
  const userID = req.params.id;

  var userDetailsSqlQuery = `
SELECT u.user_id,token.access_token, token.refresh_token , u.name, u.email, u.phonenumber, u.profile_image, t.type,g.latitude, g.longitude, g.door_number, g.street, g.city, g.state, g.zip_code, g.country, u.date_created
FROM users u
JOIN user_type t
	ON u.user_type = t.user_type_id
JOIN tokens token
	ON u.user_id = token.user_id
JOIN geo_location g
	ON u.user_id = g.user_id
WHERE u.user_id = ${userID}
`;
  mysql.query(userDetailsSqlQuery, function (err, result) {
    if (err) return next({ message: "error" });
    if (result.length == 0) {
      next({ message: "no user found" });
    }
    req.user = result[0]; //? sending the first result
    next();
  });
};
