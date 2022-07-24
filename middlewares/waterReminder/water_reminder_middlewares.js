const sql = require("../../config/mysql_config");

exports.findExistingReminder = (req, res, next) => {
  const sqlQuery = `
    SELECT user_id
    FROM water_reminder
    WHERE user_id = '${req.userID}'
    `;

  sql.query(sqlQuery, function (err, result) {
    if (err) return next({ message: err.message });
    //? else
    if (result.length != 0)
      return next({ message: "reminder already exists for this ID" });
    //? else
    next();
  });
};

exports.noReminderFound = (req, res, next) => {
  const sqlQuery = `
    SELECT user_id
    FROM water_reminder
    WHERE user_id = '${req.userID}'
    `;

  sql.query(sqlQuery, function (err, result) {
    if (err) return next({ message: err.message });
    //? else
    if (result.length == 0) return next({ message: "no reminder found" });
    //? else
    next();
  });
};
