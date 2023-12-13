const wishdb=require("../model/wishlistSchema")
const productDb = require("../model/productModel")


exports.wishAdd = (req, res) => {
    const prid = req.query.id
    const email = req.query.email
    // res.send(email)
    if (req.session.isAuth) {
        const wishlist = new wishdb({
            prId: prid,
            email: email
          })
          wishdb.findOne({email:email,prId:prid})
          .then(wishdata=>{
            if(wishdata){
              wishdb.deleteOne({email:email,prId:prid})
              .then(data=>{
                  res.redirect(`/single/prd?id=${prid}`);
              })
            }else{
              wishlist.save()
              .then(data => {
                res.redirect(`/single/prd?id=${prid}`);
              }).catch(err=>{
                
              })
            }
          })
      
    }else{
        res.send("you need to login")
    }
  }

  exports.wishaddcart=(req,res)=>{
    const prid = req.query.id
    const email = req.query.email
    // res.send(email)
    if (req.session.isAuth) {
        const wishlist = new wishdb({
            prId: prid,
            email: email
          })
          wishdb.findOne({email:email,prId:prid})
          .then(wishdata=>{
            if(wishdata){
              wishdb.deleteOne({email:email,prId:prid})
              .then(data=>{
                  res.redirect(`/wishlist?email=${req.session.isAuth}`);
              })
            }else{
              wishlist.save()
              .then(data => {
                res.redirect(`/wishlist?email=${req.session.isAuth}`);
              }).catch(err=>{
                
              })
            }
          })
      
    }else{
        res.send("you need to login")
    }
  }




  exports.cartToWishlist=(req,res)=>{
    const email=req.query.email
    const id=req.query.id

    wishdb.findOne({email:email,prId:id})
    .then(wishdata=>{
      if(wishdata){
        wishdb.deleteOne({email:email,prId:id})
        .then(data=>{
          res.redirect(`/cart?email=${email}`)
        })
      }else{
        const wish=new wishdb({
          email:email, 
          prId:id
        })
        wish.save()
        .then(data=>{
          res.redirect(`/cart?email=${email}`)
        })
      }
    }).catch(err=>{
      res.send(err)
    })
  }







  exports.goTowishlist=(req,res)=>{
    const email=req.session.isAuth
    wishdb.aggregate([
        {
          $match: { email: email }
        },
    
        {
          $lookup: {
            from: 'productDb',
            localField: 'prId',
            foreignField: '_id',
            as: 'wishItems'
          }
        }
      ]).then(wishdata=>{
        const emails=wishdata.map(item => item.email)
        const productIds = wishdata.map(item => item.prId);
        productDb.find({_id:{$in: productIds}})
        .then(data=>{
            res.render("wishlist", { wishItems: data,email: email })
        })

      })
  }
  


  exports.removeWishlist=(req,res)=>{
    const email=req.query.email
    const id=req.query.id
    wishdb.deleteOne({prId:id,email:email})
    .then(data=>{
        res.redirect(`/wishlist?email=${email}`)
    }).catch(err=>{
        res.send(err)
    })
  }


  exports.wishApiHome=(req,res)=>{
    const prid = req.query.id
    const email = req.query.email
    // res.send(email)
    if (req.session.isAuth) {
        const wishlist = new wishdb({
            prId: prid,
            email: email
          })
          wishdb.find({email:email,prId:prid})
          .then(wishdata=>{
            if(wishdata){
                wishdb.deleteOne({email:email,prId:prid})
                .then(data=>{
                    res.redirect(`/?id=${prid}`);
                })
            }else{
              wishlist.save()
              .then(data => {
                  res.redirect(`/?id=${prid}`);
              }).catch(err=>{
  
              })
            }
          })
     
    }else{
        res.send("you need to login")
    }
  }