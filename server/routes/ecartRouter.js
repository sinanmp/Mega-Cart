const ecartController = require("../controller/ecartHelper")
const express = require("express");
const router = express.Router();



router.post('/addProduct',ecartController.addProduct)
router.get("/getProducts",ecartController.getProducts)
router.post("/ecartUser",ecartController.ecartUser)
router.post("/ecartLogin",ecartController.ecartLogin)
router.post('/ecartAddToCart',ecartController.addtocart)
router.get("/ecartCartPage",ecartController.cart)

router.post("/addBanner",ecartController.addBanner)
router.get("/getBanner",ecartController.getBanner)
router.delete("/ecartRemoveCart",ecartController.removeFromCart)
router.patch('/quantityUpdate',ecartController.updateCount)

module.exports = router;