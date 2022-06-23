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
            res.status(200).json({
              status: 200,
              success: true,
              message: "login successful",
              data: {
                token: {
                  access_token: result["access_token"],
                  refresh_token: result["refresh_token"],
                },
                user_id: result["user_id"],
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
                date_created: result["date_created"],
              },
            });
          }
        );
      }
    );
  });
};
