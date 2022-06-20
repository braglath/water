const validator = require("../../helpers/validate_registration");

module.exports = function (req, res, next) {
  const validationRule = {
    type: "required|integer|min:1|max:2",
    username: "required|string|min:4",
    email: "required|email",
    phonenumber: "required|string|international",
    password: "required|string|min:6|strict",
    profileimage: "required|string|url",
    latitude: "required|numeric",
    longitude: "required|numeric",
    door_number: "required|string",
    street: "required|string",
    city: "required|string",
    state: "required|string",
    zip_code: "required|integer",
    country: "required|string",
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  });
};
