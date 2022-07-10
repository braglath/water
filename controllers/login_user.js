const jwt = require("../services/jwt_services");
const sql = require("../services/registration/sql_functions");
const sqlFunct = require("../services/login/sql_functions");

module.exports = function (req, res, next) {
  const user = req.user;
  const userID = user["user_id"];
  jwt(userID, function (err, result) {
    if (err) return next({ message: "jwt auth error" });
    const access_token = result["access_token"];
    const refresh_token = result["refresh_token"];

    //! insert tokens into token table with userID
    sqlFunct.addTokens(
      {
        user_id: userID,
        access_token: access_token,
        refresh_token: refresh_token,
      },
      function (err, result) {
        if (err) return next({ message: err.message });

        sql.getUserDetails(
          {
            userID: userID,
          },
          function (err, result) {
            if (err) return next({ message: err.message });
            res.json({
              status: 200,
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
                request: {
                  request_id: result["request_id"],
                  provider_id: result["provider_id"],
                  package: {
                    package_id: result["package_id"],
                    package_name: result["package_name"],
                    total_month: result["total_months"],
                    package_amount: result["package_amount"],
                  },
                  payment: {
                    payment_type: result["payment_type"],
                    payment_status: result["payment_status"],
                  },
                  provider_order_status: result["provider_order_status"],
                  request_on: result["requested_on"],
                },
                date_created: result["date_created"],
              },
            });
          }
        );
      }
    );
  });
};
