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
    WHERE phonenumber = ${phonenumber}
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
  const latitude = params["latitude"];
  const longitude = params["longitude"];
  const door_number = params["door_number"];
  const street = params["street"];
  const city = params["city"];
  const state = params["state"];
  const zip_code = params["zip_code"];
  const country = params["country"];

  var geoTableQuery = `
          INSERT INTO geo_location (user_id, latitude, longitude, door_number, street, city, state, zip_code, country)
          VALUES ('${userID}','${latitude}','${longitude}','${door_number}','${street}','${city}','${state}','${zip_code}','${country}')
          `;

  mysql.query(geoTableQuery, function (err, result) {
    if (err) return callback({ message: "error registering user" }, null);
    //? else
    return callback(null, "passed");
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
            WHERE u.user_id = ${userID}
            `;

  mysql.query(userDetailsSqlQuery, function (err, result) {
    if (err) return callback({ message: "error" }, null);
    if (result.length == 0) {
      return callback({ message: "no user found" }, null);
    }
    const user = result[0];
    return callback(null, user); //? sending the first result
  });
};
