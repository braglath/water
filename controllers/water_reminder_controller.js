const services = require("../services/waterReminder/water_reminder_services");
const sendReminderData = require("../services/sendDetails/send_water_reminder");
const transporter = require("../config/nodemailer_config");

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
      const options = {
        from: "stayhydratedever@outlook.com",
        to: "braglath44@gmail.com",
        subject: "Water Reminder",
        text: `
hello there,
You just created a water reminder.
Sit back, we will remind you every ${result["reminder_interval_hour"]} hours to drink water. 

STAY HYDRATED`,
      };
      transporter.sendMail(options, function (err, info) {
        if (err) {
          const is_complete = result["is_complete"] == 0 ? false : true;
          const is_everyday = result["is_everyday"] == 0 ? false : true;
          return res.status(200).json({
            status: 200,
            success: true,
            message: {
              message: "error sending email, but reminder created successfully",
              error_message: err.message,
            },
            data: {
              water_reminder_id: result["water_reminder_id"],
              user_id: result["user_id"],
              goal_ml: result["goal_ml"],
              reminder_interval_hour: result["reminder_interval_hour"],
              is_complete: is_complete,
              is_everyday: is_everyday,
              date_created: result["date_created"],
              date_modified: result["date_modified"],
            },
          });
        }

        //? else
        req.reminder = result;
        req.message = "reminder added successfully";
        return sendReminderData(req, res); //? sending the reminder data to front end
      });
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
