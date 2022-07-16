const mysql = require("../../config/mysql_config");

exports.findExistingUser = (params, callback) => {
  const phonenumber = params["phonenumber"];
  const email = params["email"];
  var isEmailMatchSqlQuery = `SELECT email FROM users WHERE email = '${email}'`;
  var isPhonenumberMatchSqlQuery = `SELECT phonenumber FROM users WHERE phonenumber = ${phonenumber}`;

  mysql.query(isEmailMatchSqlQuery, function (err, result) {
    if (err) return callback({ message: err.message }, null);
    console.log(result);
    if (result.length == 0) {
      //? user does not exists
      //? check with phonenumber
      mysql.query(isPhonenumberMatchSqlQuery, function (err, result) {
        if (err) return callback({ message: "error" }, null);
        if (result.length == 0) {
          //? user does not exists
          return callback(null, "passed");
        } else {
          //? user already exists
          return callback(
            { message: "user already exists with this phonenumber" },
            null
          );
        }
      });
    } else {
      //? user already exists
      return callback({ message: "user already exists with this email" }, null);
    }
  });
};

exports.insertUserDetails = (params, callback) => {
  const username = params["username"];
  const email = params["email"];
  const phonenumber = params["phonenumber"];
  const password = params["password"];
  const profileimage = params["profileimage"];
  const type = params["type"];
  const date = params["date"];

  var sql = `
  INSERT INTO users (name, email, phonenumber, password, profile_image, user_type, date_created)
  VALUES ( '${username}', '${email}', '${phonenumber}', '${password}' , '${profileimage}', '${type}', '${date}')`;

  mysql.query(sql, function (err, result) {
    if (err) return callback({ message: "error registering user" }, null);
    //? else
    return callback(null, "passed");
  });
};

exports.getUserID = (params, callback) => {
  const phonenumber = params["phonenumber"];

  var getUserIDQuery = `
    SELECT user_id
    FROM users
    WHERE phonenumber = '${phonenumber}'
    `;

  mysql.query(getUserIDQuery, function (err, result) {
    if (err) return callback({ message: "error registering user" }, null);
    //? else
    console.log(result);
    var userID = result[0]["user_id"];
    return callback(null, userID);
  });
};

exports.insertTokens = (params, callback) => {
  const userID = params["user_id"];
  const access_token = params["access_token"];
  const refresh_token = params["refresh_token"];

  var tokenSqlQuery = `
        INSERT INTO tokens (user_id, access_token, refresh_token)
        VALUES ('${userID}','${access_token}','${refresh_token}')
        `;

  mysql.query(tokenSqlQuery, function (err, result) {
    if (err) return callback({ message: "error registering user" }, null);
    return callback(null, "passed");
  });
};

exports.insertDeviceToken = (params, callback) => {
  const userID = params["userID"];
  const deviceToken = params["device_token"];

  const sqlQuery = `
  INSERT INTO device_token (user_id, device_token)
  VALUES ('${userID}','${deviceToken}')
  `;

  mysql.query(sqlQuery, function (err, result) {
    if (err) return callback({ message: "error adding device token" }, null);
    return callback(null, "passed");
  });
};

exports.insertGeoLocation = (params, callback) => {
  const userID = params["userID"];
  const loginType = 1;
  const latitude = params["latitude"];
  const longitude = params["longitude"];
  const door_number = params["door_number"];
  const street = params["street"];
  const city = params["city"];
  const state = params["state"];
  const zip_code = params["zip_code"];
  const country = params["country"];

  var geoTableQuery = `
          INSERT INTO geo_location (user_id,login_type, latitude, longitude, door_number, street, city, state, zip_code, country)
          VALUES ('${userID}','${loginType}', '${latitude}','${longitude}','${door_number}','${street}','${city}','${state}','${zip_code}','${country}')
          `;

  mysql.query(geoTableQuery, function (err, result) {
    if (err) return callback({ message: "error registering user" }, null);
    //? else
    return callback(null, "passed");
  });
};

exports.getCustomerRegisDetails = (params, callback) => {
  const userID = params["userID"];

  var userDetailsSqlQuery = `
            SELECT u.user_id,token.access_token, token.refresh_token , u.name, u.email, u.phonenumber, u.profile_image, t.type,g.latitude, g.longitude, g.door_number, g.street, g.city, g.state, g.zip_code, g.country, u.date_created
            FROM users u
            JOIN user_type t
	          ON u.user_type = t.user_type_id
            JOIN tokens token
	          ON u.user_id = token.user_id
            JOIN geo_location g
	          ON u.user_id = g.user_id
            WHERE u.user_id = '${userID}'
            `;

  mysql.query(userDetailsSqlQuery, function (err, result) {
    if (err) return callback({ message: "error" }, null);
    if (result.length == 0) {
      return callback({ message: "no user found" }, null);
    }
    const user = result[0];
    console.log(
      `sql functions ~ get customer regis details ~ user ~ ${user["type"]}`
    );
    return callback(null, user); //? sending the first result
  });
};

exports.getUserDetails = (params, callback) => {
  const userID = params["userID"];

  var userDetailsSqlQuery = `
            SELECT u.user_id,token.access_token, token.refresh_token , u.name, u.email, u.phonenumber, u.profile_image, t.type,g.latitude, g.longitude, g.door_number, g.street, g.city, g.state, g.zip_code, g.country, u.date_created
            FROM users u
            JOIN user_type t
	          ON u.user_type = t.user_type_id
            JOIN tokens token
	          ON u.user_id = token.user_id
            JOIN geo_location g
	          ON u.user_id = g.user_id
            WHERE u.user_id = '${userID}'
            `;

  mysql.query(userDetailsSqlQuery, function (err, result) {
    if (err) return callback({ message: "error" }, null);
    if (result.length == 0) {
      return callback({ message: "no user found" }, null);
    }
    const user = result[0];
    console.log(`sql functions ~ get user details ~ user ~ ${user["type"]}`);
    if (user["type"] === "customer") {
      return callback(null, user); //? sending the first result
    }
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
      if (err) return callback({ message: err.message }, null);
      //? else
      const user = result[0];
      return callback(null, user);
    });
  });
};
