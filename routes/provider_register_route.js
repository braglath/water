const express = require("express");
const router = express.Router();

const validation = require("../middlewares/validations/validate_provider_registration_fields");
// const hashPassword = require("../middlewares/registration/hash_password");
// const registrationController = require("../controllers/customer_register_user");
const getIDFromToken = require("../middlewares/jwt_verify_middleware");
const providerRegisterController = require("../controllers/provider_register_user");

router.post(
  "/",
  /// validate each fields
  validation,
  getIDFromToken,
  providerRegisterController.registerProvider
  //?   registrationController.checkUserExists,
  /// if no existing user
  /// hash the password
  //?   hashPassword,
  /// register and save user to DB and get the user details from DB
  //?   registrationController.registerUser
);

module.exports = router;
