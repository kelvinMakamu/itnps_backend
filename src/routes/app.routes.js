const router   = require("express").Router();
/********
 * 
 * CTRLS
 *
**********/
const authCtrl      = require('../controllers/auth.controller');
const userCtrl      = require('../controllers/user.controller');
const resCtrl       = require('../controllers/response.controller');
const authorized    = [ authCtrl.validateToken ];
/*****
 * 
 * AUTH
 *
********/
router.post("/auth/login", authCtrl.login);
router.post("/auth/register", authorized, authCtrl.registerUser);
//router.post("/auth/reset", authorized, authCtrl.resetPassword);
/******
 * 
 * USERS
 *
********/
router.get("/users", authorized, userCtrl.findUsers);
router.get("/users/:id", authorized, userCtrl.findUserById);
router.post("/users/:id", authorized, userCtrl.updateUserById);
router.get("/users/:managerId/agents", authorized, userCtrl.getUserAgentsById);
router.get("/users/userLevel/:level", authorized, userCtrl.findUserByLevel);
router.post("/users/assign/manager", authorized, userCtrl.assignAgentsToManager);

/*********
 * 
 * RESPONSES
 *
**************/
router.get("/responses", authorized, resCtrl.findResponses);
router.post("/responses", authorized, resCtrl.createResponse);
router.get("/responses/:id", authorized, resCtrl.findResponseById);
router.post("/responses/users", authorized, resCtrl.getUserResponses);
router.post("/responses/users/period", authorized, resCtrl.getPeriodicUserResponses);
router.post("/responses/dashboard", authorized, resCtrl.getDashboardStats);

module.exports  = router;