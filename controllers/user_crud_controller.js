const sql = require("../services/sql/delete_user");

exports.sendUser = (req, res) => {
  const user = req.user;
  res.json({
    status: 200,
    data: {
      token: {
        access_token: user["access_token"],
        refresh_token: user["refresh_token"],
      },
      user_id: user["user_id"],
      type: user["type"],
      name: user["name"],
      email: user["email"],
      phonenumber: user["phonenumber"],
      profile_image: user["profile_image"],
      geo_location: {
        latitude: user["latitude"],
        longitude: user["longitude"],
      },
      address: {
        door_number: user["door_number"],
        street: user["street"],
        city: user["city"],
        state: user["state"],
        zip_code: user["zip_code"],
        country: user["country"],
      },
      request: {
        request_id: user["request_id"],
        provider_id: user["provider_id"],
        package: {
          package_id: user["package_id"],
          package_name: user["package_name"],
          total_month: user["total_months"],
          package_amount: user["package_amount"],
        },
        payment: {
          payment_type: user["payment_type"],
          payment_status: user["payment_status"],
        },
        provider_order_status: user["provider_order_status"],
        request_on: user["requested_on"],
      },
      date_created: user["date_created"],
    },
  });
};

exports.deleteUser = (req, res, next) => {
  const sql_userID = req.userID;
  const userIDFromParams = req.params.id;

  if (sql_userID != userIDFromParams)
    return next({ message: "token and id does not match" });
  //? else
  sql.deleteUser(sql_userID, function (err, result) {
    if (err) return next({ message: err.message });
    //? else
    return res.status(200).json({
      status: 200,
      message: "user deleted successfully",
    });
  });
};
