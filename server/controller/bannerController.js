const { AwsInstance } = require("twilio/lib/rest/accounts/v1/credential/aws")
const bannerDb = require("../model/bannerSchema")
const categoryDb = require("../model/categorySchema")

exports.getBanners= async(req,res)=>{
   const banners= await bannerDb.find({active:true})
   res.render("admin/adminBanners",{banners:banners})
}


exports.addBanner= async(req,res)=>{
   const categories= await categoryDb.find({status:true})
    res.render("admin/addBanner",{categories:categories})
}


exports.addPost= async(req,res)=>{
    try {
        const newBanner=new bannerDb({
            title:req.body.title,
            discription: req.body.discription,
            category:req.body.category,
            image:req.files[0].filename
           })
           await newBanner.save() 
           res.redirect("/banners/api")
        
    } catch (error) {
      console.log(error)
      res.send(error)
    }
}