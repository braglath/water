const validator = require("../../helpers/validate_login_w_password");

module.exports = function (req, res, next) {
  const validationRule = {
    phonenumber: "required|string|international",
    password: "required|string|min:6|strict",
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
