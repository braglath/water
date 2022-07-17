const fromdb = require("../../services/login/sql_functions");
const jwtServices = require("../../services/jwt_services");
const sqlFunctions = require("../../services/registration/sql_functions");

const sendCustomerDetails = require("../../services/sendDetails/send_customer_details");
const sendProviderDetails = require("../../services/sendDetails/send_provider_details");

exports.comparePasswords = (req, res, next) => {
  const { phonenumber, password } = req.body;
  fromdb.getHashedPwd({ phonenumber: phonenumber }, function (err, result) {
    if (err) return next({ message: err.message });
    const hashedPassword = result.hashedPassword;
    fromdb.comparePwds(
      { hashedPassword: hashedPassword, normalPassword: password },
      function (err, result) {
        if (err) return next({ message: err.message });
        return next();
      }
    );
  });
};

exports.generateToken = (req, res, next) => {
  const { phonenumber } = req.body;
  fromdb.getUserID(
    {
      phonenumber: phonenumber,
    },
    function (err, result) {
      if (err) return next({ message: err.message });
      const userID = result;
      req.userID = userID;
      jwtServices(userID, function (err, result) {
        if (err) return next({ message: err.message });
        const access_token = result["access_token"];
        const refresh_token = result["refresh_token"];
        sqlFunctions.insertTokens(
          {
            user_id: userID,
            access_token: access_token,
            refresh_token: refresh_token,
          },
          function (err, result) {
            if (err) return next({ message: err.message });
            return next();
          }
        );
      });
    }
  );
};

exports.updateDeviceToken = (req, res, next) => {
  const { phonenumber, device_token } = req.body;
  fromdb.getUserID(
    {
      phonenumber: phonenumber,
    },
    function (err, result) {
      if (err) return next({ message: err.message });
      const userID = result;

      const paramsToSend = {
        device_token: device_token,
        user_id: userID,
      };

      sqlFunctions.updateDeviceToken(paramsToSend, function (err, result) {
        if (err) return next({ message: err.message });
        next();
      });
    }
  );
};

exports.getUserDetails = (req, res, next) => {
  const userID = req.userID;
  sqlFunctions.getUserDetails(
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
};
