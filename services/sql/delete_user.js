const mysql = require("../../config/mysql_config");

exports.deleteUser = function (userID, callback) {
  const sqlQuery = `
         DELETE 
         FROM device_token 
         WHERE user_id = '${userID}'
   `;

  mysql.query(sqlQuery, function (err, result) {
    if (err) return callback({ message: err.message }, null);

    const sqlQuery = `
         DELETE 
         FROM tokens 
         WHERE user_id = '${userID}';
    `;

    mysql.query(sqlQuery, function (err, result) {
      if (err) return callback({ message: err.message }, null);

      //? will delete both customer geo location and shop geo location as both have same user_id and in same table
      const sqlQuery = `
            DELETE 
            FROM geo_location 
            WHERE user_id = '${userID}';
       `;

      mysql.query(sqlQuery, function (err, result) {
        if (err) return callback({ message: err.message }, null);

        const sqlQuery = `
        SELECT user_type
        FROM users
        WHERE user_id = '${userID}'
        `;

        mysql.query(sqlQuery, function (err, result) {
          if (err) return callback({ message: err.message }, null);
          if (result.length == 0)
            return callback({ message: "no user found" }, null);

          const sqlQuery = `
            DELETE 
            FROM users 
            WHERE user_id = '${userID}';
            `;
          mysql.query(sqlQuery, function (err, result) {
            if (err) return callback({ message: err.message }, null);

            //? delete provider shop details
            const sqlQuery = `
            DELETE 
            FROM provider_shop_details 
            WHERE user_id = '${userID}';
            `;
            mysql.query(sqlQuery, function (err, result) {
              if (err) return callback({ message: err.message }, null);
              return callback(null, "passed");
            });

            //? else deleting customer details
          });
        });
      });
    });
  });
};
