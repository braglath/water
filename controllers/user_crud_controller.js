const sql = require("../services/sql/delete_user");
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
