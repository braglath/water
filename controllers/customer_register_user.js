const mysql = require("../config/mysql_config");

const jwt = require("../services/jwt_services");
const sqlServices = require("../services/registration/sql_functions");

exports.checkUserExists = (req, res, next) => {
  const phonenumber = req.body.phonenumber;
  const email = req.body.email;
  sqlServices.findExistingUser(
    {
      phonenumber: phonenumber,
      email: email,
    },
    function (err, result) {
      if (err) return next({ message: err.message });
      //? else
      next();
    }
  );
};

exports.registerUser = function (req, res, next) {
  //? validate fields here
  const {
    username,
    email,
    phonenumber,
    profileimage,
    type,
    latitude,
    longitude,
    door_number,
    street,
    city,
    state,
    zip_code,
    country,
    device_token,
  } = req.body;

  const password = req.hashedPassword;
  const date = new Date().toISOString().slice(0, -1);

  const paramsToSend = {
    username: username,
    email: email,
    phonenumber: phonenumber,
    password: password,
    profileimage: profileimage,
    type: type,
    date: date,
  };

  sqlServices.insertUserDetails(paramsToSend, function (err, result) {
    if (err) return next({ message: err.message });
    //? else
    //? get user id
    const paramsToSend = {
      phonenumber: phonenumber,
    };

    sqlServices.getUserID(paramsToSend, function (err, result) {
      if (err) return next({ message: err.message });
      //? else
      const userID = result;
      console.log(userID);
      jwt(userID, function (err, result) {
        console.log(result["access_token"]);
        console.log(result["refresh_token"]);

        const access_token = result["access_token"];
        const refresh_token = result["refresh_token"];

        const paramsToSend = {
          user_id: userID,
          access_token: access_token,
          refresh_token: refresh_token,
        };

        sqlServices.insertTokens(paramsToSend, function (err, result) {
          if (err) return next({ message: err.message });
          //? else
          const paramsToSend = {
            userID: userID,
            device_token: device_token,
          };
          sqlServices.insertDeviceToken(paramsToSend, function (err, result) {
            if (err) return next({ message: err.message });

            const paramsToSend = {
              userID: userID,
              latitude: latitude,
              longitude: longitude,
              door_number: door_number,
              street: street,
              city: city,
              state: state,
              zip_code: zip_code,
              country: country,
            };

            sqlServices.insertGeoLocation(paramsToSend, function (err, result) {
              if (err) return next({ message: err.message });
              //? else
              const paramsToSend = {
                userID: userID,
              };

              sqlServices.getUserDetails(paramsToSend, function (err, result) {
                if (err) return next({ message: err.message });

                res.json({
                  status: 200,
                  success: true,
                  message: "Customer registered successfully",
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
                    date_created: result["date_created"],
                  },
                });
              });
            });
          });
        });
      });
    });
  });
};
