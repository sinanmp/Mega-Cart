const cartDb = require("../model/cartSchema")
const userDb = require("../model/userModel");
const productDb = require("../model/productModel");
const wishdb = require("../model/wishlistSchema");
const categoryDb=require("../model/categorySchema")


exports.addtocart = (req, res) => {
  const email = req.session.isAuth;
  const id = req.session.prId;
  userDb.findOne({ email: email })
    .then(data => {
      if(data){
        productDb.findOne({_id:id})
        .then(productData=>{
          const cart = new cartDb({
            email: email,
            pname:productData.pname,
            prId: id,
            cartQhantity:1,
            price:productData.price,
            discount:productData.discount,   
            description:productData.description,
            stock:productData.stock,  
            prd_images:productData.prd_images,
            category:productData.category,
            catStatus:productData.catStatus,
            unlist:productData.unlist,
            discountedPrice:productData.discountedPrice
          });
          cartDb.findOne({email:email,prId:id})
          .then(cartdata=>{
            if(cartdata){
              req.session.addtocart = false;
              cartDb.deleteOne({ prId: id, email: email })
                .then(data => {
                  // Display error popup
                  res.redirect(`/single/prd`);
                })
                .catch(err => {
                  console.log("product not removed from cart")
                });
            }else{
              cart.save()
              .then(data => {
                req.session.addtocart = true;
                res.redirect(`/single/prd`);
              })
            }
          })
            .catch(err => {    
              res.send(err)    
            }); 
        })
      }else{
        res.send("hii")
      }
   
    })
    .catch(err => {
      res.end()
    });
};



exports.wishlistToCart=(req,res)=>{
  const id=req.query.id
  const stock=req.query.stock
  cartDb.findOne({email:req.session.isAuth,prId:id})
  .then(cartdata=>{
    if(cartdata){
      console.log("its coming cartdata")
      cartDb.deleteOne({email:req.session.isAuth,prId:id})
      .then(data=>{
        res.redirect(`/wishlist?email=${email}`)
        console.log("data deleted successfully")
      })
    }else{
      productDb.findOne({_id:id})
      .then(productData=>{
        console.log("its not coming cartdata")
        const cart=new cartDb({      
          email: req.session.isAuth,
          pname:productData.pname,
          prId: id,
          cartQhantity:1,
          price:productData.price,
          discount:productData.discount,   
          description:productData.description,
          stock:productData.stock,  
          prd_images:productData.prd_images,
          category:productData.category,
          catStatus:productData.catStatus,
          unlist:productData.unlist,
          discountedPrice:productData.discountedPrice
        })
        cart.save(cart)
        .then(data=>{
          console.log("its coming also here")
          res.redirect(`/cart`)  
        })  
      })
    
    }
 
  }).catch(err=>{
    res.send(err)
  })
}



exports.cart = async (req, res) => {
  try {
    req.session.prId = null;
    const email = req.session.isAuth;
    req.session.coupen=false
    const cartData = await cartDb.find({ email: email });

    const productIds = cartData.map((item) => item.prId);

    const data = await productDb.find({ _id: { $in: productIds } });

    let sum = 0;

    for (let i = 0; i < data.length; i++) {
      const data1 = await cartDb.findOne({
        prId: data[i]._id,
        email: req.session.isAuth,
      });

      const discount = data[i].discount;
      const disPrice = data[i].price * (discount / 100);
      const showPrice1 = data[i].price - disPrice;
      const count = showPrice1 * data1.cartQhantity;

      sum += count;
    }

    req.session.totalPriceinPrid = sum;
    req.session.totalForDisplay=sum

    const wishdata = await wishdb.find({ email: email });
    const catData = await categoryDb.find({ status: true });
    const productQhuantity = cartData.map((item) => item.cartQuantity);
    const userData = await userDb.findOne({ email: email });

    res.render("cart", {
      cartItems: cartData,
      totalPrice: sum,
      email: email,
      wishdata: wishdata,
      catogories: catData,
      email: email,
      userData: userData,
    });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
  }
};





exports.removeCart = (req, res) => {
  const productId = req.query.id
  cartDb.deleteOne({ email: req.session.isAuth, prId: productId })
    .then(data => {
      console.log("its coming here")
      res.redirect(`/cart`)
    }).catch(err => {
      res.send(err + "  this is remove catch error")
    })
}


exports.updateQuantity = async (req, res) => {
  const prId = req.query.id;
  const delta = parseInt(req.query.delta);
  try {
    const cartItem = await cartDb.findOne({ prId: prId, email: req.session.isAuth });

    if (!cartItem) {
      return res.json({ success: false, message: "Item not found in the cart" });
    }
    const newQuantity = cartItem.cartQhantity + delta;
    const stockQuantity=cartItem.stock

    if (newQuantity >= 1 && newQuantity<= stockQuantity ||delta==-1 &&newQuantity >= 1) {

      await cartDb.updateOne({ prId: prId, email: req.session.isAuth }, { $set: { cartQhantity: newQuantity } });
      res.json({ success: true, newQuantity: newQuantity ,stockQuantity:stockQuantity});
    } else {
      res.json({ success: false, message  : "Quantity cannot be less than 1" });
    }
  } catch (error) {
    console.error("Error updating quantity:", error);
    res.json({ success: false, message: "Internal server error" });
  }
};

exports.cartCountPr=async(req,res)=>{
  const email=req.query.email
  const data= await cartDb.find({email:email})
  res.send(data)
}





exports.getTotalPrice = async (req, res) => {
  try {
    const cartItems = await cartDb.find({ email: req.session.isAuth });
    let totalPrice = 0;
    let productTotalPrices = {};


    cartItems.forEach(item => {
      const productTotal = item.cartQhantity * (item.price - (item.price * item.discount / 100));
      totalPrice += productTotal;
      productTotalPrices[item.prId] = productTotal;
    });
    req.session.totalPriceinPrid=totalPrice
    req.session.totalForDisplay=totalPrice
    res.json({ success: true, totalPrice: totalPrice, productTotalPrices: productTotalPrices });
  } catch (error) {
    console.error("Error calculating total price:", error);
    res.json({ success: false, message: "Internal server error" });
  }
};






