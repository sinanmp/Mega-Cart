const tudoController = require("../controller/tudoController")
const express = require("express");
const router = express.Router();



router.get('/getData',tudoController.getData)
router.post("/addData", tudoController.addData)
router.get("/checked",tudoController.checked)
router.get("/delete",tudoController.delete)





module.exports = router;

