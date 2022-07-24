const express = require("express");
const router = express.Router();

const getUserFromSql = require("../middlewares/crud/get_user_details_sql");
const controller = require("../controllers/user_crud_controller");
const customerProfileUpdateValidator = require("../middlewares/validations/validate_customer_profile_update");
const providerProfileUpdateValidator = require("../middlewares/validations/validate_provider_registration_fields");

router.get("/", (req, res) => {
  res.json({
    message: "add user id to url",
  });
});

// router.delete("/:id", controller.deleteUser);

router.put(
  "/:id/customer",
  customerProfileUpdateValidator,
  getUserFromSql,
  controller.updateCustomer
);

router.put(
  "/:id/provider",
  providerProfileUpdateValidator,
  getUserFromSql,
  controller.updateProvider
);

router.route("/:id").get(getUserFromSql, controller.sendUser);

module.exports = router;
