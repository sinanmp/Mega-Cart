const blockDb = require("../model/blockModel");
const userDb = require("../model/userModel");
const productDb = require("../model/productModel")
const orderDb=require("../model/orderSchema")
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const otpDb = require("../model/otpModel")
const catogorydb = require("../model/categorySchema")
const bcrypt = require("bcrypt");
const cartDb = require("../model/cartSchema");
const Razorpay=require("razorpay")
const wishdb = require("../model/wishlistSchema")

const axios=require("axios")

dotenv.config()


const razorpayInstance = new Razorpay({
  key_id: process.env.KEY_VALUE,
  key_secret: process.env.KEY_SECRET,
});



let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.PASSWORD
  },
});




const sendOTPVerificationeEmail = async (email) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const OTP = parseInt(otp);


    // Use email without destructuring
    const mailoption = {
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: "verify your email",
      html: `<p>The code of your email to verify is <br> ${OTP} </br> the OTP will expire in 5 minutes  </p>`
    };


    const newVerification = await new otpDb({
      email: email,
      otp: OTP,
      createdAt: Date.now(),
      expiresAt: Date.now() + 300000
    })
    
    await transporter.sendMail(mailoption, (err) => {
      if (err) {
        console.log(email)
        console.log(err + "  send email error");
        return;
      } else {
         newVerification.save()
        console.log("Otp send successfully!");
      }
    });
  } catch (err) {
    console.log("catch error:", err);
  }
};









exports.create = (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.confirmpassword || !req.body.mobile || !req.body.username) {
    req.session.bodyEmitty = true;
    res.redirect("/signup")
    console.log("req.body is emty right")
    return;
  }
  //
  // password=confirmpassword
  if (req.body.password !== req.body.confirmpassword) {
    req.session.passwordnotMatch = true
    res.redirect("/signup")
    return
  }
  userDb.findOne({ email: req.body.email })
    .then(data => {
      if (data) {
        console.log("email is already exists")
        req.session.registrationError = true;
        res.redirect("/signup")
        return
      } else {
        const hashedPass = bcrypt.hashSync(req.body.password, 10)



        const users = new userDb({
          block: "false",
          username: req.body.username,
          email: req.body.email,
          password: hashedPass,
          mobile: req.body.mobile,
          confirmpassword: hashedPass,
          status: "Inactive",
          verified: false
        });
        users.save()
          .then(data => {
            setTimeout(() => {
              sendOTPVerificationeEmail(data.email);
              res.render("otp", { user: req.body.email });
            }, 1000);

          })
          .catch(err => {

            res.redirect("/signup");
            console.log(err);
          });
      }

    }).catch(err => {
      res.send(err)
    })


}





exports.find = (req, res) => {

  const epass = req.body.password

  userDb.findOne({ email: req.body.email })
    .then(userData => {
      if (userData) {
        if (bcrypt.compareSync(req.body.password, userData.password)) {
          blockDb.findOne({ email: req.body.email })
            .then(data => {
              if (data) {
                res.render('userblockd')
              } else {
                userDb.updateOne({ email: req.body.email }, { $set: { status: "Active" } })
                  .then(resdata => {
                    console.log(userData.status)
                    req.session.isAuth = userData.email
                    res.redirect("/");
                  }).catch(err => {
                    req.session.invalidMail=true
                    res.send(err)
                  })
              }
            }).catch(err => {
              req.session.invalidMail=true
              req.session.errEmail=req.body.email
              res.redirect("/login");
              console.log(err);
            })
        } else {
          req.session.passborder=true
          req.session.errEmail=req.body.email
          res.redirect("/login"); 
          console.log("User not found invalid pass");
          // invalid password
        }
      } else {
        //invalid email
        req.session.emailborder=true
        req.session.errEmail=req.body.email
        res.redirect("/login");
        console.log("User not found null");
        // null output
      }
    })
    .catch(err => {
      res.status(500).send('Internal Server error', err)
    })
}




