import { Router } from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
} from "../controllers/user.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { employeeList } from "../controllers/createemployeeList.controller.js";
import {
  getEmployeeList,
  getSingleEmployee,
  removeEmployee,
  updateEmployee,
} from "../controllers/employeeList.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { check, validationResult } from "express-validator";

const router = Router();
router
  .route("/register")
  .post(
    [
      check(
        "id",
        "id should be atleast 3 digit and it should be unique"
      ).isLength({ min: 3 }),
      check(
        "username",
        "username is required and it should be atleast 3 char"
      ).isLength({ min: 3 }),
      check(
        "password",
        "password is required and it should be at least 5 char"
      ).isLength({ min: 5 }),
    ],
    registerUser
  );
router
  .route("/login")
  .post(
    [
      check("username", "username is required").isLength({ min: 3 }),
      check("password", "password is required").isLength({ min: 5 }),
    ],
    loginUser
  );
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/removeEmployee/:id").delete(removeEmployee);
router.route("/createEmployee").post(upload.single("image"), employeeList);
router.route("/employeeList").get(getEmployeeList);
router.route("/singleEmployee/:id").get(getSingleEmployee);
router.route("/updateEmployee/:id").put(upload.single("image"), updateEmployee);

export default router;
