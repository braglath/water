const validator = require("../../helpers/validate_provider_registration");

module.exports = function (req, res, next) {
  const validationRule = {
    shop_name: "required|string|min:4",
    contact_number: "required|string|international",
    images: "required|array|url",
    damaged_can_cost: "required|integer",
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
