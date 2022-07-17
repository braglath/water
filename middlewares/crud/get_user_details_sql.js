const mysql = require("../../config/mysql_config"); //? this will automatically connect to the database

module.exports = function (req, res, next) {
  //? validate fields here
  // console.log(req.userID); //? from verify jwt middleware
  const userID = req.params.id;
  if (req.userID == userID) {
    var userDetailsSqlQuery = `
SELECT u.user_id,token.access_token, token.refresh_token , u.name, u.email, u.phonenumber, u.password, u.profile_image, t.type,g.latitude, g.longitude, g.door_number, g.street, g.city, g.state, g.zip_code, g.country, u.date_created
FROM users u
JOIN user_type t
	ON t.user_type_id = u.user_type
JOIN tokens token
	ON u.user_id = token.user_id
JOIN geo_location g
	ON g.user_id = u.user_id
WHERE u.user_id = '${userID}';
`;
    mysql.query(userDetailsSqlQuery, function (err, result) {
      if (err) return next({ message: "error" });
      if (result.length == 0) {
        next({ message: "no user found" });
      }
      if (result["type"] === "customer") {
        req.user = result[0]; //? sending the first result
        next();
        return;
      }
      //? else
      //? get provider details
      var sqlQuery = `
SELECT u.user_id,token.access_token, token.refresh_token , u.name, u.email, u.phonenumber, u.password, u.profile_image, t.type,g1.latitude, g1.longitude, g1.door_number, g1.street, g1.city, g1.state, g1.zip_code, g1.country, u.date_created, s.shop_name, s.shop_images, s.shop_contact_number, s.damaged_can_cost, g2.latitude as shop_latitude, g2.longitude as shop_longitude, g2.door_number as shop_door_number, g2.street as shop_street, g2.city as shop_city, g2.state as shop_state, g2.zip_code as shop_zip_code, g2.country as shop_country
FROM users u

JOIN user_type t
	ON t.user_type_id = u.user_type
    
JOIN tokens token
	ON u.user_id = token.user_id
    
JOIN (
	SELECT * FROM geo_location
  WHERE login_type = 1
		) g1
	ON g1.user_id = u.user_id
    
JOIN provider_shop_details s
ON s.user_id = u.user_id
    
JOIN (
	SELECT * FROM geo_location
  WHERE login_type = 2
  ) g2
	ON g2.user_id = u.user_id
  
  WHERE u.user_id = '${userID}'`;

      mysql.query(sqlQuery, function (err, result) {
        if (err) return next({ message: "error" });
        if (result.length == 0) {
          next({ message: "no user found" });
        }
        req.user = result[0];
        next();
      });
    });
  } else {
    res.status(403).json({
      message: "ID and Token does not match",
    });
  }
};
