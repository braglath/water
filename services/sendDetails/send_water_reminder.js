module.exports = function (req, res) {
  const reminder = req.reminder;
  const message = req.message;
  const is_complete = reminder["is_complete"] == 0 ? false : true;
  const is_everyday = reminder["is_everyday"] == 0 ? false : true;

  // console.log(`send customer details ~ customerDetails ~ ${customerDetails}`);

  return res.status(200).json({
    status: 200,
    success: true,
    message: message,
    data: {
      water_reminder_id: reminder["water_reminder_id"],
      user_id: reminder["user_id"],
      goal_ml: reminder["goal_ml"],
      reminder_interval_hour: reminder["reminder_interval_hour"],
      is_complete: is_complete,
      is_everyday: is_everyday,
      date_created: reminder["date_created"],
      date_modified: reminder["date_modified"],
    },
  });
};
