const validator = require("../../helpers/validate_login");

module.exports = function (req, res, next) {
  const validationRule = {
    phonenumber: "required|string|international",
    device_token: "required|string",
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
