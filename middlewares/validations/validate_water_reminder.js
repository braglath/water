const validator = require("../../helpers/validate_water_reminder");

module.exports = function (req, res, next) {
  const validationRule = {
    goal_ml: "required|integer",
    reminder_interval_hour: "required|numeric",
    is_everyday: "required|boolean",
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
