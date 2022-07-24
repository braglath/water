const sql = require("../services/sql/crud_user");
const sendCustomerDetails = require("../services/sendDetails/send_customer_details");
const sendProviderDetails = require("../services/sendDetails/send_provider_details");

exports.sendUser = (req, res) => {
  res.message = "success";
  res.userDetails = req.user;

  if (res.userDetails["type"] === "customer") {
    return sendCustomerDetails(res);
  }
  //? else
  return sendProviderDetails(res);
};

exports.deleteUser = (req, res, next) => {
  // const sql_userID = req.userID;
  const userIDFromParams = req.params.id;

  // if (sql_userID != userIDFromParams)
  //   return next({ message: "token and id does not match" });
  // //? else
  sql.deleteUser(userIDFromParams, function (err, result) {
    if (err) return next({ message: err.message });
    //? else
    return res.status(200).json({
      status: 200,
      message: "deleted successfully",
    });
  });
};

exports.updateCustomer = (req, res, next) => {
  const paramsToSend = {
    user_id: req.user["user_id"],
    username: req.body.username,
    phonenumber: req.body.phonenumber,
    profileimage: req.body.profileimage,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    door_number: req.body.door_number,
    street: req.body.street,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
  };
  sql.updateCustomer(paramsToSend, function (err, result) {
    if (err) return next({ message: err.message });
    res.message = "updated successfully";
    res.userDetails = result;
    return sendCustomerDetails(res);
  });
};

exports.updateProvider = (req, res, next) => {
  const paramsToSend = {
    user_id: req.user["user_id"],
    shop_name: req.body.shop_name,
    contact_number: req.body.contact_number,
    images: req.body.images,
    damaged_can_cost: req.body.damaged_can_cost,
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    door_number: req.body.door_number,
    street: req.body.street,
    city: req.body.city,
    state: req.body.state,
    zip_code: req.body.zip_code,
    country: req.body.country,
  };
  sql.updateProvider(paramsToSend, function (err, result) {
    if (err) return next({ message: err.message });
    res.message = "updated successfully";
    res.userDetails = result;
    return sendProviderDetails(res);
  });
};
