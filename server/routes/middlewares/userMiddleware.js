


exports.paymentMiddleware=(req,res,next)=>{
    if(req.session.paymentMidd=='true'){
        res.redirect("/")
    }else{
        next()
    }
}