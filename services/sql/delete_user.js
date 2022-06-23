const mysql = require("../../config/mysql_config");

exports.deleteUser = function (userID, callback) {
  const sqlQuery = `
         DELETE 
         FROM device_token 
         WHERE user_id = ${userID}
   `;

  mysql.query(sqlQuery, function (err, result) {
    if (err) return callback({ message: err.message }, null);

    const sqlQuery = `
         DELETE 
         FROM tokens 
         WHERE user_id = ${userID};
    `;

    mysql.query(sqlQuery, function (err, result) {
      if (err) return callback({ message: err.message }, null);

      const sqlQuery = `
            DELETE 
            FROM geo_location 
            WHERE user_id = ${userID};
       `;

      mysql.query(sqlQuery, function (err, result) {
        if (err) return callback({ message: err.message }, null);

        const sqlQuery = `
            DELETE 
            FROM users 
            WHERE user_id = ${userID};
          `;

        mysql.query(sqlQuery, function (err, result) {
          if (err) return callback({ message: err.message }, null);
          return callback(null, "passed");
        });
      });
    });
  });
};
