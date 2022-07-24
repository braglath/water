const services = require("../services/waterReminder/water_reminder_services");
const sendReminderData = require("../services/sendDetails/send_water_reminder");

exports.createReminder = (req, res, next) => {
  const paramsToSend = {
    userID: req.userID,
    goal_ml: req.body.goal_ml,
    reminder_interval_hour: req.body.reminder_interval_hour,
    is_everyday: req.body.is_everyday,
  };
  services.addReminder(paramsToSend, function (err, result) {
    if (err) return next({ message: err.message });
    //? else
    const paramsToSend = {
      userID: req.userID,
    };
    services.getReminder(paramsToSend, function (err, result) {
      if (err) return next({ message: err.message });
      //? else
      req.reminder = result;
      req.message = "reminder added successfully";

      return sendReminderData(req, res);
    });
  });
};

exports.sendReminder = (req, res, next) => {
  const paramsToSend = {
    userID: req.userID,
  };
  services.getReminder(paramsToSend, function (err, result) {
    if (err) return next({ message: err.message });
    //? else
    req.reminder = result;
    req.message = "reminder added successfully";

    return sendReminderData(req, res);
  });
};

exports.deleteReminder = (req, res, next) => {
  const paramsToSend = {
    userID: req.userID,
  };
  services.deleteReminder(paramsToSend, function (err, result) {
    if (err) return next({ message: err.message });
    res.status(200).json({
      status: 200,
      success: true,
      message: "reminder deleted successfully",
    });
  });
};

exports.updateReminder = (req, res, next) => {
  const date_modified = new Date().toISOString().slice(0, -1);
  console.log(`water reminder controller ~ date_modified ~ ${date_modified}`);
  const paramsToSend = {
    userID: req.userID,
    goal_ml: req.body.goal_ml,
    reminder_interval_hour: req.body.reminder_interval_hour,
    is_everyday: req.body.is_everyday,
    date_modified: date_modified,
  };
  services.updateReminder(paramsToSend, function (err, result) {
    if (err) return next({ message: err.message });
    //? else
    const paramsToSend = {
      userID: req.userID,
    };
    services.getReminder(paramsToSend, function (err, result) {
      if (err) return next({ message: err.message });
      //? else
      req.reminder = result;
      req.message = "reminder added successfully";

      return sendReminderData(req, res);
    });
  });
};
