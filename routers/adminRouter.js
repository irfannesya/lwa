const router = require('express').Router();
const middeleware = require("../middleware");
const adminControler = require("../controller/admin-controller")



router.post("/adminlogin", adminControler.loginAdmin);
router.post ("/adminLogout", middeleware.admin, adminControler.logoutAdmin);




module.exports = router;