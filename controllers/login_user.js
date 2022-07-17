const jwt = require("../services/jwt_services");
const sql = require("../services/registration/sql_functions");
const sqlFunct = require("../services/login/sql_functions");
const sendCustomerDetails = require("../services/sendDetails/send_customer_details");
const sendProviderDetails = require("../services/sendDetails/send_provider_details");

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
            if (err) return next({ message: err.message }, null);
            res.userDetails = result;
            res.message = "success";
            if (result["type"] === "customer") return sendCustomerDetails(res);
            //? else this is a provider login
            return sendProviderDetails(res);
          }
        );
      }
    );
  });
};
