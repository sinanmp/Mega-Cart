const mongoose = require('mongoose');
const reviewDb= require("../model/reviewsSchema")
const productDb= require("../model/productModel")



exports.reviewGet=(req,res)=>{
    const id=req.query.id
    res.render("reviews",{id:id ,imgUrl:req.query.imgUrl})
  }
  
  
  
  
  exports.reviewSubmit=async(req,res)=>{
    
    try {
            const newReview=new reviewDb({
                email:req.session.isAuth,
                title:req.body.title,
                productId: req.query.id,
                rating:Number(req.body.rating),
                description:req.body.description
        })
        if(req.session.isAuth){
           await newReview.save()
           res.redirect('/single/prd?success=true')
        }else{
            res.json({messege:"you need to login again"})
        }
    } catch (error) {
        res.send(error)
        console.log(error)
    }

  
  }