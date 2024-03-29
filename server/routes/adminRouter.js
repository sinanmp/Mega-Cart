const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");
const adminServices = require('../services/adminRender');
const productController = require("../controller/productController");
const categoryController = require("../controller/categoryController")
const adminAuthMiddleware = require("../routes/middlewares/adminMiddleware")
const orderController = require("../controller/orderController")
const coupenController = require("../controller/coupenController")
const bannerController= require("../controller/bannerController")
const upload = require("../routes/middlewares/imageUpload")


//login
router.get("/adminLogin", adminAuthMiddleware.adminIsnotAuth, adminServices.login);

router.post("/api/admin1", adminController.register);



//admin contents     
router.get("/adminDash", adminAuthMiddleware.adminIsAuth, adminServices.dash)
router.get("/admin-order", adminAuthMiddleware.adminIsAuth, adminServices.order)
router.get("/order/list/admin", adminController.orderList)
router.get("/admin-users", adminAuthMiddleware.adminIsAuth, adminServices.users)
router.get("/add-products", adminAuthMiddleware.adminIsAuth, productController.addingProduct)
router.get("/api/users", adminController.find);
router.post("/get/chart",adminController.getChart)



//product managment
router.get("/admin-products", adminAuthMiddleware.adminIsAuth, productController.products)
router.post("/api/add-product", upload, productController.addProduct);
router.get("/updateProduct", productController.updateProcduct)
router.post("/api/update/product", productController.productUpdate)
router.get("/api/delete/product", productController.deleteProduct)
router.get("/unlist/api", productController.unlist)
router.get("/remove/unlist", productController.removeUnlist)
router.get("/api/block", adminController.block);
router.get("/user-details", adminServices.usersDetails);

//order managment
router.post("/change/status", orderController.changeStatus)
router.get("/admin/individualOrder",orderController.individualOrder)



//image 
router.get("/image-delete", productController.removeImage)
router.post("/upload/img", upload, productController.uploadImage);
router.get("/add/images", productController.addImages)

router.get("/api/countUsers", adminController.countUsers)
router.get("/api/countOrders", adminController.countOrders)


//category managment
router.get("/category/api", categoryController.category)
router.get("/single/cat", categoryController.singleCat)
router.get("/add/category", categoryController.addCategory)
router.post("/add/cat/post", categoryController.addCatPost)
router.get("/delete/cat", categoryController.deleteCat)
router.get("/unlisted/cat", categoryController.unlist)
router.get("/remove/funlist", categoryController.removeFUnlist)
router.get("/admin/logout", adminServices.logout)


//coupens managment
router.get("/coupen/api", adminServices.GetCoupenPage)
router.get("/addCoupen/api", adminServices.addCoupen)
router.post("/addCoupen/post", coupenController.addCoupenPost)
router.get("/getCoupens", coupenController.getCoupens)
router.get("/expiredCoupens", coupenController.expiredCoupens)
router.get("/unlist/coupens", coupenController.unlistCoupens)
router.get("/restore/coupens", coupenController.restoreCoupens)


 

//banner managment
router.get("/banners/api",bannerController.getBanners)
router.get("/addBanner",bannerController.addBanner)
router.post("/addCoupen",upload ,bannerController.addPost)
router.get("/unlist-banner",bannerController.unsilst)
router.get("/Unlisted-Banners",bannerController.unlistedBanners)
router.get("/restore-banner",bannerController.restoreBanner)


module.exports = router;