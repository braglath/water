const sql = require("../../config/mysql_config");

exports.addReminder = (params, callback) => {
  const userID = params["userID"];
  const goal_ml = params["goal_ml"];
  const reminder_interval_hour = params["reminder_interval_hour"];
  const is_everyday = params["is_everyday"] == false ? 0 : 1;

  const sqlQuery = `
  INSERT INTO water_reminder 
  (user_id, goal_ml, reminder_interval_hour,is_everyday) VALUES ('${userID}', '${goal_ml}', '${reminder_interval_hour}', '${is_everyday}');
  `;

  sql.query(sqlQuery, function (err, result) {
    if (err) return callback({ message: err.message }, null);
    //? else
    callback(null, "passed");
  });
};

exports.getReminder = (params, callback) => {
  const userID = params["userID"];

  const sqlQuery = `
    SELECT * FROM water_reminder
    WHERE user_id = '${userID}'
    `;

  sql.query(sqlQuery, function (err, result) {
    if (err) return callback({ message: err.message }, null);
    //? else
    callback(null, result[0]);
  });
};

exports.deleteReminder = (params, callback) => {
  const userID = params["userID"];

  const sqlQuery = `
      DELETE FROM water_reminder
      WHERE user_id = '${userID}'
      `;

  sql.query(sqlQuery, function (err, result) {
    if (err) return callback({ message: err.message }, null);
    //? else
    callback(null, "passed");
  });
};

exports.updateReminder = (params, callback) => {
  const userID = params["userID"];
  const goal_ml = params["goal_ml"];
  const reminder_interval_hour = params["reminder_interval_hour"];
  const is_everyday = params["is_everyday"] == false ? 0 : 1;
  const date_modified = params["date_modified"];

  const sqlQuery = `
      UPDATE water_reminder
      SET goal_ml = '${goal_ml}',
      reminder_interval_hour = '${reminder_interval_hour}',
      is_everyday = '${is_everyday}',
      date_modified = '${date_modified}'
      WHERE user_id = '${userID}'
  `;

  sql.query(sqlQuery, function (err, result) {
    if (err) return callback({ message: err.message }, null);
    //? else
    callback(null, "passed");
  });
};
