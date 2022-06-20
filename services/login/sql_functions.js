const mysql = require("../../config/mysql_config");
const bcrypt = require("bcrypt");

exports.addTokens = function (params, callback) {
  const userID = params["user_id"];
  const access_token = params["access_token"];
  const refresh_token = params["refresh_token"];

  var sqlQuery = `
  UPDATE tokens 
  SET access_token = '${access_token}', refresh_token = '${refresh_token}' 
  WHERE user_id = ${userID}
  `;

  console.log(access_token);
  console.log(refresh_token);

  mysql.query(sqlQuery, function (err, result) {
    if (err) return callback({ message: err.message }, null);
    //? else
    return callback(null, "passed");
  });
};

exports.getHashedPwd = function (params, callback) {
  const phonenumber = params["phonenumber"];
  const sqlQuery = `
  SELECT password
  FROM users
  WHERE phonenumber = '${phonenumber}'
  `;

  mysql.query(sqlQuery, function (err, result) {
    if (err) callback({ message: err.message }, null);
    const hashedPassword = result[0]["password"];
    return callback(null, { hashedPassword: hashedPassword });
  });
};

exports.comparePwds = async function (params, callback) {
  const hashedPassword = params["hashedPassword"];
  const normalPassword = params["normalPassword"];
  console.log(hashedPassword);
  console.log(normalPassword);
  const comparePasswords = await bcrypt.compare(normalPassword, hashedPassword);
  console.log(comparePasswords);
  if (comparePasswords) {
    return callback(null, "passed");
  } else {
    return callback({ message: "wrong password" }, null);
  }
};

exports.getUserID = function (params, callback) {
  const phonenumber = params["phonenumber"];

  const sqlQuery = `
  SELECT user_id
  FROM users
  WHERE phonenumber = '${phonenumber}'
  `;

  mysql.query(sqlQuery, function (err, result) {
    if (err) return callback({ message: err.message });
    return callback(null, result[0]["user_id"]);
  });
};
