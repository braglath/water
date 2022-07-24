const express = require("express");
const router = express.Router();

const validateFields = require("../middlewares/validations/validate_water_reminder.js");
const iDTokenAreEqual = require("../middlewares/id_token_are_equal");
const middleware = require("../middlewares/waterReminder/water_reminder_middlewares");
const controller = require("../controllers/water_reminder_controller");

router
  .route("/:id")

  .post(
    validateFields,
    iDTokenAreEqual,
    middleware.findExistingReminder,
    controller.createReminder
  )
  .get(iDTokenAreEqual, middleware.noReminderFound, controller.sendReminder)
  .put(
    validateFields,
    iDTokenAreEqual,
    middleware.noReminderFound,
    controller.updateReminder
  )
  .delete(
    iDTokenAreEqual,
    middleware.noReminderFound,
    controller.deleteReminder
  );

module.exports = router;
