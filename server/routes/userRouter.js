const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const userServices = require('../services/userRender')
const cartController = require("../controller/cartController");
const wishlistController=require("../controller/wishlistController")
const orderController=require("../controller/orderController")
const {paymentMiddleware ,isAuthMiddleware} = require("../routes/middlewares/userMiddleware");
const reviewController= require("../controller/reviewController")


router.get('/', userController.userHome)//home
router.get('/login', userServices.login)
router.get('/signup', userServices.signup);
router.get("/userDetails",isAuthMiddleware, userServices.userDeatails)


router.get("/take/productPrice",userController.takeProductPrice)
router.get("/single/prd", userController.singlePrd)
router.get("/cart",isAuthMiddleware, cartController.cart)
router.get("/cartTo/wishlist",isAuthMiddleware,wishlistController.cartToWishlist)
router.get("/block-route",userServices.block)


router.get("/count/update-quantity",isAuthMiddleware, cartController.updateQuantity);
router.get("/count/get-total-price", cartController.getTotalPrice);
router.get("/remove/cart",isAuthMiddleware, cartController.removeCart)
router.get("/cart/api",isAuthMiddleware, cartController.addtocart)
router.get("/resend/otp", userController.resendOtp)      
router.get("/user/verify", userController.userverify)   
router.post("/verify/api", userController.verify)
router.get("/api/logout", userController.logout)
router.post("/api/create", userController.create);//use register api
router.post('/api/login', userController.find)//user login api   
router.get("/address/api",isAuthMiddleware, userServices.address)    
router.post("/address/add",isAuthMiddleware, userController.addAddress)
router.get("/update/address",isAuthMiddleware, userController.updateAddress)
router.post("/update/add",isAuthMiddleware, userController.updatePostAdd)
//our store
router.get("/our-store", userController.ourStore)
router.get("/changeIndex/api", userController.changeIndex)
router.get("/address/delete",isAuthMiddleware, userController.adDelete)
router.get("/update/passCheck",isAuthMiddleware, userController.updateCheck)
router.post("/Update/userRender", userController.updateUser)
router.post("/update/post/user", userController.updatePost)
//module export


//forgot pass
router.post("/address/addPostCheckout",isAuthMiddleware,userController.addressPostCheckout)
router.post("/checkout/address",isAuthMiddleware,userServices.changeAddress)
router.post("/chekcout/addAddress",isAuthMiddleware,userServices.checkoutAddAddress)
router.get("/api/checkout",userController.checkoutFetch)     
router.get("/checkout",userServices.checkout) 
router.get("/forgot/get", userServices.forgotget)
router.post("/send/otp/forgot", userController.sendOtpForgot)
router.post("/forgot/Verify", userController.forgotVerify)  
router.post("/main/forgotPass", userController.mainforgetPass)
router.get("/forgot/Verify", userServices.redirectForgot)
router.post("/setSession",userServices.setSession)


      
//wishlists api
router.get('/wish/api/cart',wishlistController.wishaddcart)
router.get("/wish/api",wishlistController.wishAdd)
router.get("/wishlist",wishlistController.goTowishlist)
router.get("/remove/wishlist",wishlistController.removeWishlist)
router.get("/wish/api/home",wishlistController.wishApiHome)
router.get("/wishlist/addtoCart",cartController.wishlistToCart)



//order managment
router.post("/submit/order",orderController.submitOrder)
router.get("/order/success",userServices.orderSuccess)
router.get("/user/orders",userServices.userOrders)
router.get("/order/list/user",userController.orderList)
router.get ("/cancel/order",orderController.cancel)
router.get("/api/reason",userServices.reason)
router.post("/cancel/reason",orderController.cancelMain)
router.get("/user-order/details",userServices.userOrdersDeatails)
router.post("/payment",paymentMiddleware,userServices.payment)
router.post("/order-route",orderController.orderRoute)
router.get("/cart/count",cartController.cartCountPr)
router.get("/fetch-order",orderController.fetchOrderD)
router.get("/cancel/singleProduct",orderController.singleCancel)
router.get("/return/order",orderController.returnOrder)

//wallet
router.get("/wallet",isAuthMiddleware,userServices.wallet)
router.post("/wallet-add",userController.walletAdd)
router.get("/wallet-fetch",userController.walletFetch)
router.get("/wallet/dataUpdate",userController.walletUpdate)
router.get("/fetch-wallet-total",userController.fetchTotalWalletAmount)
router.post("/wallet-payment",userController.walletPayment)
  
//
router.post("/applyCoupon",userController.applyCoupen)
router.get("/coupon-cancel",userController.couponCancel)



//reviews
router.get("/add/review",reviewController.reviewGet)
router.post("/review-submit",reviewController.reviewSubmit)

module.exports = router;