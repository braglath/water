const mysql = require("../../config/mysql_config");
const { getUserDetails } = require("../registration/sql_functions");

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

exports.updateCustomer = (params, callback) => {
  // const userDetails = params["user_details"];
  console.log(`updating user name ~ ${params["username"]}`);
  console.log(`updating user id ~ ${params["user_id"]}`);

  const sqlQuery = `
            UPDATE users 
            SET name = '${params["username"]}',
            phonenumber = '${params["phonenumber"]}',
            profile_image= '${params["profileimage"]}'
            WHERE (user_id = '${params["user_id"]}')
            `;
  mysql.query(sqlQuery, function (err, result) {
    if (err) return callback({ message: err.message }, null);
    //? else
    //? update customer geolocation table before getting use details

    const paramsToSend = {
      user_id: params["user_id"],
      latitude: params["latitude"],
      longitude: params["longitude"],
      door_number: params["door_number"],
      street: params["street"],
      city: params["city"],
      state: params["state"],
      country: params["country"],
    };
    updateGeoTable(paramsToSend, function (err, result) {
      if (err) return callback({ message: err.message }, null);
      //? else
      getUser(
        {
          id: params["user_id"],
        },
        function (err, result) {
          if (err) return callback({ message: err.message }, null);
          return callback(null, result);
        }
      );
    });
  });
};

function updateGeoTable(params, callback) {
  const sqlQuery = `
            UPDATE geo_location 
            SET latitude = '${params["latitude"]}',
            longitude = '${params["longitude"]}',
            door_number= '${params["door_number"]}',
            street= '${params["street"]}',
            city= '${params["city"]}',
            state= '${params["state"]}',
            country= '${params["country"]}'
            WHERE (user_id = '${params["user_id"]}')
            `;
  mysql.query(sqlQuery, function (err, result) {
    if (err) return callback({ message: err.message }, null);
    return callback(null, "passed");
  });
}

function getUser(params, callback) {
  const userID = params["id"];
  console.log(`getUser ~ id ~ ${userID}`);

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
    if (err) return callback({ message: "error" }, null);
    if (result.length == 0) {
      return callback({ message: "no user found" }, null);
    }
    return callback(null, result[0]);
  });
}
