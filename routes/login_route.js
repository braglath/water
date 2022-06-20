const express = require("express");
const router = express.Router();

const validation = require("../middlewares/validations/validate_login_fields");
const userDetails = require("../middlewares/login/get_user_details");
const loginController = require("../controllers/login_user");

router.post(
  "/",
  validation,
  /// check if there is already a user with that phonenumber
  userDetails.getUseDetails,
  userDetails.checkDeviceToken,
  loginController
);

module.exports = router;
