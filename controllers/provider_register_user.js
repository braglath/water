const sqlFunctions = require("../services/registration/provider_register_sql_functions");
const sendProviderDetails = require("../services/sendDetails/send_provider_details");

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
                res.userDetails = result;
                res.message = "Provider registered successfully";
                return sendProviderDetails(res);
              }
            );
          }
        );
      }
    );
  });
};
