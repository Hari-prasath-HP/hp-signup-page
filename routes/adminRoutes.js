const express = require("express");
const adminrouter = express.Router();
const userController = require('../controllers/adminControllers');
// handle admin dashboard page
adminrouter.get('/adminDashboard', userController.handleadminDashboard);
// routing to login page
adminrouter.get("/admin",userController.routerAdminlogin);
//handle login page
adminrouter.post("/adminLogin",userController.handleAdminlogin);
//render to dashboard
adminrouter.get('/adminDashboard',userController.renderDashboard );
// handle logout
adminrouter.post("/adminlogout",userController.handleadminLogout)
// add user
adminrouter.post("/adduser",userController.addUser)
// route edit
adminrouter.get('/editUser/:id',userController.routeedit);
// handle edit
adminrouter.post('/updateUser/:id',userController.handleEdit);
//get delete
adminrouter.get('/deleteUser/:id', userController.handleDelete);

module.exports = adminrouter;