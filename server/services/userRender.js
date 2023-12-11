const userDb = require("../model/userModel");
const axios=require("axios")
const { users } = require("./adminRender");
const { response } = require("express");

exports.login = (req, res) => {
    
    res.render("login",{invalid:req.session.invalidMail},(err,html)=>{
        if(err){
            return
        }
        delete req.session.invalidMail
        req.session.registrationError=false
        res.send(html)
    });
}

exports.signup = (req, res) => {
    const bodyEmitty = req.session.bodyEmitty
    const registrationError = req.session.registrationError;
    const passwordnotMatch = req.body.passwordnotMatch;
    res.render("signup", { registrationError, bodyEmitty, passwordnotMatch },(err,html)=>{
        if(err){
            return
        }
        delete req.session.bodyEmitty
        delete req.session.registrationError
        delete req.body.passwordnotMatch;
        res.send(html)
    });
}

exports.userDeatails = (req, res) => {
    const nemail = req.query.email
    const pos = req.query.position || 0;
    userDb.find({ email: nemail })
        .then(userdata => {
            console.log(userdata)
            res.render("useracDeatails", { users: userdata, a: pos })
            // res.send(userdata[0].address)
        }).catch(err => {
            console.log(err)
            res.send(err)
        })

}


exports.address = (req, res) => {
    const id = req.query.id
    res.render("address", { id: id })
}


exports.forgotget = (req, res) => {
    res.render("forgotPass", { error: req.session.forgottemailError }, (err, html) => {
        if (err) {
            console.log('Render error', err);
            return res.status(500).send('Internal server Error');
        }

        delete req.session.forgottemailError;

        res.status(200).send(html);
    })
}


exports.redirectForgot = (req, res) => {
    const email = req.query.email
    res.render("forgotMain", { email: email, error: req.session.passcpass, seccess: req.session.changesuccess }, (err, html) => {
        if (err) {
            res.send("internel server errror")
        } else {
            // delete req.session.passcpass
            res.send(html)
        }
    })
}

exports.checkout=(req,res)=>{
    const totalPrice=req.body.totalsum
    const userEmail = req.session.isAuth;
    const index=req.query.index || 0
    const prId=req.query.prId
    if(prId){
        req.session.prLength=null
    }
    axios.get(`http://localhost:3000/api/checkout?&email=${userEmail}`)
    .then(response=>{
        axios.get(`http://localhost:3000/cart/count?&email=${userEmail}`)
        .then(countRes=>{
            const userData=response.data
            const prLength=countRes.data.length
            if(!prId){
                req.session.prLength=prLength
            }
            res.render("checkout", { userData: userData, total: totalPrice, a: index ,prId:prId});

        })
      
    })
    .catch(error => {
        // Handle errors from the API call
        console.error("Error fetching data:", error);
        res.status(500).send("Internal Server Error");
    });
  
}


exports.changeAddress=(req,res)=>{
       const prId=req.query.prId
        const index=req.query.index ||0
        const userEmail = req.session.isAuth;
        const price=req.body.total
    axios.get(`http://localhost:3000/api/checkout?&email=${userEmail}`)
    .then(response=>{
        res.render("checkout",{userData:response.data,total:price,a:index,prId:prId})
    })
}   


exports.checkoutAddAddress=(req,res)=>{  
    const prId=req.query.prId
    const id = req.query.id
    const total= req.body.total
    res.render("checkoutAddAddress.ejs",{id:id,total:total,prId:prId})  
}


exports.orderSuccess=(req,res)=>{
    if(req.session.isAuth){
        res.render("orderSuccess")
    }else{
        res.redirect("/")
    }
 
}


exports.userOrders=(req,res)=>{
    const email=req.session.isAuth
    axios.get(`http://localhost:3000/order/list/user?email=${email}`)
    .then(response=>{
        res.render("userOrders",{data:response.data})
    })
}


exports.reason=(req,res)=>{
    const id=req.query.id
    res.render("reason",{email:req.session.isAuth,id:id})
  }
  

  
exports.userOrdersDeatails=(req,res)=>{
    const id=req.query.id
    res.render('userOrderDetails',{id:id})
}   


exports.payment=(req,res)=>{
    req.session.OrderInfo=req.body
    console.log(req.session.OrderInfo.locality+" this is address req.body")
    console.log(req.body.email+'  this is body')
    const prId=req.query.prId
    prLength=req.session.prLength
    req.session.prLength=null
    axios.get(`http://localhost:3000/fetch-wallet-total?email=${req.session.isAuth}`)
    .then(response=>{
            const totalSumofWallet=response.data?.wallet?.totalAmount
      
            console.log(totalSumofWallet)
            res.render("payment",{prId:prId?prId:null,details:req.body,prLength:prLength?prLength:1,totalSumofWallet:totalSumofWallet})

    })
    
}



exports.wallet=(req,res)=>{
    const email=req.session.isAuth
    axios
    .get(`http://localhost:3000/wallet-fetch?email=${email}`)
    .then(response=>{
        res.render("wallet",{email:req.session.isAuth,userData:response.data})
    })
  
}