


exports.paymentMiddleware=(req,res,next)=>{
    if(req.session.paymentMidd=='true'){
        res.redirect("/")
    }else{
        next()
    }
}


exports.isAuthMiddleware=(req,res,next)=>{
    if(req.session.isAuth){
        next()
    }else{
        res.redirect(`/login?authenticationFailed=${true}`)
    }
}