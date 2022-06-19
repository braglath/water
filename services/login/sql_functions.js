const mysql = require("../../config/mysql_config");

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
