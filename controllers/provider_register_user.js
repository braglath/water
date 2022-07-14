const sqlFunctions = require("../services/registration/provider_register_sql_functions");

exports.registerProvider = (req, res, next) => {
  const {
    shop_name,
    contact_number,
    images,
    damaged_can_cost,
    latitude,
    longitude,
    door_number,
    street,
    city,
    state,
    zip_code,
    country,
  } = req.body;

  const paramsToSend = {
    shop_contact_number: contact_number,
  };
  sqlFunctions.findIfPhoneNumberExists(paramsToSend, function (err, result) {
    if (err) return next({ message: err.message });
    //?else

    const paramsToSend = {
      user_id: req.userID,
      login_type: 2,
      latitude: latitude,
      longitude: longitude,
      door_number: door_number,
      street: street,
      city: city,
      state: state,
      zip_code: zip_code,
      country: country,
    };

    sqlFunctions.insertProviderGeoLocation(
      paramsToSend,
      function (err, result) {
        if (err) return next({ message: err.message });
        //? else
        //! insert shop details
        const paramsToSend = {
          user_id: req.userID,
          shop_name: shop_name,
          contact_number: contact_number,
          images: images,
          damaged_can_cost: damaged_can_cost,
        };
        sqlFunctions.insertProviderShowDetails(
          paramsToSend,
          function (err, result) {
            if (err) return next({ message: err.message });
            //? else

            const paramsToSend = {
              user_id: req.userID,
            };
            sqlFunctions.sendProviderDetails(
              paramsToSend,
              function (err, result) {
                if (err) return next({ message: err.message });
                //? else
                res.json({
                  status: 200,
                  success: true,
                  message: "Provider registered successfully",
                  data: {
                    token: {
                      access_token: result["access_token"],
                      refresh_token: result["refresh_token"],
                    },
                    result_id: result["result_id"],
                    type: result["type"],
                    name: result["name"],
                    email: result["email"],
                    phonenumber: result["phonenumber"],
                    profile_image: result["profile_image"],
                    geo_location: {
                      latitude: result["latitude"],
                      longitude: result["longitude"],
                    },
                    address: {
                      door_number: result["door_number"],
                      street: result["street"],
                      city: result["city"],
                      state: result["state"],
                      zip_code: result["zip_code"],
                      country: result["country"],
                    },
                    shop_details: {
                      shop_name: result["shop_name"],
                      shop_images: result["shop_images"],
                      shop_contact_number: result["shop_contact_number"],
                      damaged_can_cost: result["damaged_can_cost"],
                      shop_geo_location: {
                        latitude: result["shop_latitude"],
                        longitude: result["shop_longitude"],
                      },
                      shop_address: {
                        shop_door_number: result["shop_door_number"],
                        shop_street: result["shop_street"],
                        shop_city: result["shop_city"],
                        shop_state: result["shop_state"],
                        shop_zip_code: result["shop_zip_code"],
                        shop_country: result["shop_country"],
                      },
                    },
                    date_created: result["date_created"],
                  },
                });
              }
            );
          }
        );
      }
    );
  });
};
