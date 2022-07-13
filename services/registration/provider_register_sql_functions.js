const mysql = require("../../config/mysql_config.js");

exports.insertProviderGeoLocation = (params, callback) => {
  const user_id = params["user_id"];
  const login_type = params["login_type"];
  const latitude = params["latitude"];
  const longitude = params["longitude"];
  const door_number = params["door_number"];
  const street = params["street"];
  const city = params["city"];
  const state = params["state"];
  const zip_code = params["zip_code"];
  const country = params["country"];

  var sqlQuery = `
  INSERT INTO geo_location (user_id, login_type, latitude, longitude, door_number, street, city, state, zip_code, country)
  VALUES ( '${user_id}', '${login_type}', '${latitude}', '${longitude}' , '${door_number}', '${street}', '${city}', '${state}', ${zip_code}, '${country}')`;

  mysql.query(sqlQuery, function (err, result) {
    if (err) return callback({ message: err.message }, null);
    //? else
    //  console.log(
    //    `provider register sql functions ~ result ~ ${result["geo_location_id"]}`
    //  );
    //   var userID = result[0]["user_id"];
    return callback(null, "passed");
  });
};

exports.insertProviderShowDetails = (params, callback) => {
  const user_id = params["user_id"];
  const shop_name = params["shop_name"];
  const contact_number = params["contact_number"];
  const images = `${JSON.stringify(params["images"]).slice(0, -4)}]`;
  const damaged_can_cost = params["damaged_can_cost"];

  console.log(`images ~ ${images}`);
  var sqlQuery = `
  INSERT INTO provider_shop_details (user_id, shop_name, shop_images, shop_contact_number, geo_location_id, damaged_can_cost)
  VALUES ( '${user_id}', '${shop_name}', '${images}', '${contact_number}' , '${52}', '${damaged_can_cost}')`;

  mysql.query(sqlQuery, function (err, result) {
    if (err) return callback({ message: err.message }, null);
    //? else
    return callback(null, "passed");
  });
};

exports.sendProviderDetails = (params, callback) => {
  const userID = params["user_id"];

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
    
WHERE u.user_id = '${userID}';`;

  mysql.query(sqlQuery, function (err, result) {
    if (err) return callback({ message: err.message }, null);
    //? else
    console.log(result);
    return callback(null, result[0]);
  });
};
