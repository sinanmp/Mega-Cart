const coupenDb=require("../model/coupenModel")
const userDb=require("../model/userModel")


exports.addCoupenPost=async(req,res)=>{
    console.log("here coming")
    try {
        const NewCoupen=new coupenDb({
            code:req.body.couponCode,
            discountPercentage:req.body.discount,
            expirationDate:req.body.expiryDate,
            createdAt:req.body.validDate,
        })
        await NewCoupen.save()
        res.redirect("/coupen/api")
    } catch (error) {
        
    }
}


exports.getCoupens=async(req,res)=>{
  const coupenDatas= await  coupenDb.find({active:true,expired:false})
  res.send(coupenDatas)
}



exports.expiredCoupens=async(req,res)=>{
    const expiredCoupens=await coupenDb.find({active:false, expired:true})

    res.render("admin/expiredCoupens",{coupens:expiredCoupens})
}



exports.unlistCoupens=(req,res)=>{
    const id=req.query.id
    res.json(id)
}