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

exports.updateProvider = (params, callback) => {
  const sqlQuery = `
            UPDATE provider_shop_details 
            SET shop_name = '${params["shop_name"]}',
            shop_images = '${JSON.stringify(params["images"]).slice(0, -1)}]',
            shop_contact_number= '${params["contact_number"]}',
            damaged_can_cost= '${params["damaged_can_cost"]}'
            WHERE (user_id = '${params["user_id"]}')
            `;
  mysql.query(sqlQuery, function (err, result) {
    if (err) return callback({ message: err.message }, null);
    //? else
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
    updateProviderGeoTable(paramsToSend, function (err, result) {
      if (err) return callback({ message: err.message }, null);
      //? else
      getProvider(
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

function updateProviderGeoTable(params, callback) {
  const sqlQuery = `
            UPDATE geo_location 
            SET latitude = '${params["latitude"]}',
            longitude = '${params["longitude"]}',
            door_number= '${params["door_number"]}',
            street= '${params["street"]}',
            city= '${params["city"]}',
            state= '${params["state"]}',
            country= '${params["country"]}'
            WHERE (user_id = '${params["user_id"]}') AND (login_type = 2)
            `;
  mysql.query(sqlQuery, function (err, result) {
    if (err) return callback({ message: err.message }, null);
    return callback(null, "passed");
  });
}

function getProvider(params, callback) {
  const userID = params["id"];
  console.log(`getUser ~ id ~ ${userID}`);

  var userDetailsSqlQuery = `
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
  mysql.query(userDetailsSqlQuery, function (err, result) {
    if (err) return callback({ message: "error" }, null);
    if (result.length == 0) {
      return callback({ message: "no user found" }, null);
    }
    return callback(null, result[0]);
  });
}
