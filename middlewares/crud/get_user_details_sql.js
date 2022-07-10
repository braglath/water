const mysql = require("../../config/mysql_config"); //? this will automatically connect to the database

module.exports = function (req, res, next) {
  //? validate fields here
  console.log(req.userID); //? from verify jwt middleware
  const userID = req.params.id;
  if (req.userID == userID) {
    var userDetailsSqlQuery = `
SELECT u.user_id,token.access_token, token.refresh_token , u.name, u.email, u.phonenumber, u.password, u.profile_image, t.type,g.latitude, g.longitude, g.door_number, g.street, g.city, g.state, g.zip_code, g.country, u.date_created, req.request_id, req.provider_id, sub.subscription_package_id, sub.total_months, sub.package_name, sub.package_amount, porder.status as provider_order_status, ptype.type as payment_type, ps.status as payment_status, req.requested_on
FROM users u
JOIN user_type t
	ON t.user_type_id = u.user_type
JOIN tokens token
	ON u.user_id = token.user_id
JOIN geo_location g
	ON g.user_id = u.user_id
JOIN service_request req
JOIN subscription_packages sub
	ON req.package_id = sub.subscription_package_id
JOIN provider_accepted_order porder
	ON req.provider_accepted_order_id = porder.provider_accepted_order_id
JOIN payment_type ptype
	ON req.payment_type_id = ptype.payment_type_id
JOIN payment_status ps
	ON ps.status != req.status
WHERE u.user_id = 28
LIMIT 1;
`;
    mysql.query(userDetailsSqlQuery, function (err, result) {
      if (err) return next({ message: "error" });
      if (result.length == 0) {
        next({ message: "no user found" });
      }
      req.user = result[0]; //? sending the first result
      next();
    });
  } else {
    res.status(403).json({
      message: "ID and Token does not match",
    });
  }
};
