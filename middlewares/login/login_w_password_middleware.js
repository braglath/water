const fromdb = require("../../services/login/sql_functions");
const jwtServices = require("../../services/jwt_services");
const sqlFunctions = require("../../services/registration/sql_functions");

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

exports.getUserDetails = (req, res, next) => {
  const userID = req.userID;
  sqlFunctions.getUserDetails(
    {
      userID: userID,
    },
    function (err, result) {
      if (err) return next({ message: err.message });
      res.status(200).json({
        status: 200,
        success: true,
        message: "logged in successfully",
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
};
