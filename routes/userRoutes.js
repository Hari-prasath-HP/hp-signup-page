const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController');


router.get("/signup",userController.renderSignup);

router.get("/",userController.renderLogin);

router.post("/signup",userController.handleSignup);

router.get("/login",userController.Login);

router.post("/login",userController.handleLogin);

router.get("/home",userController.renderHomepage);

router.post("/logout",userController.handleLogout)

module.exports = router;