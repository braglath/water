const validator = require("../../helpers/validate_customer_registration");

module.exports = function (req, res, next) {
  const validationRule = {
    username: "required|string|min:4",
    phonenumber: "required|string|international",
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