exports.userHome = async (req, res) => {
  req.session.prId=null
  const searchQuery = req.query.search; 
  try {
    const Nemail = req.session.isAuth;

    const [products, userdata, wishdata] = await Promise.all([
      productDb.find({ catStatus: true, unlist: false }),
      userDb.find({ email: Nemail }),
      wishdb.find({email:Nemail})
    ]);
   const productIds=products.map((item) => item._id) 
   const wishIds = wishdata.map((item) => item.prId);
   if(wishIds[0]==productIds[0]){
    console.log(productIds[0])
    console.log(wishIds[0])
   } 

   for(let i=0;i<products.length;i++){
       for(let j=0;j<wishIds.length;j++){
        if(products[i]._id==wishIds[j]){
          const index=products.indexOf(products[i])
        }
       }
   }
   catogorydb.find({status:true})
   .then(catData=>{
    res.render("home", { products, userAuth: Nemail, user: userdata,wishlists:wishIds,searchQuery,catData:catData});
   })
  } catch (err) {
    console.error(err);     
    res.render("home", { products: null, userAuth: req.session.isAuth, block: null,searchQuery});
  }
};
              





exports.logout = (req, res) => {
  req.session.registrationError;
  req.session.isAuth = null
  const nemail = req.body.email
  userDb.updateOne({ email: nemail }, { $set: { status: "Inactive" } })
    .then(data => {
      console.log(data.data)
      req.session.registrationError = true;
      res.redirect("/login");
    }).catch(err => {
      res.send(err)
    })
}

exports.singlePrd = (req, res) => {
  console.log(req.session.prId , "this is prid in single product")
  const prId = req.session.prId;
  console.log(prId)
  const { quantity } = req.body;
  console.log(quantity + "product quantity")
  console.log(prId + "this is prId")
  productDb.findOne({ _id: prId })
    .then(pdata => {
      if (!pdata) {
        // Handle the case when pdata is null or undefined
        res.send("Product not found");
        return;
      }
      cartDb.find({ prId: prId,email:req.session.isAuth})
        .then(cartdata => {
          console.log(cartdata)
          userDb.findOne({ email: req.session.isAuth })
            .then(data => {
              wishdb.findOne({ prId: prId,email:req.session.isAuth})
              .then(wishdata=>{
                res.render("userSinglePrd", { product: pdata, email: req.session.isAuth, cart: cartdata,wishdata:wishdata});
              })             
            })

        })


    })
    .catch(err => {
      console.log("prd catch error", err);
      res.send(err);
    });
};






exports.verify = (req, res) => {
  const bodyOtp = req.body.otp1 + req.body.otp2 + req.body.otp3 + req.body.otp4
  otpDb.findOne({ otp: bodyOtp })
    .then(data => {
      console.log(data.expiresAt)
      if (data.expiresAt > Date.now()) {
        userDb.findOne({ email: data.email })
          .then(userData => {
            console.log(userData)
            userDb.updateOne({ email: data.email }, { $set: { status: "Active", verified: true } })
              .then(data => {
                otpDb.deleteOne({ otp: bodyOtp }).then(data => {
                  console.log(userData.email);
                  req.session.isAuth = userData.email
                  res.redirect('/');
                }).catch(err => {
                  res.send(err)
                })
              }).catch(err => {
                res.send(err)
              })
          })
      } else {
        res.send("otp time finished")
        console.log("else error")
      }
    }).catch(err => {
      console.log(err)
    })

}


exports.userverify = (req, res) => {
  const qemail = req.query.email
  sendOTPVerificationeEmail(qemail);
  res.render("otp", { user: qemail });
}

exports.resendOtp = (req, res) => {
  const qemail = req.query.email
  otpDb.deleteOne({ email: qemail })
    .then(data => {
      sendOTPVerificationeEmail(qemail);
      res.render("otp", { user: qemail })
    }).catch(err => {
      res.send(err)
    })
}



