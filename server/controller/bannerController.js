const bannerDb = require("../model/bannerSchema")
const categoryDb = require("../model/categorySchema")

exports.getBanners= async(req,res)=>{
   const banners= await bannerDb.find({active:true})
   res.render("admin/adminBanners",{banners:banners})
}


exports.addBanner=(req,res)=>{
    res.render("admin/addBanner")
}