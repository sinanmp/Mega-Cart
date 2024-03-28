const ecartController = require("../controller/ecartHelper")
const express = require("express");
const router = express.Router();



router.post('/addProduct',ecartController.addProduct)
router.get("/getProducts",ecartController.getProducts)
router.post("/ecartUser",ecartController.ecartUser)
router.post("/ecartLogin",ecartController.ecartLogin)
router.post('/ecartAddToCart',ecartController.addtocart)
router.get("/ecartCartPage",ecartController.cart)

module.exports = router;