exports.ourStore = (req, res) => {
  const catFilter = req.query.catFilter;
  const searchQuery = req.query.search;
  const min=req.query.min
  const max=req.query.max
  req.session.priceError=false
  const filter = { catStatus: true, unlist: false };
  if (catFilter) {
    filter.category = catFilter;
  }

  if (min && max) {
    if(max>min){
    filter.discountedPrice = { $gte: parseInt(min), $lte: parseInt(max) };
    }else{
     req.session.priceError=true
    }
  } else if (min) {
    filter.discountedPrice = { $gte: parseInt(min) };
  } else if (max) {
    filter.discountedPrice = { $lte: parseInt(max) }; 
  }

  if (searchQuery) {
    filter.$or = [
      { pname: { $regex: new RegExp(searchQuery, 'i') } },
      { category: { $regex: new RegExp(searchQuery, 'i') } }
    ];
  }
  productDb.find(filter)
    .then(data => {
      catogorydb.find({ status: true })
      .then(catData => {
        res.render("our-store", {
          products: data,
          email: req.session.isAuth,
          catogories: catData,
          searchQuery,  
          catFilter,   
          priceError:req.session.priceError,
          min:min,
          max:max
        },(error,html)=>{
          if(error){
            return 
          }    
          delete req.session.priceError 
          res.send(html)
        });
  
        })
    })
    .catch(error => {
      console.error("Error fetching products:", error);
      res.status(500).send("Internal Server Error");
    });
};


exports.addAddress = (req, res) => {
  const id = req.query.id

  const newAddress = {
    locality: req.body.locality,
    country: req.body.country,
    district: req.body.district,
    state: req.body.state,
    city: req.body.city,
    altr_number: req.body.altr_number,
    postcode: req.body.postcode,
    house_No: req.body.HouseNumber
  };

  userDb.updateOne({ _id: id },
    { $push: { address: newAddress } })
    .then(data => {
      res.redirect(`/userDetails?email=${req.session.isAuth}`)
    }).catch(err => {
      res.send(err)
    })
}



exports.changeIndex = (req, res) => {
  const email = req.session.isAuth;
  const adId = req.query.position;

  userDb.find({ email: email })
    .then(data => {

      res.redirect(`/userDetails?email=${req.session.isAuth}&position=${adId}`);

    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500); // Use res.sendStatus instead of res.send(status)
    });
};


exports.adDelete = (req, res) => {
  const email = req.session.isAuth;
  const id = req.query.id;
  console.log(id)
  console.log(`Attempting to remove address with _id: ${id} for email: ${email}`);

  userDb.updateOne(
    { email: email },
    { $pull: { address: { _id: id } } }
  )
    .then(data => {
      res.redirect(`/userDetails`);
    })
    .catch(err => {
      console.error(`Error removing address for email: ${email}`, err);
      res.send(err);
    });
};


exports.updateCheck = (req, res) => {
  const email = req.session.isAuth;
  const username = req.query.username;
  const mobile = req.query.mobile;
  try {
    if (username) {
      res.render("CheckPass", { email: email, username: username, mobile: null });
    } else {
      res.render("CheckPass", { email: email, username: null, mobile: mobile });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}




exports.updateUser = (req, res) => {
  const email = req.session.isAuth
  const username = req.query.username
  const mobile = req.query.mobile
  userDb.find({ email: email, password: req.body.password })
    .then(data => {
      if (data) {
        if (username) {
          res.render("userUpdate", { username: username, mobile: null, email: email })
        } else {
          res.render("userUpdate", { username: null, mobile: mobile, email: email })
        }
      } else {
        res.send("incorrect password")
      }
    })

}



exports.updatePost = (req, res) => {
  const email = req.query.email
  const username = req.body.username
  const mobile = req.body.mobile
  if (username) {
    userDb.updateOne({ email: email }, { $set: { username: username } })
      .then(data => {
        res.redirect(`/userDetails?email=${email}`);
      }).catch(err => {
        res.sent(err)
      })
  } else {
    userDb.updateOne({ email: email }, { $set: { mobile: mobile } })
      .then(data => {
        res.redirect(`/userDetails?email=${email}`);
      }).catch(err => {
        res.send(err)
      })
  }

}


exports.updateAddress = (req, res) => {
  const pos = req.query.pos
  const id = req.query.id
  userDb.findOne({ email: req.session.isAuth, 'address._id': id })
    .then(data => {
      for (let i = 0; i < data.address.length; i++) {
        if (data.address[i]._id == id) {
          res.render("addressUpdate", { address: data.address[i], pos: pos })
        }
      }
    }).catch(err => {
      res.send(err)
    })
}



exports.updatePostAdd = (req, res) => {
  const id = req.query.id
  const pos = req.query.pos
  const newAddress = {
    locality: req.body.locality,
    country: req.body.country,
    district: req.body.district,
    state: req.body.state,
    city: req.body.city,
    altr_number: req.body.altr_number,
    postcode: req.body.postcode,
    house_No: req.body.HouseNumber
  };
  console.log(pos + " this is position  ")
  userDb.updateOne({ email: req.session.isAuth, 'address._id': id },
    { $set: { [`address.${pos}`]: newAddress } })
    .then(data => {
      userDb.updateOne(
        { email: req.session.isAuth },
        { $pull: { address: { _id: id } } }
      )
      res.redirect(`/userDetails?email=${req.session.isAuth}`)
    }).catch(err => {
      res.send(err)
    })
}






exports.sendOtpForgot = (req, res) => {
  const email = req.body.email
  req.session.emailforVerify=email
  userDb.findOne({ email: email })
    .then(data => {
      if (data) {
        sendOTPVerificationeEmail(data.email)
        res.render("forgotOtp", { user: email })
      } else {
        req.session.forgottemailError = true
        res.redirect("/forgot/get")
      }
    })
}



exports.forgotVerify = (req, res) => {
  const email = req.session.emailforVerify
  const bodyOtp = req.body.otp1 + req.body.otp2 + req.body.otp3 + req.body.otp4

  otpDb.findOne({ otp: bodyOtp })
    .then(data => {
      if (data.expiresAt > Date.now()) {

        res.redirect(`/forgot/Verify`)
        otpDb.deleteOne({ otp: bodyOtp }).then()
      } else {
        res.send("otp timer is expired");
      }
    }).catch(err => {
      res.send("invalid otp")
    })
}



exports.mainforgetPass = (req, res) => {
  const email = req.session.emailforVerify
  const pass = req.body.password
  const cpass = req.body.conformpass
  if (pass !== cpass) {
    req.session.passcpass = true;
    req.session.changesuccess = false;
    // res.send('working')
    return res.redirect(`/forgot/Verify`)
  }
  const hashedPass = bcrypt.hashSync(pass, 10)
  userDb.updateOne({ email: email }, { $set: { password: hashedPass, confirmpassword: hashedPass } })
    .then(data => {
      req.session.passcpass = false
      req.session.changesuccess = true
      setTimeout(() => {
        req.session.passcpass = false
        res.redirect("/login")
      }, 2000);

    }).catch(err => {
      res.send("somthing errors finded" + err)
    })
}




exports.checkoutFetch=(req,res)=>{
  const totalPrice=req.query.total
  const email=req.query.email
  userDb.findOne({email:email})
  .then(data=>{
    res.send(data)
  }).catch(err=>{
    res.send(err)
  })
}


exports.addressPostCheckout=(req,res)=>{
  req.session.paymentMidd='false'
  const userEmail = req.session.isAuth;
  const price=req.session.totalPriceinPrid
  const prId=req.session.prId
  const newAddress = {
    locality: req.body.locality,
    country: req.body.country,
    district: req.body.district,
    state: req.body.state,
    city: req.body.city,
    altr_number: req.body.altr_number,
    postcode: req.body.postcode,
    house_No: req.body.HouseNumber
  };

  userDb.updateOne({ email: userEmail },
    { $push: { address: newAddress } })
    .then(data => {
      axios.get(`http://localhost:3000/api/checkout?&email=${userEmail}`)
      .then(response=>{
        const userData=response.data
        const address=userData.address
        const index=req.query.index ||address.length-1
          res.render("checkout",{userData:response.data,total:price,a:index,prId:prId})
      })
    }).catch(err => {
      res.send(err)
    })
}



exports.orderList=(req,res)=>{
  const email=req.query.email
  orderDb.find({email:email}).sort({orderDate:-1})
  .then(data=>{
    res.send(data)
  })
}



exports.walletAdd = async (req, res) => {
  let amount = req.body.amount;
  const email = req.query.email;
  console.log(email + amount);
  amount=Number(amount)  
  // Creating random id
  try {
    const randomOrderID = Math.floor(Math.random() * 1000000).toString();
    const options = {
      amount: amount,
      currency: "INR",
      receipt: randomOrderID,
    };
     
    razorpayInstance.orders.create(options, async(err) => {
      if (!err) {
        console.log("Reached RazorPay Method on cntrlr", randomOrderID);
        res.status(200).send({
          razorSuccess: true,
          msg: "order created",
          amount: amount * 100,
          key_id: process.env.KEY_VALUE,
          name: "Sinan",
          contact: "9037317210",
          email: "sinanmhd5817@gmail.com",
        });
      } else {
        console.error("Razorpay Error:", err);
        res.status(400).send({
          razorSuccess: false,
          msg: "Error creating order with Razorpay",
        });
      }
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send({
      razorSuccess: false,
      msg: "Internal Server Error",
    });
  }
};



exports.walletFetch=async(req,res)=>{
  const email=req.query.email
  const up=req.query.update
  const amount=req.query.amount
  if(up){
    await userDb.updateOne({email:email},{$inc:{wallet:amount}})
  }
  const data= await userDb.findOne({email:email})
  res.send(data)
}



exports.walletUpdate = async (req, res) => {
  try {
      const amount = req.query.amount;
      const email = req.query.email;

      const transaction = {
        date: new Date(),
        category: 'deposit',  
        amount: parseInt(amount), 
        description:"Added in Wallet"
    };
     
    console.log(transaction)

    const updatedUser = await userDb.findOneAndUpdate(
      { email: email },
      {
          $inc: { 'wallet.totalAmount': parseInt(amount) },
          $push: { 'wallet.transactions': transaction }
      },
      { new: true }
  );

      res.send(email);
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
  }
};


exports.fetchTotalWalletAmount=async(req,res)=>{
  const email=req.query.email
  const data= await userDb.findOne({email:email})
  res.send(data)
}



exports.takeProductPrice=async(req,res)=>{
  const id=req.query.id
 const prdata=await productDb.findOne({_id:id})

 res.send(prdata)
}





exports.walletPayment = (req, res) => {
  console.log(req.session.takingFromWallet)
  let { waletTotalAmount, checkedW ,totalAmount} = req.body;
  req.session.DisplayAmount= req.session.totalPriceinPrid-waletTotalAmount
  waletTotalAmount=Number(waletTotalAmount)
  if (waletTotalAmount < req.session.totalPriceinPrid) {
    if (checkedW) {
      req.session.takingFromWallet =  waletTotalAmount;
      req.session.DisplayAmount=req.session.totalForDisplay-waletTotalAmount
      console.log("its coming here")
    } else {
      req.session.takingFromWallet = 0
      console.log("its coming else")
      if(req.session.DisplayAmount<=req.session.totalPriceinPrid){
        console.log("its coming here condition")
        req.session.DisplayAmount=Number(req.session.totalForDisplay)  
        console.log(req.session.totalForDisplay)
      }
  
    }
    res.json({ takingFromWallet: req.session.takingFromWallet, DisplayAmount: req.session.DisplayAmount});
  } else {
    if(checkedW){
      req.session.takingFromWallet = totalAmount;
      req.session.DisplayAmount=0
    }else{
      console.log(totalAmount)
      req.session.DisplayAmount=totalAmount
      req.session.takingFromWallet = 0
    }
    res.json({ takingFromWallet: req.session.takingFromWallet, DisplayAmount: req.session.DisplayAmount });
  }
};






